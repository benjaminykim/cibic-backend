import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
} from '@nestjs/common';

import { Cabildo } from './cabildo.schema';
import { CabildoService } from './cabildo.service';

@Controller('cabildos') // http://localhost:3000/cabildos
export class CabildoController {
    constructor(private readonly cabildosService: CabildoService) {}

    @Post() // http://localhost:3000/cabildos
    async addCabildo(@Body('cabildo') cabildo: Cabildo
    ) {
        const generatedId = await this.cabildosService.insertCabildo(cabildo);
        return { id: generatedId };
    }

    @Get('check/:name') //http://localhost:3000/cabildos/check/:name
    async checkCabildoName(@Param('name') cabildoName: string) {
        return await this.cabildosService.checkCabildoName(cabildoName);
    }

    @Get()
    async getAllCabildos() {
        return await this.cabildosService.getCabildos();
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
