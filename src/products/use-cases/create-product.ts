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
    const { createProductDto, user } = params;
    const { name, price } = createProductDto;
    const product = this.productRepository.create({
      user: user,
      name,
      price,
    });
    return this.productRepository.save(product);
  }
}
