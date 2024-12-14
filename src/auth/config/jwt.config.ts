import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    /**
     * Key an toàn để generate token
     * jwt dựa vào key này để xác thực token có hợp lệ hoặc dùng để parse dữ liệu được jwt mã hóa
     *  */
    secret: process.env.JWT_SECRET,
    signOptions: {
      // Hạn sử dụng của token
      expiresIn: process.env.JWT_EXPIRE_IN,
    },
  }),
);
