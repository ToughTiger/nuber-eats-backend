import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entity/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { Order } from './entities/orders.entity';
import { OrdersService } from './orders.service';

@Resolver( of => Order)
export class OrdersResolver {

    constructor(private readonly orderService: OrdersService){}

    @Mutation( returns => CreateOrderOutput)
    @Role(['Client'])
    createOrder(
        @AuthUser() customer: User,
        @Args('input') createOrderInput:CreateOrderInput
    ): Promise<CreateOrderOutput>{
        return this.orderService.createOrder(customer,createOrderInput)
    }

}
