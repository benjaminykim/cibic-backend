import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//import { UsersModule } from '../users/users.module';
//import { CabildoModule } from '../cabildos/cabildo.module';
import { ReplySchema } from './reply.schema';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Reply', schema: ReplySchema}]),
        CabildoModule,
        UsersModule,
    ],
    controllers: [ReplyController],
    providers: [ReplyService],
    exports: [ReplyService,MongooseModule],
})
export class ReplyModule {}
