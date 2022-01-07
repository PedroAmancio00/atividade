import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfigTest = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST_TEST,
  port: Number(process.env.DB_PORT_TEST),
  username: process.env.DB_USER_TEST,
  password: process.env.DB_PASS_TEST,
  database: process.env.DB_NAME_TEST,
  entities: [`${__dirname}/../**/*.entity.{js,ts}`],
  dropSchema: true, // drop schema makes database clean every connection
  migrations: [`${__dirname}/../migrations/*.{js,ts}`],
  migrationsRun: true,
  synchronize: false,
  logging: false,
  cli: {
    migrationsDir: `${__dirname}/../migrations`,
  },
});
