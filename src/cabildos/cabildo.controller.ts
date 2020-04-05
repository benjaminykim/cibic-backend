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

@Controller('cabildo') // http://localhost:3000/cabildo
export class CabildoController {
    constructor(private readonly cabildosService: CabildoService) {}

    @Post() // http://localhost:3000/cabildo
    async addCabildo(@Body('cabildo') cabildo: Cabildo
    ) {
        const generatedId = await this.cabildosService.insertCabildo(cabildo);
        return { id: generatedId };
    }

    @Get('check/:name') // http://localhost:3000/cabildo/check/:name
    async checkCabildoName(@Param('name') cabildoName: string) {
        return await this.cabildosService.checkCabildoName(cabildoName);
    }

    @Get() // http://localhost:3000/cabildo
    async getAllCabildos() {
        return await this.cabildosService.getAllCabildos();
    }

    @Get(':id') // http://localhost:3000/cabildo/:id
    async getCabildoProfile(@Param('id') cabildoId: string) {
        return this.cabildosService.getCabildoProfile(cabildoId);
    }

    @Get('feed/:id') // http://localhost:3000/cabildo/feed/:id
    async getCabildoFeed(@Param('id') cabildoId: string) {
        return this.cabildosService.getCabildoFeed(cabildoId);
    }

    @Delete(':id') // http://localhost:3000/cabildo/:id
    async deleteCabildo(@Param('id') cabildoId: string) {
        await this.cabildosService.deleteCabildo(cabildoId);
        return null;
    }
}
