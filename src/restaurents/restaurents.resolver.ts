import { Query, Resolver } from '@nestjs/graphql';
import { Restaurent } from './entity/restaurent.entity';

@Resolver((of) => Restaurent)
export class RestaurentResolver {
  @Query(() => [Restaurent])
  restaurents(): Restaurent[] {
    return [];
  }
}
