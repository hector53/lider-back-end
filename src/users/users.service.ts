import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
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
    const plainToHash = await hash(updatePasswordDto.password, 10);
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        password: plainToHash,
      },
      { new: true },
    );
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
