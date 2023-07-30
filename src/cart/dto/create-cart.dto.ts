import { ApiProperty } from "@nestjs/swagger";
import { CartProductsSchema } from "../entities/cart.entity";

export class CreateCartDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({type: CartProductsSchema, isArray: true})
  products: Array<CartProductsSchema>
}
