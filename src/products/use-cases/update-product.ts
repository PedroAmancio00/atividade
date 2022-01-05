import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUpdateProduct } from '../contracts/update-product';
import { ProductNotFoundException } from '../exceptions/product-not-found';
import { ProductRepository } from '../products.repository';

@Injectable()
export class UpdateProduct implements IUpdateProduct {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async execute(params: IUpdateProduct.Params): IUpdateProduct.Response {
    const { name, productId } = params;
    const product = await this.productRepository.findOne({
      productId,
    });
    if (!product) throw new ProductNotFoundException();
    product.name = name;
    await this.productRepository.save(product);
    return { message: 'Product updated' };
  }
}
