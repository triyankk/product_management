import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }
  async findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }
  async updatePassword(_id: string, newPassword: string): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userModel.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true }).exec();
  }
}
