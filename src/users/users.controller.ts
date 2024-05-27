import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/Models/Dtos/user.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard)
  @Get('hello')
  getHello() {
    return this.userService.getHelloWorld();
  }

  @Post('signUp')
  @UsePipes(ValidationPipe)
  async createUsers(@Body() createUserDto: CreateUserDto) {
    const checkExistingUSer = await this.userService.getUserByPhNumber(
      createUserDto.phNumber,
    );
    if (checkExistingUSer)
      throw new BadRequestException(
        'User already exist with this phone number',
      );
    return this.userService.createUser(createUserDto);
  }
}
