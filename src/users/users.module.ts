import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {UserSchema} from './users.schema';
import { UsersService } from './users.service';
import {CabildoSchema} from '../cabildos/cabildo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Users', schema: UserSchema}]),
  ],
  providers: [UsersService],
})
export class UsersModule {}
