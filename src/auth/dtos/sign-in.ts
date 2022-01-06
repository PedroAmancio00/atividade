import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'teste@sof.to' })
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'teste123' })
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  password: string;
}
