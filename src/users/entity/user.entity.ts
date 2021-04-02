import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entity/core.entity';
import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
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
  @Field((type) => Number)
  id: number;
  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
