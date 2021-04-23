import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { User } from 'src/users/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@InputType("RestaurantInputType",{isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {

  @Column()
  @Field(type => String)
  @IsString()
  @Length(5, 20)
  name: string

  @Column({nullable: true})
  @Field(type => String)
  @IsString()
  address: string

  @Column({nullable: true})
  @Field(type => String)
  @IsString()
  coverImg: string

  @Field((type) => Category, {nullable: true})
  @ManyToOne(
    (type) => Category, 
    category => category.restaurents, {nullable: true ,onDelete: 'SET NULL'})
  @JoinColumn()
  category: Category

  @Field((type) => User)
  @ManyToOne(
    (type) => User, 
    user => user.restaurants
    )
  @JoinColumn()
  owner: User
  
 

}
