import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class QueryProductDto {
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  limit: number;
}
