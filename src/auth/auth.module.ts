import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SignInController } from './controllers/sign-in';
import { JwtStrategy } from './jwt.strategy';
import { SignIn } from './use-cases/sign-in';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRES_IN },
    }),
  ],
  controllers: [SignInController],
  providers: [JwtStrategy, SignIn],
  exports: [PassportModule],
})
export class AuthModule {}
