import { UserEntity } from '../entities/user.entity';

export interface IGetUserById {
  execute: (params: IGetUserById.Params) => IGetUserById.Response;
}

export namespace IGetUserById {
  export type Params = string;
  export type Response = Promise<UserEntity>;
}
