import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IReadProduct } from '../contracts/read-product';

import { ProductRepository } from '../products.repository';

@Injectable()
export class ReadProduct implements IReadProduct {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute(params: IReadProduct.Params): IReadProduct.Response {
    return this.productRepository.readProduct(params);
  }
}
