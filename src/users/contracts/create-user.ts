import { CreateUserDto } from '../dtos/create-user';
import { UserEntity } from '../entities/user.entity';

export interface ICreateUser {
  execute: (params: ICreateUser.Params) => Promise<ICreateUser.Response>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICreateUser {
  export type Params = CreateUserDto;
  export type Response = UserEntity;
}
