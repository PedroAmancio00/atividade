import { EntityRepository, Repository } from 'typeorm';
import { IReadProduct } from './contracts/read-product';

import { ProductEntity } from './entities/product.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async readProduct(params: IReadProduct.Params): Promise<[ProductEntity[], number]> {
    const { page, limit, sortBy, nameFilter, userFilter } = params;
    const query = this.createQueryBuilder('products');
    const [field, sortDirection] = <[string, 'ASC' | 'DESC']>sortBy.split('.');
    if (nameFilter) query.where('products.name = :nameFilter', { nameFilter });
    if (userFilter) query.where('products.user = :userFilter', { userFilter });
    query.orderBy(`products.${field}`, sortDirection);
    query.skip((page - 1) * limit);
    query.take(limit);
    return query.getManyAndCount();
  }
}
