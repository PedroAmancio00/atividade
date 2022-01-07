import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IGetUserById } from '../contracts/get-user-by-id';
import { UserRepository } from '../users.repository';

@Injectable()
export class GetUserById implements IGetUserById {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async execute(params: IGetUserById.Params): IGetUserById.Response {
    const user = await this.userRepository.findOne({ id: params });
    return user;
  }
}
