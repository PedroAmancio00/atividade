import { UserEntity } from '../entities/user.entity';

export interface IValidateUser {
  execute: (params: IValidateUser.Params) => IValidateUser.Response;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IValidateUser {
  export type Params = { email: string; password: string };
  export type Response = Promise<UserEntity>;
}
