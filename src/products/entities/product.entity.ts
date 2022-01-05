import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/dtos/entities/base.entity';

@Entity('products', { schema: 'public' })
export class ProductEntity extends BaseEntity {
  @Column('character varying', { length: 200 })
  name: string;

  @Column('decimal', { precision: 9, scale: 2 })
  price: number;
}
