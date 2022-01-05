import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CreateProductController } from './controllers/create-product';
import { ReadProductController } from './controllers/read-products';
import { UpdateProductController } from './controllers/update-product';

import { ProductRepository } from './products.repository';
import { CreateProduct } from './use-cases/create-product';
import { ReadProduct } from './use-cases/read-product';
import { UpdateProduct } from './use-cases/update-product';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository]), AuthModule],
  controllers: [CreateProductController, ReadProductController, UpdateProductController],
  providers: [CreateProduct, ReadProduct, UpdateProduct],
  exports: [],
})
export class ProductsModule {}
