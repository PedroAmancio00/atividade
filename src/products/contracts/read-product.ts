import { QueryProductDto } from '../dtos/query-product';
import { ProductEntity } from '../entities/product.entity';

export interface IReadProduct {
  execute: (params: IReadProduct.Params) => IReadProduct.Response;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IReadProduct {
  export type Params = QueryProductDto;
  export type Response = Promise<[ProductEntity[], number]>;
}
