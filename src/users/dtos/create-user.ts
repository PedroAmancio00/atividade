import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  name: string;

  @MinLength(2)
  @MaxLength(200)
  email: string;

  @MinLength(2)
  @MaxLength(200)
  password: string;
}
