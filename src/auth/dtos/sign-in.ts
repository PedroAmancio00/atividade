import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
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
