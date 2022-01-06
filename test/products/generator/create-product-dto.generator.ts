import * as faker from 'faker';

import { BaseGenerator, IGenerated } from '../../../src/common/generator/base-generator';
import { CreateProductDto } from '../../../src/products/dtos/create-product';

const createProductDtoGenerator = (): CreateProductDto => {
  const createProductDto = new CreateProductDto();
  createProductDto.name = `${faker.commerce.productName()}ab`;
  createProductDto.price = Math.floor(Math.random() * 1000000) / 100;
  return createProductDto;
};

export class CreateProductDtoGenerator extends BaseGenerator {
  public static generate(count = 1): IGenerated<CreateProductDto> {
    return this.generator(() => createProductDtoGenerator(), count);
  }
}
