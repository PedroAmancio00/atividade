import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'João' })
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'teste@sof.to' })
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'teste1234' })
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  password: string;
}
