import {Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CoreOutputDto } from "src/common/dtos/core-output.dto";
import { CreateRestaurantInput } from "./create-restaurant.input";


@InputType("EditRestaurent", {isAbstract: true})
export class EditRestaurantInput extends PartialType( CreateRestaurantInput){
    @Field((type)=> Number)
    restaurantId: number
}



@ObjectType()
export class EditRestaurantOutput extends CoreOutputDto{}
