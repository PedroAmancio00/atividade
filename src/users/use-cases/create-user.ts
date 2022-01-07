import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ICreateUser } from '../contracts/create-user';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists';
import { UserRepository } from '../users.repository';
import { HashPassword } from './hash-password';

@Injectable()
export class CreateUser implements ICreateUser {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private hashPassword: HashPassword,
  ) {}

  async execute(params: ICreateUser.Params): ICreateUser.Response {
    const { email, name, password } = params;
    const userExists = await this.userRepository.findOne({ email });
    if (userExists) throw new EmailAlreadyExistsException();
    const passwordHash = await this.hashPassword.execute({ password });
    const user = this.userRepository.create({
      email,
      name,
      password: passwordHash,
    });
    return await this.userRepository.save(user);
  }
}
