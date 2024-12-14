import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found!');

    /**
     * Sử dụng hàm compare từ bcrypt để so sánh password từ request với password được hashing trong db
     * Không cần sử dụng salt round vì trong password sau khi hashing đã chứa thông tin salt round và hàm compare có thể dựa vào đó để so sánh
     */
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials!');

    /**
     * chỉ cần return id là đủ.
     * Vì trong user object có nhiều trường không cần thiết và không nên return như password,...
     */
    return { id: user.id };
  }

  login(userId: number) {
    // payload là 1 object chưa thông tin được jwt mã hóa và được gửi cho client
    const payload: AuthJwtPayload = { sub: userId };

    /**
     * token dùng để xác thực user có hợp lệ hay không
     * khi người dùng truy cập các api có auth, cần truyền token trong header của req để xác thực
     */
    const token = this.jwtService.sign(payload);
    /**
     * Khi token hết hạn, client sẽ gửi refreshToken để thông báo làm mới token
     */
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    return {
      id: userId,
      token,
      refreshToken,
    };
  }

  refreshToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const token = this.jwtService.sign(payload);

    return {
      id: userId,
      token,
    };
  }
}
