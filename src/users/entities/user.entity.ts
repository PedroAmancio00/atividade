import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'public' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('varchar', { length: 200 })
  email: string;

  @Column('varchar', { length: 200 })
  salt: string;

  @Column('varchar')
  password: string;
}
