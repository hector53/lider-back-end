import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { compare } from 'bcrypt';
import { stat } from 'fs';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto) {
    // const createdUser = new this.userModel(createUserDto);
    //return createdUser.save();
    const { password } = createUserDto;
    const plainToHash = await hash(password, 10);
    //ahora reescribimos el userObject con la nueva password
    createUserDto = { ...createUserDto, password: plainToHash };
    return this.userModel.create(createUserDto);
  }

  async findAll(page: number, limit: number, search: string) {
    console.log('-------------------------------');
    page = Number(page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log('endIndex', endIndex);
    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await this.userModel
      .find(query, { password: 0 })
      .skip(startIndex)
      .limit(limit);
    const count: number = await this.userModel.countDocuments(query);
    console.log('count', count);
    const totalPages: number = Math.ceil(count / limit);

    const hasNextPage: boolean = endIndex < count;
    const hasPreviousPage: boolean = startIndex > 0;
    console.log('page', page);
    const nextPage: number = hasNextPage ? page + 1 : null;
    console.log('nextPage', nextPage);
    const previousPage: number = hasPreviousPage ? page - 1 : null;
    return {
      users: users,
      count,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    };
  }

  findOne(id: string) {
    return this.userModel.findById(id).select('-password');
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log('id user service', id);
    console.log('updateUserDto', updateUserDto);
    const userById = await this.userModel.findById(id);
    if (!userById) throw new NotFoundException(`User with ID ${id} not found`);
    //comprobar password si es diferente:
    const updateParams: UpdateUserDto = {
      fullName: updateUserDto.fullName,
      email: updateUserDto.email,
      role: updateUserDto.role,
    };
    if (updateUserDto.password != 'User1234*') {
      console.log('cambio password');
      updateParams.password = updateUserDto.password;
    }
    const updatePassword = await this.userModel.updateOne(
      { _id: id },
      { $set: updateParams },
    );
    if (!updatePassword) throw new HttpException('NEW_PASSWORD_ERROR', 403);
    return true;
  }

  async updateStatusUser(id: string, status: boolean) {
    console.log('status', status);
    const userById = await this.userModel.findById(id);
    if (!userById) throw new NotFoundException(`User with ID ${id} not found`);
    const updateUserStatus = await this.userModel.updateOne(
      { _id: id },
      { $set: { active: status } },
    );
    if (!updateUserStatus) throw new HttpException('ERROR', 403);
    return true;
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    //asasd
    const userById = await this.userModel.findById(id);
    if (!userById) throw new NotFoundException(`User with ID ${id} not found`);
    const checkPassword = await compare(
      updatePasswordDto.current_password,
      userById.password,
    );
    if (!checkPassword)
      throw new HttpException('CURRENT_PASSWORD_INCORRECT', 403);
    const plainToHash = await hash(updatePasswordDto.new_password, 10);
    const updatePassword = await this.userModel.updateOne(
      { _id: id },
      { $set: { password: plainToHash } },
    );

    if (!updatePassword) throw new HttpException('NEW_PASSWORD_ERROR', 403);
    return true;
  }

  remove(id: string) {
    console.log('borrar id: ', id);
    return this.userModel.findByIdAndDelete(id);
  }
}
