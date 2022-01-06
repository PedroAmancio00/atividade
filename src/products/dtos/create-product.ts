import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Max(9999999.99)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
