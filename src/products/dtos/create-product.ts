import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Bolha de sabão' })
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 10.8 })
  @Max(9999999.99)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
