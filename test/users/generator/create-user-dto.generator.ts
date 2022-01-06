import * as faker from 'faker';

import { BaseGenerator, IGenerated } from '../../../src/common/generator/base-generator';
import { CreateUserDto } from '../../../src/users/dtos/create-user';

const createUserDtoGenerator = (): CreateUserDto => {
  const createUserDto = new CreateUserDto();
  createUserDto.email = faker.internet.email().toLowerCase();
  createUserDto.name = `${faker.name.firstName()}ab`;
  createUserDto.password = `123Change@`;
  return createUserDto;
};

export class CreateUserDtoGenerator extends BaseGenerator {
  public static generate(count = 1): IGenerated<CreateUserDto> {
    return this.generator(() => createUserDtoGenerator(), count);
  }
}
