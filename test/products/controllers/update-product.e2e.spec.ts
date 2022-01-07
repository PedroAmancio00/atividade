import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { ProductEntity } from '../../../src/products/entities/product.entity';
import { ProductNotFoundException } from '../../../src/products/exceptions/product-not-found';
import { createApp } from '../../test-utils/create-app';
import { CreateUserDtoGenerator } from '../../users/generator/create-user-dto.generator';
import { CreateProductDtoGenerator } from '../generator/create-product-dto.generator';

describe('@PATCH /products/update-product', () => {
  let app: INestApplication;
  let connection: Connection;
  let accessToken: string;
  let product: any;
  jest.setTimeout(50000);

  beforeAll(async () => {
    const { app: application, connection: conn } = await createApp();
    app = application;
    connection = conn;
    const { item: createUserDto } = CreateUserDtoGenerator.generate();
    const { item: createProductDto } = CreateProductDtoGenerator.generate();
    await request(app.getHttpServer()).post(`/users/create-user`).send(createUserDto);
    const params = { email: createUserDto.email, password: createUserDto.password };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .then(({ body }) => {
        accessToken = body.accessToken;
      });
    await request(app.getHttpServer())
      .post(`/products/create-product`)
      .send(createProductDto)
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
      .patch(`/products/update-product/${product.id}`)
      .send()
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new UnauthorizedException().message);
      });
  });

  it('should return BadRequestException if data do not pass the validation pipe and user is authenticated', async () => {
    await request(app.getHttpServer())
      .patch(`/products/update-product/${product.id}`)
      .send()
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.BAD_REQUEST);

        expect(body.errors).toStrictEqual({
          name: [
            'should not be empty',
            'must be a string',
            'must be shorter than or equal to 200 characters',
            'must be longer than or equal to 2 characters',
          ],
          price: [
            'should not be empty',
            'must be a number conforming to the specified constraints',
            'must not be less than 0',
            'must not be greater than 9999999.99',
          ],
        });
      });
  });

  it('should return ProductNotFoundException if uuid is wrong', async () => {
    const id = uuid();
    const { item: updateProductDto } = CreateProductDtoGenerator.generate();
    await request(app.getHttpServer())
      .patch(`/products/update-product/${id}`)
      .send(updateProductDto)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(body.errors).toStrictEqual(new ProductNotFoundException().message);
      });
  });

  it('should return Product updated if everything is okay', async () => {
    const { item: updateProductDto } = CreateProductDtoGenerator.generate();
    await request(app.getHttpServer())
      .patch(`/products/update-product/${product.id}`)
      .send(updateProductDto)
      .auth(accessToken, { type: 'bearer' })
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.OK);
        expect(body).toBeDefined();
      });
    const validateProduct = await connection
      .createQueryBuilder()
      .select('*')
      .from(ProductEntity, 'products')
      .where('products.id =:id', { id: product.id })
      .execute();
    expect(validateProduct[0].name).toBe(updateProductDto.name);
    expect(validateProduct[0].price).toBe(String(updateProductDto.price));
  });
});
