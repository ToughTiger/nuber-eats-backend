import { Module } from '@nestjs/common';
import { RestaurentResolver } from './restaurents.resolver';

@Module({
  providers: [RestaurentResolver],
})
export class RestaurentsModule {}
