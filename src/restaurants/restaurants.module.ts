import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import {
  CategoryResolver,
  DishResolver,
  RestaurantsResolver,
} from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './repository/category-repository';
import { RestaurantRepository } from './repository/restaurantRepository';
import { DishRepository } from './repository/dish-repository';
import { Order } from 'src/orders/entities/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantRepository,
      CategoryRepository,
      DishRepository,
      Order,
    ]),
  ],
  providers: [
    RestaurantsResolver,
    CategoryResolver,
    RestaurantsService,
    DishResolver,
  ],
})
export class RestaurantsModule {}
