import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/Models';
import { CreateUserDto } from 'src/Models/Dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async getUserByPhNumber(phNumber: number) {
    return await this.userRepository.findOne({ where: { phNumber } });
  }

  async getUsers() {
    return await this.userRepository.find();
  }
}
