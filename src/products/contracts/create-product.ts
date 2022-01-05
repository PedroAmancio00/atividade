import { CreateProductDto } from '../dtos/create-product';

export interface ICreateProduct {
  execute: (params: ICreateProduct.Params) => ICreateProduct.Response;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICreateProduct {
  export type Params = CreateProductDto;
  export type Response = Promise<{ message: string }>;
}
