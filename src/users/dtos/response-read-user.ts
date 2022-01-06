import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from '../../common/dtos/base.dto';

export class ResponseReadUserDto extends BaseDto {
  @ApiProperty({ example: 'd2c00c3c-e630-4ea6-bc78-1aa189fdf892' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Joao' })
  @Expose()
  name: string;
}
