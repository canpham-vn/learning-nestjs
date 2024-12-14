import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Chịu trách nhiệm trích xuất JWT từ req và kiểm tra token có hợp lệ không
 * Nếu hợp lệ, thì cho phép người có thể tiếp tục truy cập api
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
    });
  }

  /**
   * Không cần xử lý validate ở đây, vì nó đã được validate từ thư viện passport
   * và chỉ cần turn thông tin id cho controller
   */
  validate(payload: AuthJwtPayload) {
    return { id: payload.sub };
  }
}
