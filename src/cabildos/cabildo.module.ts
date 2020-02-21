import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CabildosService } from './cabildo.service';
import { CabildoController } from './cabildo.controller';
import { CabildoSchema } from './cabildo.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Cabildo', schema: CabildoSchema}]),
    ],
    controllers: [CabildoController],
    providers: [CabildosService],
})
export class CabildoModule {}
