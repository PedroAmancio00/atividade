import { mock } from 'jest-mock-extended';

import { ProductRepository } from '../../../src/products/products.repository';
import { CreateProduct } from '../../../src/products/use-cases/create-product';

describe('CreateProduct', () => {
  const mockProductRepository = mock<ProductRepository>();
  const sut = new CreateProduct(mockProductRepository);

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

  const params = { name: 'teste' };

  it('should register product if everything is correct', async () => {
    mockProductRepository.save.mockResolvedValueOnce(mockProduct);
    await expect(sut.execute(params)).resolves.toStrictEqual({ message: 'Product created' });
    expect(mockProductRepository.create).toHaveBeenCalledWith({
      name: params.name,
    });
  });
});
