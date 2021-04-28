import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'description',
  'options',
  'price',
]) {
  @Field((type) => Int, { nullable: true })
  restaurantId?: number;
}

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
  'name',
  'description',
  'options',
  'price',
  'restaurantId',
]) {
  @Field((type) => Int, { nullable: true })
  dishId?: number;
}

@InputType()
export class DeleteDishInput {
  @Field((type) => Int)
  dishId: number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutputDto {
  @Field((type) => Dish, { nullable: true })
  dish?: Dish;
}

@ObjectType()
export class EditDishOutput extends CoreOutputDto {}

@ObjectType()
export class DeleteDishOutput extends CoreOutputDto {}
