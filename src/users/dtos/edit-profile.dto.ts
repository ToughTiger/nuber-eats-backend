import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { User } from '../entity/user.entity';

@InputType()
export class EditProfileInputDto extends PartialType(PickType(User, [
  'email',
  'password',
])) {}

@ObjectType()
export class EditProfileOutputDto extends CoreOutputDto {}
