import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';
import * as Jwt from 'jsonwebtoken';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: JwtModuleOptions,
   
  ) {}

  sign(payload: object): string {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return Jwt.sign(payload, this.options.privateKey);
  }

  verify(token: string) {
    return Jwt.verify(token, this.options.privateKey);
  }
}
