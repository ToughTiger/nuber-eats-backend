import { ObjectType, Field, InputType, Int } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { User } from 'src/users/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(5, 20)
  name: string;

  @Column({ nullable: true })
  @Field((type) => String)
  @IsString()
  address: string;

  @Column({ nullable: true })
  @Field((type) => String)
  @IsString()
  coverImg: string;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn()
  category: Category;

  @Field((type) => [Dish])
  @OneToMany((type) => Dish, (dish) => dish.restaurant)
  @JoinColumn()
  menu: Dish[];

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Field((type) => [Order])
  @ManyToOne((type) => Order, (order) => order.restaurant, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  orders: Order[];

  @Field((type) => Int)
  @Column()
  ownerId: number;
}
