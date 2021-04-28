import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.input';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { Role } from 'src/auth/role.decorator';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dto/edit-reataurent-Input.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurentOutput,
} from './dto/delete-restaurnant.dto';
import { Category } from './entities/category.entity';
import {
  AllCategoryOutput,
  CategoryInput,
  SingleCategoryOutput,
} from './dto/category.dto';
import { RestaurantsInput, RestaurantsOutpt } from './dto/allRestaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dto/search-restaurant.dto';
import { Dish } from './entities/dish.entity';
import {
  CreateDishInput,
  CreateDishOutput,
  DeleteDishInput,
  DeleteDishOutput,
  EditDishInput,
  EditDishOutput,
} from './dto/dish.dto';
import { threadId } from 'node:worker_threads';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  /**
   *
   * @param authUser is owner of restaurant who can create a restaurant
   * @param createRestaurantInput DTO
   * @returns Newly created Restaurant
   */
  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return await this.restaurantsService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }

  /**
   *
   * @param user Owner of the restaurant
   * @param editRestaurantInput DTO
   * @returns Updated Restaurant
   */

  @Mutation(() => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurent(
    @AuthUser() user: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantsService.editRestaurant(user, editRestaurantInput);
  }

  /**
   *
   * @param owner
   * @param deleteRestaurantInput DTO
   * @returns null
   */
  @Mutation(() => DeleteRestaurentOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurentOutput> {
    return this.restaurantsService.deleteRestaurant(
      owner,
      deleteRestaurantInput,
    );
  }
}

/**
 * Resolver for Category
 */

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}
  /**
   *
   * @param category
   * @returns Restaurant count of given category
   */
  @ResolveField(() => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurant(category);
  }

  /**
   *
   * @returns All categories in Database
   *
   **/

  @Query(() => AllCategoryOutput)
  findAllCategories(): Promise<AllCategoryOutput> {
    return this.restaurantService.findAllCategories();
  }

  /**
   *
   * @param categoryInput
   * @returns
   */
  @Query(() => SingleCategoryOutput)
  findOneCategory(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<AllCategoryOutput> {
    return this.restaurantService.findOneCategory(categoryInput);
  }

  /**
   *
   * @param restaurantInput
   * @returns
   */
  @Query(() => RestaurantsOutpt)
  findAllRestaurants(
    @Args('input') restaurantInput: RestaurantsInput,
  ): Promise<RestaurantsOutpt> {
    return this.restaurantService.findAllRestaurants(restaurantInput);
  }

  /**
   *
   * @param restaurantInput
   * @returns
   */

  @Query(() => RestaurantOutput)
  findRestaurantbyId(
    @Args('input') restaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantbyId(restaurantInput);
  }

  /**
   *
   * @param searchRestaurantInput
   * @returns
   */

  @Query(() => SearchRestaurantOutput)
  searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurant(searchRestaurantInput);
  }
}

/**
 * Resolver for Dish Entity
 */

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  /**
   *
   * @param owner
   * @param createDishInput
   * @returns newly created Dish
   */
  @Mutation(() => CreateDishOutput)
  @Role(['Owner'])
  createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.restaurantService.createDish(owner, createDishInput);
  }

  @Mutation(() => EditDishOutput)
  @Role(['Owner'])
  editDish(
    @AuthUser() owner: User,
    @Args('input') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.restaurantService.editDish(owner, editDishInput);
  }

  @Query(() => DeleteDishOutput)
  @Role(['Owner'])
  deleteDish(
    @AuthUser() owner: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.restaurantService.deleteDish(owner, deleteDishInput);
  }
} // end of  Dish Resolver class
