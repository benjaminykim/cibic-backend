import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { Cabildo } from './cabildo.schema';
import { CabildoService } from './cabildo.service';

@Controller('cabildo') // http://localhost:3000/cabildo
export class CabildoController {
    constructor(private readonly cabildosService: CabildoService) {}

    @UseGuards(JwtAuthGuard)
    @Post() // http://localhost:3000/cabildo
    async addCabildo(@Body('cabildo') cabildo: Cabildo
    ) {
        const generatedId = await this.cabildosService.insertCabildo(cabildo);
        return { id: generatedId };
    }

    @UseGuards(JwtAuthGuard)
    @Get('check/:name') // http://localhost:3000/cabildo/check/:name
    async checkCabildoName(@Param('name') cabildoName: string) {
        return await this.cabildosService.checkCabildoName(cabildoName);
    }

    @UseGuards(JwtAuthGuard)
    @Get() // http://localhost:3000/cabildo
    async getAllCabildos() {
        return await this.cabildosService.getAllCabildos();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id') // http://localhost:3000/cabildo/:id
    async getCabildoProfile(@Param('id') cabildoId: string) {
        return this.cabildosService.getCabildoProfile(cabildoId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('feed/:id') // http://localhost:3000/cabildo/feed/:id
    async getCabildoFeed(@Param('id') cabildoId: string) {
        return this.cabildosService.getCabildoFeed(cabildoId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id') // http://localhost:3000/cabildo/:id
    async deleteCabildo(@Param('id') cabildoId: string) {
        await this.cabildosService.deleteCabildo(cabildoId);
        return null;
    }
}
