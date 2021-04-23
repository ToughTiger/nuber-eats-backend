import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dto/create-restaurant.input';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant) private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ){}


  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurantRepository.create(createRestaurantInput)
      newRestaurant.owner = owner;
      const categoryName = createRestaurantInput.categoryName.trim().toLowerCase()
      const categorySlug = categoryName.replace(/ /g, '-') //adding '-' to the category name
      let category = await this.categoryRepository.findOne({slug: categorySlug})
      if(!category) {
        await this.categoryRepository.save(this.categoryRepository.create({slug:categorySlug, name: categoryName}))
      }
      newRestaurant.category = category
      
      await this.restaurantRepository.save(newRestaurant)
        if(!newRestaurant){
          throw Error()
        }
    return {
      success: true,
      error: null
    }
    } catch (error) {
      return {
        success: false,
        error: "Restaurant Creation failed"
      }
      
    }

    }
  

  findAll() {
    return `This action returns all restaurants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  // update(id: number, updateRestaurantInput: UpdateRestaurantInput) {
  //   return `This action updates a #${id} restaurant`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} restaurant`;
  // }
}
