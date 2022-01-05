import { mock } from 'jest-mock-extended';
import { ProductEntity } from '../../../src/products/entities/product.entity';

import { ProductRepository } from '../../../src/products/products.repository';
import { ReadProduct } from '../../../src/products/use-cases/read-product';

describe('CreateProduct', () => {
  const mockProductRepository = mock<ProductRepository>();
  const sut = new ReadProduct(mockProductRepository);

  const mockProduct: ProductEntity = {
    productId: '8c9746c2-9ef6-4908-9e67-a4211d6557c2',
    name: 'Teste',
    createdAt: new Date('2022-01-03T16:48:04.868'),
    updatedAt: new Date('2022-01-03T16:48:04.868'),
    deletedAt: null,
    hasId: null,
    remove: null,
    save: null,
    softRemove: null,
    reload: null,
    recover: null,
  };

  const mockProducts: [ProductEntity[], number] = [[mockProduct, mockProduct], 2];

  const params = { page: 1, limit: 5 };

  it('should read the products if everything is correct', async () => {
    mockProductRepository.readProduct.mockResolvedValueOnce(mockProducts);
    await expect(sut.execute(params)).resolves.toStrictEqual(mockProducts);
    expect(mockProductRepository.readProduct).toHaveBeenCalledWith(params.limit, params.page);
  });
});
