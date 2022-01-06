import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { InvalidCredentialsException } from '../../../src/users/exceptions/invalid-credentials-exception';
import { createApp } from '../../test-utils/create-app';
import { CreateUserDtoGenerator } from '../../users/generator/create-user-dto.generator';

describe('@POST /auth/sign-in', () => {
  let app: INestApplication;
  const { item: createUserDto } = CreateUserDtoGenerator.generate();
  jest.setTimeout(50000);

  beforeAll(async () => {
    const { app: application } = await createApp();
    app = application;
    await request(app.getHttpServer()).post(`/users/create-user`).send(createUserDto);
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('should return BadRequestException if data do not pass the validation pipe', async () => {
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send()
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.BAD_REQUEST);

        expect(body.errors).toStrictEqual({
          email: [
            'should not be empty',
            'must be a string',
            'must be shorter than or equal to 200 characters',
            'must be longer than or equal to 2 characters',
          ],
          password: [
            'should not be empty',
            'must be a string',
            'must be shorter than or equal to 200 characters',
            'must be longer than or equal to 2 characters',
          ],
        });
      });
  });

  it('should return InvalidCredentialsException if the password is wrong', async () => {
    const params = { email: createUserDto.email, password: createUserDto.password + 'errado' };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new InvalidCredentialsException().message);
      });
  });

  it('should return InvalidCredentialsException if the user does not exist', async () => {
    const params = { email: createUserDto.email + 'errado', password: createUserDto.password };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.UNAUTHORIZED);
        expect(body.errors).toStrictEqual(new InvalidCredentialsException().message);
      });
  });

  it('should return an access token if everything is okay', async () => {
    const params = { email: createUserDto.email, password: createUserDto.password };
    await request(app.getHttpServer())
      .post(`/auth/sign-in`)
      .send(params)
      .expect(({ status, body }) => {
        expect(status).toBe(HttpStatus.CREATED);
        expect(body.accessToken).toBeDefined();
      });
  });
});
