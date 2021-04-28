import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    const restaurant = await this.restaurantRepository.findOne(restaurantId);
    if (!Restaurant) {
      return {
        success: false,
        error: 'Restaurant not found.',
      };
    }
    for (const item of items) {
      const dish = await this.dishes.findOne(item.dishId);
      // console.log(dish.options);
      if (!dish) {
        return {
          success: false,
          error: 'Dish Not found.',
        };
      }

      for (const itemOption of item.options) {
        console.log(dish.options);
        const dishOption = await dish.options.find(
          (dishOption) => dishOption.name === itemOption.name,
        );
        console.log(itemOption.name, dishOption.choices);
      }
      // const order = await this.orderItems.save(this.orderItems.create({
      //  dish,
      //  options: item.options
      // }))
    }
    // const order = await this.orderRepository.save(
    //   this.orderRepository.create({
    //     customer,
    //     restaurant
    //   }),
    // );

    // console.log(order)
  }
}
