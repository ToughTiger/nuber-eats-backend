import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { Like, Repository } from 'typeorm';
import {
  AllCategoryOutput,
  CategoryInput,
  SingleCategoryOutput,
} from './dto/category.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.input';
import {
  DeleteRestaurantInput,
  DeleteRestaurentOutput,
} from './dto/delete-restaurnant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dto/edit-reataurent-Input.dto';
import { RestaurantsInput, RestaurantsOutpt } from './dto/allRestaurant.dto';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repository/category-repository';
import { RestaurantRepository } from './repository/restaurantRepository';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dto/search-restaurant.dto';
import {
  CreateDishInput,
  CreateDishOutput,
  DeleteDishInput,
  DeleteDishOutput,
  EditDishInput,
  EditDishOutput,
} from './dto/dish.dto';

import { DishRepository } from './repository/dish-repository';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly categories: CategoryRepository,
    private readonly dishRepo: DishRepository,
  ) {}

  /**
   *
   * @param owner
   * @param createRestaurantInput
   * @returns
   */
  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurantRepository.create(
        createRestaurantInput,
      );
      newRestaurant.owner = owner;
      newRestaurant.category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );
      await this.restaurantRepository.save(newRestaurant);
      return {
        success: true,
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        error: 'Restaurant Creation failed',
      };
    }
  }

  /**
   *
   * @param owner
   * @param editRestaurantInput
   * @returns
   */
  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findRestaurantById(
        editRestaurantInput.restaurantId,
      );
      if (!restaurant) {
        return {
          success: false,
          error: 'Restaurant not found!',
        };
      }
      // console.log(owner.id, restaurant.ownerId);
      if (owner.id !== restaurant.ownerId) {
        return {
          success: false,
          error: 'You are not authorized to Edit Restaurant',
        };
      }
      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      await this.restaurantRepository.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(Category && { category }),
        },
      ]);

      return {
        success: true,
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        error: 'Can not edit Reataurant!',
      };
    }
  }

  /**
   *
   * @param owner
   * @param deleteRestaurantInput
   * @returns
   */
  async deleteRestaurant(
    owner: User,
    deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurentOutput> {
    try {
      let restaurant = await this.restaurantRepository.findRestaurantById(
        deleteRestaurantInput.restaurantId,
      );
      if (!restaurant) {
        return {
          success: false,
          error: 'No restaurant found!',
        };
      }
      if (restaurant.ownerId == owner.id) {
        await this.restaurantRepository.delete(restaurant.id);
      }
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: 'You can not delete restaurant, which you do not own.',
      };
    }
  }

  /**
   *
   * @returns all categories
   */
  async findAllCategories(): Promise<AllCategoryOutput> {
    try {
      const categories = await this.categories.find();
      return {
        success: true,
        categories,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Could not load Categories!',
      };
    }
  }

  /**
   *
   * @param category : On the basis of param we calculate total restaurant
   * @returns total count of Restaurant of that category
   */
  async countRestaurant(category): Promise<number> {
    return await this.restaurantRepository.count({ category });
  }

  /**
   *
   * @param param need to provide slug
   * @returns Restaurant we are searching for
   */

  async findOneCategory({
    slug,
    page,
  }: CategoryInput): Promise<SingleCategoryOutput> {
    try {
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return {
          success: false,
          error: 'Could not load Category!',
        };
      }

      const restaurants = await this.restaurantRepository.find({
        where: { category },
        take: 25,
        skip: (page - 1) * 25,
      });
      category.restaurants = restaurants;
      const totalResults = await this.countRestaurant(category);
      return {
        success: true,
        category,
        restaurants,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Could not load category!',
      };
    }
  }

  /**
   *
   * @param restaurantInput
   * @returns All restaurants
   */

  async findAllRestaurants({
    page,
  }: RestaurantsInput): Promise<RestaurantsOutpt> {
    try {
      const [
        restaurants,
        totalItems,
      ] = await this.restaurantRepository.findAndCount({
        take: 25,
        skip: (page - 1) * 25,
      });
      if (!restaurants) {
        return {
          success: false,
          error: 'Restaurants not Loaded!',
        };
      }

      return {
        success: true,
        restaurants,
        totalPages: Math.ceil(totalItems / 25),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Could not load Restaurants!',
      };
    }
  }

  async findRestaurantbyId({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        id: restaurantId,
      });

      if (!restaurant) {
        return {
          success: false,
          error: `No Restaurant found for ID ${restaurantId}`,
        };
      }
      const dishes = await this.dishRepo.find({
        where: {
          restaurantId,
        },
      });
      restaurant.menu = dishes;
      return {
        success: true,
        restaurant,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Could not find Restaurant!',
      };
    }
  }

  async searchRestaurant({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [
        restaurants,
        itemCount,
      ] = await this.restaurantRepository.findAndCount({
        where: {
          name: Like(`%${query}%`),
        },
        take: 25,
        skip: (page - 1) * 25,
      });
      if (!restaurants) {
        return {
          success: false,
          error: 'Could not found restaurant!',
        };
      }

      return {
        success: true,
        restaurants,
        totalPages: Math.ceil(page - 1 / 25),
      };
    } catch (error) {
      return {
        success: false,
        error: 'No restaurant Found!',
      };
    }
  }

  async createDish(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurantRepository.findOne(
        createDishInput.restaurantId,
      );
      if (!restaurant) {
        return {
          success: false,
          error: 'Could not find restaurant!',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          success: false,
          error: 'You can not create Dish!',
        };
      }
      const newDish = await this.dishRepo.save(
        this.dishRepo.create({ ...createDishInput, restaurant }),
      );

      return {
        success: true,
        dish: newDish,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Could not create Dish',
      };
    }
  }

  async editDish(owner, editDishInput: EditDishInput): Promise<EditDishOutput> {
    try {
      const dish = await this.dishRepo.checkDish(editDishInput.dishId);
      if (!dish) {
        return {
          success: false,
          error: 'Could not found Dish.',
        };
      }

      if (owner.id !== dish.restaurant.ownerId) {
        return {
          success: false,
          error: 'You cant not edit Dish.',
        };
      }
      const updatedDish = await this.dishRepo.save([
        {
          id: editDishInput.dishId,
          ...editDishInput,
        },
      ]);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Could not update Dish',
      };
    }
  }

  async deleteDish(
    owner,
    { dishId }: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishRepo.checkDish(dishId);
      if (!dish) {
        return {
          success: false,
          error: 'Could not found Dish.',
        };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          success: false,
          error: 'You can not delete the dish, which you do not own.',
        };
      }

      await this.dishRepo.delete(dishId);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Dish can not be deleted.',
      };
    }
  }
} // end of retaurant Service
