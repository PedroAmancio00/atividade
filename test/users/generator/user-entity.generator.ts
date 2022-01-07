import * as faker from 'faker';
import { v4 as uuid } from 'uuid';
import { BaseGenerator, IGenerated } from '../../../src/common/generator/base-generator';
import { UserEntity } from '../../../src/users/entities/user.entity';

const userEntityGenerator = (): UserEntity => {
  const userEntity = new UserEntity();
  userEntity.id = uuid();
  userEntity.email = faker.internet.email().toLowerCase();
  userEntity.name = `${faker.name.firstName()}ab`;
  userEntity.password = `123Change@`;
  return userEntity;
};

export class UserEntityGenerator extends BaseGenerator {
  public static generate(count = 1): IGenerated<UserEntity> {
    return this.generator(() => userEntityGenerator(), count);
  }
}
