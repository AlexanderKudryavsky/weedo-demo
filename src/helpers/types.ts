import { ApiProperty } from "@nestjs/swagger";

export class RemoveResult  {
  @ApiProperty()
  success: boolean
};

export class PaginationResult<Entity> {
  @ApiProperty()
  results: Array<Entity>;

  @ApiProperty()
  totalCount: number;
}
