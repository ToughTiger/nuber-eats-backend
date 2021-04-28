import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';

@InputType()
export class DeleteRestaurantInput {
  @Field((type) => Number)
  restaurantId: number;
}
@ObjectType()
export class DeleteRestaurentOutput extends CoreOutputDto {}
