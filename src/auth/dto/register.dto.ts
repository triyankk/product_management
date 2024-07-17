import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  // Adding the role property
  @IsString()
  @IsNotEmpty()
  role: string;
}
