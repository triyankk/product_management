import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async register(registerDto: RegisterDto): Promise<User> {
    const user = await this.usersService.create(registerDto);
    return user;
  }

  async login(user: UserDocument): Promise<{ user: UserDocument, accessToken: string }> {
    const payload = { username: user.username, sub: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async changePassword(email: string, updatePasswordDto: UpdatePasswordDto): Promise<UserDocument> {
    const user = await this.usersService.findOneByEmail(email) as UserDocument;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    user.password = hashedPassword;

    return user.save();
  }
}
