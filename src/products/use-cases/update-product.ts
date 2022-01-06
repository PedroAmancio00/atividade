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
    const { updateProductDto, id, user } = params;
    const { name, price } = updateProductDto;
    const product = await this.productRepository.findOne({
      id,
      user,
    });
    if (!product) throw new ProductNotFoundException();
    product.name = name;
    product.price = price;
    return await this.productRepository.save(product);
  }
}
