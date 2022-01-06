import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseDto } from '../../common/dtos/base.dto';

export class ResponseReadProductsDto extends BaseDto {
  @ApiProperty({ example: '36cce98e-e969-42d8-ab58-fdd0586d2813' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Bolha de sabão' })
  @Expose()
  name: string;

  @ApiProperty({ example: 10.8 })
  @Expose()
  price: string;
}
