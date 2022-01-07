import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../users/entities/user.entity';
import { GetUserById } from '../users/use-cases/get-user-by-id';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private getUserById: GetUserById) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<UserEntity> {
    const user = await this.getUserById.execute(payload.id);
    return user;
  }
}
