export interface IDeleteProduct {
  execute: (params: IDeleteProduct.Params) => IDeleteProduct.Response;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IDeleteProduct {
  export type Params = string;
  export type Response = Promise<{ message: string }>;
}
