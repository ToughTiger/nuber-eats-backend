import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutputDto } from "src/common/dtos/core-output.dto";
import { Order } from "../entities/orders.entity";

@InputType()
export class GetOrderInput extends PickType(Order, ['id']) {}


@ObjectType()
export class GetOrderOutput extends CoreOutputDto {
    @Field(type => Order, {nullable: true})
    order?: Order
}