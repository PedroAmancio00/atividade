import { SignInDto } from '../dtos/sign-in';

export interface ISignIn {
  execute: (params: ISignIn.Params) => ISignIn.Response;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ISignIn {
  export type Params = SignInDto;
  export type Response = Promise<{ accessToken: string }>;
}
