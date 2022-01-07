import * as faker from 'faker';
import { v4 as uuid } from 'uuid';

import { BaseGenerator, IGenerated } from '../../../src/common/generator/base-generator';
import { ProductEntity } from '../../../src/products/entities/product.entity';

const productEntityGenerator = (): ProductEntity => {
  const productEntity = new ProductEntity();
  productEntity.id = uuid();
  productEntity.name = `${faker.commerce.productName()}ab`;
  productEntity.price = Math.floor(Math.random() * 1000000) / 100;
  productEntity.user = uuid();
  return productEntity;
};

export class ProductEntityGenerator extends BaseGenerator {
  public static generate(count = 1): IGenerated<ProductEntity> {
    return this.generator(() => productEntityGenerator(), count);
  }
}
