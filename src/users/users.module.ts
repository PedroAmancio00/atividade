import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserController } from './controllers/create-user';
import { CreateUser } from './use-cases/create-user';
import { HashPassword } from './use-cases/hash-password';
import { ValidatePassword } from './use-cases/validate-password';
import { ValidateUser } from './use-cases/validate-user';
import { UserRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [CreateUserController],
  providers: [CreateUser, HashPassword, ValidateUser, ValidatePassword],
  exports: [ValidateUser],
})
export class UsersModule {}
