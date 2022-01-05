export interface IHashPassword {
  execute: (params: IHashPassword.Params) => IHashPassword.Response;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IHashPassword {
  export type Params = { password: string };
  export type Response = Promise<string>;
}
