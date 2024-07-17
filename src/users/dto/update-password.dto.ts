import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  newPassword: string;
}
