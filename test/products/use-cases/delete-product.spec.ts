import { mock } from 'jest-mock-extended';

import { ProductNotFoundException } from '../../../src/products/exceptions/product-not-found';
import { ProductRepository } from '../../../src/products/products.repository';
import { DeleteProduct } from '../../../src/products/use-cases/delete-product';

describe('UpdateProduct', () => {
  const mockProductRepository = mock<ProductRepository>();
  const sut = new DeleteProduct(mockProductRepository);

  const mockProduct = {
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

  const params = '7a56309c-7cdb-4d03-8adb-efc717597b03';

  it('should return ProductNotFoundException if product is not found', async () => {
    mockProductRepository.findOne.mockResolvedValueOnce(null);
    await expect(sut.execute(params)).rejects.toThrow(ProductNotFoundException);
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      productId: params,
    });
  });

  it('should delete product if everything is correct', async () => {
    mockProductRepository.findOne.mockResolvedValueOnce(mockProduct);
    await expect(sut.execute(params)).resolves.toStrictEqual({ message: 'Product deleted' });
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      productId: params,
    });
  });
});
