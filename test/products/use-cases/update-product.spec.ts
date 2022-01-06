import { mock } from 'jest-mock-extended';
import { ProductNotFoundException } from '../../../src/products/exceptions/product-not-found';

import { ProductRepository } from '../../../src/products/products.repository';
import { UpdateProduct } from '../../../src/products/use-cases/update-product';
import { UserEntityGenerator } from '../../users/generator/user-entity.generator';
import { CreateProductDtoGenerator } from '../generator/create-product-dto.generator';
import { ProductEntityGenerator } from '../generator/product-entity.generator';
import { v4 as uuid } from 'uuid';

describe('UpdateProduct', () => {
  const mockProductRepository = mock<ProductRepository>();
  const sut = new UpdateProduct(mockProductRepository);

  const { item: product } = ProductEntityGenerator.generate();
  const { item: updateProductDto } = CreateProductDtoGenerator.generate();
  const { item: user } = UserEntityGenerator.generate();
  const id = uuid();

  it('should return ProductNotFoundException if product is not found', async () => {
    mockProductRepository.findOne.mockResolvedValueOnce(null);
    await expect(sut.execute({ updateProductDto, user, id })).rejects.toThrow(ProductNotFoundException);
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      id,
      user,
    });
  });

  it('should update product if everything is correct', async () => {
    mockProductRepository.findOne.mockResolvedValueOnce(product);
    const productUpdated = product;
    productUpdated.name = updateProductDto.name;
    productUpdated.price = updateProductDto.price;
    mockProductRepository.save.mockResolvedValueOnce(productUpdated);
    await expect(sut.execute({ updateProductDto, user, id })).resolves.toBe(productUpdated);
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      id,
      user,
    });
  });
});
