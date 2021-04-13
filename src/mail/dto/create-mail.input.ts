import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';

@InputType()
export class CreateMailInput {
  @Field((type) => String)
  email: string;

  @Field((type) => String)
  subject: string;

  @Field((type) => String)
  code: string;

  @Field((type) => String)
  username: string;
}

@ObjectType()
export class CreateMailOutput extends CoreOutputDto {}
