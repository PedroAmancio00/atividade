import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IDeleteProduct } from '../contracts/delete-product';

import { ProductNotFoundException } from '../exceptions/product-not-found';
import { ProductRepository } from '../products.repository';

@Injectable()
export class DeleteProduct implements IDeleteProduct {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute(params: IDeleteProduct.Params): IDeleteProduct.Response {
    const product = await this.productRepository.findOne({
      id: params,
    });
    if (!product) throw new ProductNotFoundException();
    await this.productRepository.softDelete(product.id);
  }
}
