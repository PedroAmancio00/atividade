import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';

import { IValidatePassword } from '../contracts/validate-password';

@Injectable()
export class ValidatePassword implements IValidatePassword {
  async execute(params: IValidatePassword.Params): IValidatePassword.Response {
    const { password, hash } = params;
    return compareSync(password, hash);
  }
}
