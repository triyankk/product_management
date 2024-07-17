import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;
}
