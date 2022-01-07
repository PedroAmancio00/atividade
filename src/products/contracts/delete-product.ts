import { UserEntity } from '../../users/entities/user.entity';

export interface IDeleteProduct {
  execute: (params: IDeleteProduct.Params) => IDeleteProduct.Response;
}

export namespace IDeleteProduct {
  export type Params = { id: string; user: UserEntity };
  export type Response = Promise<void>;
}
