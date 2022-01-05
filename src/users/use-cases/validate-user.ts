import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IValidateUser } from '../contracts/validate-user';
import { UserRepository } from '../users.repository';
import { ValidatePassword } from './validate-password';

@Injectable()
export class ValidateUser implements IValidateUser {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private validatePassword: ValidatePassword,
  ) {}

  async execute(params: IValidateUser.Params): IValidateUser.Response {
    const { password, email } = params;
    const user = await this.userRepository.findOne({ email });
    if (!user) return null;
    if (!(await this.validatePassword.execute({ password, hash: user.password }))) return null;
    return user;
  }
}
