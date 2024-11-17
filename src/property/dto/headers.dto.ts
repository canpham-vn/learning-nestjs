import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class HeadersDto {
  @IsString()
  // --- map access-token key inside the Headers object to accessToken property ---
  @Expose({ name: 'access-token' })
  accessToken: string;
}
