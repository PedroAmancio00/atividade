import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { SignInDto } from '../dtos/sign-in';
import { SignIn } from '../use-cases/sign-in';

@Controller('auth')
export class SignInController {
  constructor(private signIn: SignIn) {}

  @Post('/sign-in')
  async handleConfirmUserAccount(@Body(ValidationPipe) signInDto: SignInDto) {
    return this.signIn.execute({
      ...signInDto,
    });
  }
}
