import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';

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

  async login(userId: number) {
    // // payload là 1 object chưa thông tin được jwt mã hóa và được gửi cho client
    // const payload: AuthJwtPayload = { sub: userId };

    // /**
    //  * token dùng để xác thực user có hợp lệ hay không
    //  * khi người dùng truy cập các api có auth, cần truyền token trong header của req để xác thực
    //  */
    // const token = this.jwtService.sign(payload);
    // /**
    //  * Khi token hết hạn, client sẽ gửi refreshToken để thông báo làm mới token
    //  */
    // const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    return { id: userId };
  }

  async signOut(userId: number) {
    await this.userService.updateHashedRefreshToken(userId, null);
  }
}
