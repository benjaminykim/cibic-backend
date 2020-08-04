import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CabildoService } from './cabildo.service';
import { CabildoController } from './cabildo.controller';
import { Cabildo } from './cabildo.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cabildo]),
    ],
    controllers: [CabildoController],
    providers: [CabildoService],
    exports: [CabildoService,TypeOrmModule],
})
export class CabildoModule {}
