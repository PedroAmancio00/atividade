import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class QueryProductDto {
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  limit: number;
}
