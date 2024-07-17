import { IsString, IsInt, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    name: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    password: string;

    @IsInt()
    age: number;

    @IsEmail()
    email: string;
}