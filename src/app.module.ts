import { Module } from '@nestjs/common';
import { MongooseModule} from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { CabildoModule } from './cabildos/cabildo.module';
import { ActivityModule } from './activities/activity.module';
import { CommentModule } from './comments/comment.module';
import {AuthModule} from './auth/auth.module';

import { ReplyModule } from './replies/reply.module';

@Module({
    imports: [
        MongooseModule.forRoot(
            'mongodb://mongo_serve:27017/cibic',
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useFindAndModify: false,
            },
        ),
        UserModule,
        CabildoModule,
        ActivityModule,
        CommentModule,
        ReplyModule,
    AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
