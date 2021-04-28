import { CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entity/user.entity';
import {AllowedRoles} from './role.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflecter : Reflector){}
  canActivate(context: ExecutionContext) {
    const roles = this.reflecter.get<AllowedRoles>(
      'roles', 
      context.getHandler()
       )
    if(!roles){
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext['user'];
    if (!user) {
      return false;
    }

    if(roles.includes("Any")) {
      return true
    }
    return roles.includes(user.role);
  }
}
