import { Expose } from 'class-transformer';
import { BaseDto } from '../../common/dtos/base.dto';

export class ResponseReadProductsDto extends BaseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  price: string;
}
