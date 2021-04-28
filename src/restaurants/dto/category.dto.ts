import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { PaginationInput, PaginationOutput } from 'src/common/dtos/pagination.dto';
import { Category } from '../entities/category.entity';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CategoryInput extends PaginationInput {
  @Field((type) => String)
  slug: string;
}

@ObjectType({ isAbstract: true })
export class SingleCategoryOutput extends PaginationOutput {
  @Field(type => [Restaurant], {nullable: true})
  restaurants?: Restaurant[]
  @Field((type) => Category, { nullable: true })
  category?: Category;
}

@ObjectType()
export class AllCategoryOutput extends CoreOutputDto {
  @Field((type) => [Category], { nullable: true })
  categories?: Category[];
}
