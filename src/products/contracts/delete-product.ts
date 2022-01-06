export interface IDeleteProduct {
  execute: (params: IDeleteProduct.Params) => IDeleteProduct.Response;
}

export namespace IDeleteProduct {
  export type Params = string;
  export type Response = Promise<void>;
}
