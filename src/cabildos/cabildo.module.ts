import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CabildoService } from './cabildo.service';
import { CabildoController } from './cabildo.controller';
import { CabildoSchema } from './cabildo.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Cabildo', schema: CabildoSchema}]),
    ],
    controllers: [CabildoController],
    providers: [CabildoService],
    exports: [CabildoService,MongooseModule],
})
export class CabildoModule {}
