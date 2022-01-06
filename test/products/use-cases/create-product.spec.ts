import { mock } from 'jest-mock-extended';

import { ProductRepository } from '../../../src/products/products.repository';
import { CreateProduct } from '../../../src/products/use-cases/create-product';
import { UserEntityGenerator } from '../../users/generator/user-entity.generator';
import { CreateProductDtoGenerator } from '../generator/create-product-dto.generator';
import { ProductEntityGenerator } from '../generator/product-entity.generator';

describe('CreateProduct', () => {
  const mockProductRepository = mock<ProductRepository>();
  const sut = new CreateProduct(mockProductRepository);

  const { item: product } = ProductEntityGenerator.generate();
  const { item: createProductDto } = CreateProductDtoGenerator.generate();
  const { item: user } = UserEntityGenerator.generate();

  it('should register product if everything is correct', async () => {
    mockProductRepository.save.mockResolvedValueOnce(product);
    await expect(sut.execute({ createProductDto, user })).resolves.toBe(product);
    expect(mockProductRepository.create).toHaveBeenCalledWith({
      name: createProductDto.name,
      price: createProductDto.price,
      user,
    });
  });
});
