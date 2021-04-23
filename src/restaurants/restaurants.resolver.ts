import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dto/create-restaurant.input';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entity/user.entity';


@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation(() => CreateRestaurantOutput)
  async createRestaurant(@AuthUser() authUser: User, 
  @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
    return await this.restaurantsService.createRestaurant(authUser,createRestaurantInput);
    
  }

  @Query(() => [Restaurant], { name: 'restaurants' })
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Query(() => Restaurant, { name: 'restaurant' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.restaurantsService.findOne(id);
  }

  // @Mutation(() => Restaurant)
  // updateRestaurant(@Args('updateRestaurantInput') updateRestaurantInput: UpdateRestaurantInput) {
  //   return this.restaurantsService.update(updateRestaurantInput.id, updateRestaurantInput);
  // }

  // @Mutation(() => Restaurant)
  // removeRestaurant(@Args('id', { type: () => Int }) id: number) {
  //   return this.restaurantsService.remove(id);
  // }
}
