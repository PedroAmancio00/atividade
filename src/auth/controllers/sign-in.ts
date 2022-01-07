import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ISignIn } from '../contracts/sign-in';

import { SignInDto } from '../dtos/sign-in';
import { SignIn } from '../use-cases/sign-in';

@Controller('auth')
export class SignInController {
  constructor(private signIn: SignIn) {}

  @ApiTags('Auth')
  @ApiOkResponse({
    content: {
      'application/json': {
        example: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyYjQ5YWFlLThjNjMtNGMzZi04OWRhLTQ3NWFmZWJkYTQ1MiIsImVtYWlsIjoidGVzdGVAc29mLnRvIiwiaWF0IjoxNjQxNDg1NzQ2LCJleHAiOjE2NDE0ODkzNDZ9.ZmnZu4gTfm-8A0eQ11UflDdCos4eWibIcSTmgIna_Rc',
        },
      },
    },
  })
  @ApiBody({ type: SignInDto })
  @Post('/sign-in')
  async handleConfirmUserAccount(@Body(ValidationPipe) signInDto: SignInDto): ISignIn.Response {
    return this.signIn.execute({
      ...signInDto,
    });
  }
}
