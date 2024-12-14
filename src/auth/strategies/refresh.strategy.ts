import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { Inject, Injectable } from '@nestjs/common';
import refreshJwtConfig from '../config/refresh-jwt.config';

/**
 * Tương tự jwt strategy token
 * Chịu trách nhiệm trích xuất refresh token từ req và kiểm tra refresh token có hợp lệ không
 * Nếu hợp lệ, tạo mới token
 */

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJwtConfiguration.secret,
      ignoreExpiration: false,
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
