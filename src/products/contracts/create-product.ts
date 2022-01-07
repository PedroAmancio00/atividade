import { UserEntity } from '../../users/entities/user.entity';
import { CreateProductDto } from '../dtos/create-product';
import { ProductEntity } from '../entities/product.entity';

export interface ICreateProduct {
  execute: (params: ICreateProduct.Params) => ICreateProduct.Response;
}

export namespace ICreateProduct {
  export type Params = { createProductDto: CreateProductDto; user: UserEntity };
  export type Response = Promise<ProductEntity>;
}
