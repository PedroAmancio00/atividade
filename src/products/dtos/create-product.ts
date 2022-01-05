import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProductDto {
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  name: string;
}
