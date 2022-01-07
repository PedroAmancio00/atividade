import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import { ProductEntity } from '../../../src/products/entities/product.entity';
import { createApp } from '../../test-utils/create-app';
import { CreateUserDtoGenerator } from '../../users/generator/create-user-dto.generator';
import { CreateProductDtoGenerator } from '../generator/create-product-dto.generator';

describe('@GET /products/read-product', () => {
  let app: INestApplication;
  let connection: Connection;
  let accessToken: string;
  let product: ProductEntity;
  jest.setTimeout(50000);

  beforeAll(async () => {
    const { app: application, connection: conn } = await createApp();
    app = application;
    connection = conn;
    const { item: createUserDto } = CreateUserDtoGenerator.generate();
    await request(app.getHttpServer()).post(`/users/create-user`).send(createUserDto);
    const params = { email: createUserDto.email, password: createUserDto.password };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });

    const { list: createProductDto } = CreateProductDtoGenerator.generate(5);
    await request(app.getHttpServer()).post(`/products/create-product`).send(createProductDto[0]).auth(accessToken, { type: 'bearer' });
    await request(app.getHttpServer()).post(`/products/create-product`).send(createProductDto[1]).auth(accessToken, { type: 'bearer' });
    await request(app.getHttpServer()).post(`/products/create-product`).send(createProductDto[2]).auth(accessToken, { type: 'bearer' });
    await request(app.getHttpServer()).post(`/products/create-product`).send(createProductDto[3]).auth(accessToken, { type: 'bearer' });
    await request(app.getHttpServer())
      .post(`/products/create-product`)
      .send(createProductDto[4])
      .auth(accessToken, { type: 'bearer' })
      .then((body) => {
        product = JSON.parse(body.text);
      });
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('should return UnauthorizedException if user does not authenticate', async () => {
    await request(app.getHttpServer())
      .get(`/products/read-product`)
      .send()
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new UnauthorizedException().message);
      });
  });

  it('should return BadRequestException if data do not pass the validation pipe and user is authenticated', async () => {
    await request(app.getHttpServer())
      .get(`/products/read-product`)
      .send()
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.BAD_REQUEST);

        expect(body.errors).toStrictEqual({
          page: ['should not be empty', 'must be a number conforming to the specified constraints', 'must be a positive number'],
          limit: ['should not be empty', 'must be a number conforming to the specified constraints', 'must be a positive number'],
          sortBy: ['should not be empty', 'must match /[a-z]+\\.(asc|desc)/i regular expression', 'must be a string'],
        });
      });
  });

  it('should return the products if everything is okay and filter was not provided', async () => {
    const params = { page: 1, limit: 3, sortBy: 'price.ASC' };
    let products: ProductEntity[] = await connection.createQueryBuilder().select('*').from(ProductEntity, 'products').execute();
    products = products.sort((a: ProductEntity, b: ProductEntity) => a.price - b.price);
    products = products.slice(0, 3);
    const productsMaped = products.map((product: ProductEntity) => {
      return { id: product.id, name: product.name, price: String(product.price) };
    });
    await request(app.getHttpServer())
      .get(`/products/read-product`)
      .query(params)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.OK);
        expect(body.rows).toStrictEqual(productsMaped);
      });
  });

  it('should return the products filtered if everything is okay and filter was provided', async () => {
    const params = { page: 1, limit: 3, sortBy: 'price.ASC', nameFilter: product.name };
    let products: ProductEntity[] = await connection.createQueryBuilder().select('*').from(ProductEntity, 'products').execute();
    products = products.filter((productF) => {
      if (productF.name === product.name) return product;
    });
    products = products.sort((a: ProductEntity, b: ProductEntity) => (a.price < b.price ? -1 : 1));
    products = products.slice(0, 3);
    const productsMaped = products.map((product: ProductEntity) => {
      return { id: product.id, name: product.name, price: String(product.price) };
    });
    await request(app.getHttpServer())
      .get(`/products/read-product`)
      .query(params)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.OK);
        expect(body.rows).toStrictEqual(productsMaped);
      });
  });
});
