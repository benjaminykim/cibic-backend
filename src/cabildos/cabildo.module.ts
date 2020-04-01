import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CabildoService } from './cabildo.service';
import { CabildoController } from './cabildo.controller';
import { CabildoSchema } from './cabildo.schema';

import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Cabildo', schema: CabildoSchema}]),
        forwardRef(() => UsersModule),
    ],
    controllers: [CabildoController],
    providers: [CabildoService],
    exports: [CabildoService,MongooseModule],
})
export class CabildoModule {}
