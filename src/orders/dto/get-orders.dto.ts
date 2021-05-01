import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutputDto } from "src/common/dtos/core-output.dto";
import { Order, OrderStatus } from "../entities/orders.entity";


@InputType()
export class GetOrdersInput {
    @Field(type => OrderStatus, {nullable: true})
    status: OrderStatus
}

@ObjectType()
export class  GetOrdersOutput extends CoreOutputDto{
    @Field(type => [Order], {nullable: true})
    orders?: Order[]
}