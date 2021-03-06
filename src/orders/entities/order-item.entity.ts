import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Dish, } from 'src/restaurants/entities/dish.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { Order } from './orders.entity';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field((type) => String)
  name: string;
  @Field((type) => String, { nullable: true })
  choice: string;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class OrderItem extends CoreEntity {
  @Field((type) => Dish)
  @ManyToOne((type) => Dish, { nullable: true, onDelete: 'CASCADE' })
  dish: Dish;

  @Field((type) => [OrderItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: OrderItemOption[];
}
