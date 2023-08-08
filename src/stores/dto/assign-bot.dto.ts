import { ApiProperty } from "@nestjs/swagger";

export enum BotTypes {
  'Telegram' = 'Telegram',
  'Line' = 'Line',
}

export class AssignBotDto {
  @ApiProperty({ enum: BotTypes })
  botType: BotTypes;

  @ApiProperty()
  externalStoreId: string;
}
