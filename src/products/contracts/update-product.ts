import { UserEntity } from '../../users/entities/user.entity';
import { UpdateProductDto } from '../dtos/update-product';
import { ProductEntity } from '../entities/product.entity';

export interface IUpdateProduct {
  execute: (params: IUpdateProduct.Params) => IUpdateProduct.Response;
}

export namespace IUpdateProduct {
  export type Params = { updateProductDto: UpdateProductDto; id: string; user: UserEntity };
  export type Response = Promise<ProductEntity>;
}
