import { Controller, Post, Body, UseGuards, Request, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { user, accessToken } = await this.authService.login(req.user);
    console.log(`User logged in: ${user.username} (${user.email})`);
    return { user, accessToken };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.changePassword(req.user.email, updatePasswordDto);
  }
}
