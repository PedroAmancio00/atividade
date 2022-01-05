import { CreateUserDto } from '../dtos/create-user';

export interface ICreateUser {
  execute: (params: ICreateUser.Params) => ICreateUser.Response;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICreateUser {
  export type Params = CreateUserDto;
  export type Response = Promise<{ message: string }>;
}
