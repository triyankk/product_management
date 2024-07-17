import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret123',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneByEmail(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.sub, username: user.username, role: user.role };
  }
}
