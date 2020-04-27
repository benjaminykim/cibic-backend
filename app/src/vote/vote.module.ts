import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VoteSchema } from './vote.schema';
import { VoteService } from './vote.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Vote', schema: VoteSchema}]),
    ],
    providers: [VoteService],
    exports: [VoteService, MongooseModule],
})
export class VoteModule {}
