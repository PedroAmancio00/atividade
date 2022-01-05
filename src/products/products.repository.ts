import { EntityRepository, Repository } from 'typeorm';

import { ProductEntity } from './entities/product.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async readProduct(limit: number, page: number): Promise<[ProductEntity[], number]> {
    // limit = limit ? limit : 10;
    // page = page ? page : 1;
    const query = this.createQueryBuilder('products');
    query.where('products.deleted = false');
    query.skip((page - 1) * limit);
    query.take(limit);
    return query.getManyAndCount();
  }
}
