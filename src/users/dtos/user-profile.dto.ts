import { ArgsType, Field, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { User } from '../entity/user.entity';

@ArgsType()
export class UserProfileDto {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutputDto extends CoreOutputDto {
  @Field((type) => User, { nullable: true })
  user?: User;
}
