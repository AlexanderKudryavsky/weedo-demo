import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse  {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  accessExp: number;

  @ApiProperty()
  refreshExp: number;
}
