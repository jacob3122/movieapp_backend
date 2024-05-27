import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    signInDto: CreateUserDto,
  ): Promise<{ data: any; access_token: string }> {
    const user = await this.usersService.getUserByPhNumber(signInDto.phNumber);

    if (!user) {
      throw new BadRequestException('No such user exists!');
    }

    const payload = { sub: user.phNumber };

    // { id: '1', phNumber: '7560845849' }

    const resp = await this.jwtService.signAsync(payload);
    await this.usersService.updateAccessToken(resp, signInDto.phNumber);

    return { data: user, access_token: resp };
  }

  async updateToken(updatedToken: string, userData: string) {
    await this.usersService.updateAccessToken(updatedToken, userData);
  }

  async fetchToken(userData: string) {
    const tokenResponse = await this.usersService.fetchAccessToken(userData);
    return tokenResponse;
  }
}
