export interface IValidatePassword {
  execute: (params: IValidatePassword.Params) => IValidatePassword.Response;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IValidatePassword {
  export type Params = { password: string; hash: string };
  export type Response = Promise<boolean>;
}
