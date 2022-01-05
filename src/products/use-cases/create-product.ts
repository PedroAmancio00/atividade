import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateProduct } from '../contracts/create-product';

import { ProductRepository } from '../products.repository';

@Injectable()
export class CreateProduct implements ICreateProduct {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute(params: ICreateProduct.Params): ICreateProduct.Response {
    const { name } = params;
    const product = this.productRepository.create({
      name,
    });
    await this.productRepository.save(product);
    return { message: 'Product created' };
  }
}
