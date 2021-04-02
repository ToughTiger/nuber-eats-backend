import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { isNullableType } from 'graphql';
import { User } from '../entity/user.entity';

@InputType()
export class createAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@InputType()
export class LoginDto {
  @Field((type) => String)
  email: string;
  @Field((type) => String)
  password: string;
}
