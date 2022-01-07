import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../dtos/create-user';
import { ResponseReadUserDto } from '../dtos/response-read-user';
import { CreateUser } from '../use-cases/create-user';

@Controller('users')
export class CreateUserController {
  constructor(private createUser: CreateUser) {}

  @ApiTags('Usuarios')
  @ApiCreatedResponse({ type: ResponseReadUserDto })
  @ApiBody({ type: CreateUserDto })
  @Post('/create-user')
  async handleCreateUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<ResponseReadUserDto> {
    const user = this.createUser.execute({
      ...createUserDto,
    });
    return ResponseReadUserDto.factory(ResponseReadUserDto, user);
  }
}
