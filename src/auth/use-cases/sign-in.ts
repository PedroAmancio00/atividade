import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateUser } from '../../users/use-cases/validate-user';

import { ISignIn } from '../contracts/sign-in';

@Injectable()
export class SignIn implements ISignIn {
  constructor(private jwtService: JwtService, private validateUser: ValidateUser) {}

  async execute(params: ISignIn.Params): ISignIn.Response {
    const user = await this.validateUser.execute(params);
    const payload = { id: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
