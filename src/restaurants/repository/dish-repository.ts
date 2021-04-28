import { EntityRepository, Repository } from 'typeorm';
import { Dish } from '../entities/dish.entity';

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish> {
  async checkDish(id: number): Promise<Dish> {
    const dish = await this.findOne(id, {
      relations: ['restaurant'],
    });
    return dish;
  }
}
