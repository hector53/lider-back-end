import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { compare } from 'bcrypt';
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

  findAll() {
    return this.userModel.find({}, { password: 0 });
  }

  findOne(id: string) {
    return this.userModel.findById(id).select('-password');
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
