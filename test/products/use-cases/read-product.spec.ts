import { mock } from 'jest-mock-extended';
import { ProductEntity } from '../../../src/products/entities/product.entity';

import { ProductRepository } from '../../../src/products/products.repository';
import { ReadProduct } from '../../../src/products/use-cases/read-product';
import { ProductEntityGenerator } from '../generator/product-entity.generator';

describe('CreateProduct', () => {
  const mockProductRepository = mock<ProductRepository>();
  const sut = new ReadProduct(mockProductRepository);

  const { item: product1 } = ProductEntityGenerator.generate();
  const { item: product2 } = ProductEntityGenerator.generate();
  const mockProducts: [ProductEntity[], number] = [[product1, product2], 2];

  const params = { page: 1, limit: 5, sortBy: 'price.ASC' };

  it('should read the products if everything is correct', async () => {
    mockProductRepository.readProduct.mockResolvedValueOnce(mockProducts);
    await expect(sut.execute(params)).resolves.toStrictEqual(mockProducts);
    expect(mockProductRepository.readProduct).toHaveBeenCalledWith({ limit: params.limit, page: params.page, sortBy: params.sortBy });
  });
});
