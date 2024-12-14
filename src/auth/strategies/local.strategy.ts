import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * Gọi là local strategy: vì đây là 1 chiến lược authentication dựa vào username và password được lưu trữ cục bộ trong db
 * Có nhiều chiến lược khác như authentication với FB, Google,...
 */

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      /**
       * Vì trong dự án này dùng trường email để làm username, nên cần config để  PassportStrategy hiểu nó là username
       * Ngoài ra, nếu trường password trong dự án này không phải là password, thì cũng cần phải config để  match với password của PassportStrategy
       */
      usernameField: 'email',
    });
  }

  validate(email: string, password: string) {
    return this.authService.validateUser(email, password);
  }
}
