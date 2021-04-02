import { ConflictException, Get } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { createAccountInput, LoginDto } from './dtos/create-account-dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  sayHi() {
    return true;
  }

  @Mutation((returns) => User)
  async createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<User> {
    try {
      return await this.usersService.createAccount(createAccountInput);
    } catch (e) {
      throw new ConflictException(`User with this email exists`);
    }
  }

  @Query((type) => User)
  async login(@Args('input') loginDto: LoginDto): Promise<User> {
    return await this.usersService.login(loginDto);
  }
}
