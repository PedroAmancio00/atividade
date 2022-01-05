import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateProductDto {
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID(4)
  @IsNotEmpty()
  productId: string;
}
