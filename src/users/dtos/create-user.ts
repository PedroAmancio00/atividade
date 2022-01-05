import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  email: string;

  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  password: string;
}
