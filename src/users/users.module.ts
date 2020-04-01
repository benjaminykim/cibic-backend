import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersSchema } from './users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CabildoModule } from '../cabildos/cabildo.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Users', schema: UsersSchema}]),
        forwardRef(() => CabildoModule),
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService,MongooseModule],
})
export class UsersModule {}
