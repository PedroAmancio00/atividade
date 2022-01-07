import { SignInDto } from '../dtos/sign-in';

export interface ISignIn {
  execute: (params: ISignIn.Params) => ISignIn.Response;
}

export namespace ISignIn {
  export type Params = SignInDto;
  export type Response = Promise<{ accessToken: string }>;
}
