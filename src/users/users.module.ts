import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CabildoSchema } from '../cabildos/cabildo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Users', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'Cabildo', schema: CabildoSchema}]),
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
