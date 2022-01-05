import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('products', { schema: 'public' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column('character varying', { length: 200 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('boolean', { default: false })
  deleted: boolean;
}
