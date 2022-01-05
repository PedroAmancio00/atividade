import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as platformFastify from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { DefaultExceptionsFilter } from '../../src/filters/default-exception';

export const createApp = async (): Promise<{
  app: INestApplication;
  connection: Connection;
}> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = module.createNestApplication<platformFastify.NestFastifyApplication>(new platformFastify.FastifyAdapter());

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: 400,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new DefaultExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  const connection: Connection = await app.get(Connection);

  return { app, connection };
};
