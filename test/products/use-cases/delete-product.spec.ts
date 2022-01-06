import { mock } from 'jest-mock-extended';

import { ProductNotFoundException } from '../../../src/products/exceptions/product-not-found';
import { ProductRepository } from '../../../src/products/products.repository';
import { DeleteProduct } from '../../../src/products/use-cases/delete-product';
import { v4 as uuid } from 'uuid';
import { ProductEntityGenerator } from '../generator/product-entity.generator';
import { UserEntityGenerator } from '../../users/generator/user-entity.generator';

describe('UpdateProduct', () => {
  const mockProductRepository = mock<ProductRepository>();
  const sut = new DeleteProduct(mockProductRepository);

  const { item: product } = ProductEntityGenerator.generate();
  const { item: user } = UserEntityGenerator.generate();
  const id = uuid();

  it('should return ProductNotFoundException if product is not found', async () => {
    mockProductRepository.findOne.mockResolvedValueOnce(null);
    await expect(sut.execute({ id, user })).rejects.toThrow(ProductNotFoundException);
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      id,
      user,
    });
  });

  it('should delete product if everything is correct', async () => {
    mockProductRepository.findOne.mockResolvedValueOnce(product);
    await expect(sut.execute({ id, user })).resolves.toBeUndefined();
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      id,
      user,
    });
  });
});
