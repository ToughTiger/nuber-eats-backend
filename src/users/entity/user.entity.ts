import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';

enum UserRole {
  client,
  owner,
  delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
@Unique(['email'])
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  name: string;

  @Column()
  @Field((type) => String)
  email: string;

  @Column({ select: false })
  @Field((type) => String)
  password: string;

  @Column({ default: false })
  @Field((type) => Boolean)
  isVerified: boolean;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return error;
    }
  }
}
