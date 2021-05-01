import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddlware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if ('x-jwt' in req.headers) {
      const token = await req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const id = decoded['id'];
          const user = await this.usersService.findById(id);
          req['user'] = user;
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    next();
  }
}
