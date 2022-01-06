import { CreateUserDto } from '../dtos/create-user';

export interface ICreateUser {
  execute: (params: ICreateUser.Params) => ICreateUser.Response;
}

export namespace ICreateUser {
  export type Params = CreateUserDto;
  export type Response = Promise<{ message: string }>;
}
