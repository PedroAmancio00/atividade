import { Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcrypt';
import { IHashPassword } from '../contracts/hash-password';

@Injectable()
export class HashPassword implements IHashPassword {
  async execute(params: IHashPassword.Params): IHashPassword.Response {
    const { password } = params;
    const salt = await genSaltSync();
    return hashSync(password, salt);
  }
}
