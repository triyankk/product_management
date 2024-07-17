import { Controller, Post, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from './schemas/user.schemas'

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }
    @Post('register')
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.usersService.login(loginUserDto);
    }

}

