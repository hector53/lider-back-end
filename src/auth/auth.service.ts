import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { find } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(userObjectLogin: LoginAuthDto) {
    console.log('userObjectLogin', userObjectLogin);
    //login service
    const { email, password } = userObjectLogin;
    const findUser = await this.UserModel.findOne({ email: email });
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);
    //ahora revisamos el password
    const checkPassword = await compare(password, findUser.password);
    if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);

    const payload = { id: findUser._id, email: findUser.email };
    const token = this.jwtService.sign(payload);

    const data = {
      user: {
        id: payload.id,
        fullName: findUser.fullName,
        email: findUser.email,
        role: findUser.role,
        updated: findUser.updated,
      },
      token: token,
    };
    return data;
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
