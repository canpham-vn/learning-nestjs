import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { Inject, Injectable } from '@nestjs/common';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { Request } from 'express';
import { AuthService } from '../auth.service';

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
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJwtConfiguration.secret,
      ignoreExpiration: false,
      // để có thể truy cập req trong callback (hàm validate)
      passReqToCallback: true,
    });
  }

  /**
   * Không cần xử lý validate ở đây, vì nó đã được validate từ thư viện passport
   * và chỉ cần turn thông tin id cho controller
   */
  validate(req: Request, payload: AuthJwtPayload) {
    // authorization: Bearer abcxyz
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    const userId = payload.sub;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
