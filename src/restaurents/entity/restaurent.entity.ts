import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurent {
  @Field(() => String)
  name: string;

  @Field((of) => Boolean, { nullable: true })
  isGood?: boolean;
}
