import {
    Controller,
    Post,
    Body,
    Get,
    Param,
//    Patch,
    Delete,
} from '@nestjs/common';

import { Cabildo } from './cabildo.schema';
import { CabildoService } from './cabildo.service';

@Controller('cabildos') // http://localhost:3000/cabildos
export class CabildoController {
    constructor(private readonly cabildosService: CabildoService) {}

    @Post() // http://localhost:3000/cabildos
    async addCabildo(@Body() cabildo: Cabildo
    ) {
        const generatedId = await this.cabildosService.insertCabildo(cabildo);
        return { id: generatedId };
    }

    @Get()
    async getAllCabildos() {
        const cabildos = await this.cabildosService.getCabildos();
        return cabildos;
    }

    @Get(':id') // http://localhost:3000/cabildos/:id
    getCabildoById(@Param('id') cabildoId: string) {
        return this.cabildosService.getCabildoById(cabildoId);
    }

    @Delete(':id') // http://localhost:3000/cabildos/:id
    async deleteProduct(@Param('id') cabildoId: string) {
        await this.cabildosService.deleteCabildo(cabildoId);
        return null;
    }
}
