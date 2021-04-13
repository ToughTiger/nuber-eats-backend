import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { User } from '../entity/user.entity';

@InputType()
export class createAccountInput extends PickType(User, [
  'name',
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class createAccountOutputDto extends CoreOutputDto {}

@InputType()
@ObjectType()
export class LogininputDto {
  @Field((type) => String)
  email: string;
  @Field((type) => String)
  password: string;
}

@ObjectType()
export class LoginOutputDto extends CoreOutputDto {
  @Field((type) => String, { nullable: true })
  token?: string;
}
