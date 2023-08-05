import { ApiProperty } from "@nestjs/swagger";

class ProductsDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  productId: string;
}

export class CreateOrderDto {
  @ApiProperty({required: true})
  userId: string;

  @ApiProperty({type: ProductsDto, isArray: true, required: true})
  products: Array<ProductsDto>;

  @ApiProperty({required: false})
  comment: string;
}
