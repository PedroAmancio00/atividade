import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IValidateUser } from '../contracts/validate-user';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials-exception';
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
    if (!user) throw new InvalidCredentialsException();
    const flag = await this.validatePassword.execute({ password, hash: user.password });
    if (!flag) throw new InvalidCredentialsException();
    return user;
  }
}
