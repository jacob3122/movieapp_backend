import { BadRequestException, Injectable } from '@nestjs/common';
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
    if (!createUserDto.phNumber)
      throw new BadRequestException({
        message: 'The mobile number is mandatory',
      });
    const number = Number(createUserDto.phNumber);

    const isNumberValid = (strNumber) => {
      let consecutiveCount = 1;
      for (let i = 1; i < strNumber.length; i++) {
        if (strNumber[i] === strNumber[i - 1]) {
          // If the current digit is the same as the previous one, increment the count
          consecutiveCount++;
          if (consecutiveCount > 3) {
            // If more than 3 consecutive repeating digits, it's invalid
            return false;
          }
        } else {
          // Reset the count if the current digit is different
          consecutiveCount = 1;
        }
      }

      // If all checks pass, the number is valid
      return true;
    };

    if (number.toString().length !== 10) {
      throw new BadRequestException(
        'The phone number should be atleast 10 digits',
      );
    } else if (Number(number.toString()[0]) >= 6) {
      if (isNumberValid(number.toString())) {
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
      } else {
        throw new BadRequestException('Invalid Phone number');
      }
    } else {
      throw new BadRequestException('Invalid Phone number');
    }
  }

  async getUserByPhNumber(
    phNumber: string,
  ): Promise<{ id: any; phNumber: string; access_token: string }> {
    const userInfo = await this.userRepository.findOne({ where: { phNumber } });

    return userInfo;
  }

  async updateAccessToken(
    data: any,
    userData: any,
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const updatedResult = await this.userRepository.update(
        { phNumber: userData },
        { access_token: data },
      );

      return {
        success: true,
        data: updatedResult,
        message: 'Successfully updated token',
      };
    } catch (err) {
      throw new BadRequestException(
        'Something went Wrong updating the access token',
      );
    }
  }

  async fetchAccessToken(userData: string){
    const receivedToken = await this.userRepository.findOne({where: {phNumber: userData}});
    return receivedToken.access_token;
  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async getHelloWorld() {
    return {data: 'Hello World'};
  }
}
