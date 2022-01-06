import { CreateUserDto } from '../dtos/create-user';
import { UserEntity } from '../entities/user.entity';

export interface ICreateUser {
  execute: (params: ICreateUser.Params) => ICreateUser.Response;
}

export namespace ICreateUser {
  export type Params = CreateUserDto;
  export type Response = Promise<UserEntity>;
}
