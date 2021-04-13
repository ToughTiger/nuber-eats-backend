import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

import {
  createAccountInput,
  createAccountOutputDto,
  LogininputDto,
  LoginOutputDto,
} from './dtos/create-account-dto';
import {
  EditProfileInputDto,
  EditProfileOutputDto,
} from './dtos/edit-profile.dto';
import { UserProfileDto, UserProfileOutputDto } from './dtos/user-profile.dto';
import {
  verifyEmailInputDto,
  VerifyEmailOutputDto,
} from './dtos/verify-email.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((returns) => LoginOutputDto)
  async createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<createAccountOutputDto> {
    try {
      await this.usersService.createAccount(createAccountInput);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Account Already exists!',
      };
    }
  }

  @Mutation(() => LoginOutputDto)
  async login(@Args('input') loginDto: LogininputDto): Promise<LoginOutputDto> {
    try {
      let { token } = await this.usersService.login(loginDto);
      if (!token) {
        throw Error();
      }
      return {
        success: true,
        token,
      };
    } catch (e) {
      return { success: false, error: 'Worng username or password' };
    }
  }

  @Query((returns) => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  // Editing User Profile

  @UseGuards(AuthGuard)
  @Mutation((returns) => EditProfileOutputDto)
  async editUserProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInputDto,
  ): Promise<EditProfileOutputDto> {
    try {
      await this.usersService.editProfile(authUser.id, editProfileInput);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  // Finding User Profile
  @UseGuards(AuthGuard)
  @Query((returns) => UserProfileOutputDto)
  async userProfile(
    @Args() userProfile: UserProfileDto,
  ): Promise<UserProfileOutputDto> {
    const { userId } = userProfile;
    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw Error();
      }
      return {
        success: true,
        user,
      };
    } catch (e) {
      return {
        success: false,
        error: 'Invalid user',
      };
    }
  }

  @Mutation((returns) => VerifyEmailOutputDto)
  async verifyEmail(
    @Args('input') {code}: verifyEmailInputDto,
  ) : Promise<VerifyEmailOutputDto>{
    return await this.usersService.verifyEmail(code);
  }
}
