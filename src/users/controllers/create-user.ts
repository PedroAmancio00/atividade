import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { CreateUserDto } from '../dtos/create-user';
import { CreateUser } from '../use-cases/create-user';

@Controller('users')
export class CreateUserController {
  constructor(private createUser: CreateUser) {}

  @Post('/create-user')
  async handleCreateUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{ message: string }> {
    return this.createUser.execute({
      ...createUserDto,
    });
  }
}
