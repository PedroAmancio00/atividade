import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';

export class QueryProductDto {
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  limit: number;

  @ApiProperty()
  @IsString()
  @Matches(/[a-z]+\.(asc|desc)/i)
  @IsNotEmpty()
  sortBy: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nameFilter?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userFilter?: string;
}
