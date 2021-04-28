import { EntityRepository, Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  async findRestaurantById(id: number): Promise<Restaurant> {
    const restaurant = await this.findOne(id,  { loadRelationIds: true });
    return restaurant;
  }
}
