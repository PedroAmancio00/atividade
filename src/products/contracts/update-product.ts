import { UpdateProductDto } from '../dtos/update-product';

export interface IUpdateProduct {
  execute: (params: IUpdateProduct.Params) => IUpdateProduct.Response;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IUpdateProduct {
  export type Params = { updateProductDto: UpdateProductDto; id: string };
  export type Response = Promise<{ message: string }>;
}
