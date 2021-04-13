import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Verification } from '../entity/verification.entity';

@ObjectType()
export class VerifyEmailOutputDto extends CoreOutputDto {
    
}

@InputType()
export class  verifyEmailInputDto extends PickType(Verification,["code"]){}