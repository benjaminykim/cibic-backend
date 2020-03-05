import { Module } from '@nestjs/common';
import { MongooseModule} from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {CabildoModule} from './cabildos/cabildo.module';
import {ActivityModule} from './activities/activity.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo_serve:27017/cibic'),
    UsersModule,
    CabildoModule,
    UsersModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
