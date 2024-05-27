import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @Matches('^[0-9]+$')
  phNumber: string;
}
