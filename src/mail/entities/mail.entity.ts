import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { User } from 'src/users/entity/user.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuid4 } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Mail extends CoreEntity {
  @Field(() => String)
  @Column()
  code: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
  
  @BeforeInsert()
  createCode(): void {
    this.code = uuid4();
  }
}
