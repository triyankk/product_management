import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
//MARK: Register
  async register(registerDto: RegisterDto): Promise<User> {
    const user = await this.usersService.create(registerDto);
    return user;
  }
//MARK: login
  async login(user: User): Promise<{ user: User, accessToken: string }> {
    const payload = { username: user.username, sub: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET') });
    return { user, accessToken };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
