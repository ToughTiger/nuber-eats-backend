import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from './core-output.dto';

@InputType()
export class PaginationInput {
  @Field((type) => Int, { defaultValue: 1 })
  page: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutputDto {
  @Field((type) => Int, { nullable: true })
  totalPages?: number;
}
