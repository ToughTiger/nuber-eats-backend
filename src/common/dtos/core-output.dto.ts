import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutputDto {
  @Field((type) => Boolean, { nullable: true })
  success: boolean;

  @Field((type) => String, { nullable: true })
  error?: string;
}
