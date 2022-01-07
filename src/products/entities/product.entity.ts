import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/dtos/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('products', { schema: 'public' })
export class ProductEntity extends BaseEntity {
  @Column('character varying', { length: 200 })
  name: string;

  @Column('decimal', { precision: 9, scale: 2 })
  price: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.id)
  @JoinColumn([{ name: 'userid', referencedColumnName: 'id' }])
  user: UserEntity;
}
