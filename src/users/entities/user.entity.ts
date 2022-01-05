import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/dtos/entities/base.entity';

@Entity('users', { schema: 'public' })
export class UserEntity extends BaseEntity {
  @Column('character varying', { length: 200 })
  name: string;

  @Column('character varying', { length: 200 })
  email: string;

  @Column('character varying')
  password: string;
}
