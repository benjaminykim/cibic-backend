import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';

import { CabildosService } from './cabildo.service';

@Controller('cabildos')
export class CabildoController {
    constructor(private readonly cabildosService: CabildosService) {}

    @Post()
    async addCabildo(
        @Body('name') name: string,
        @Body('members') members: string,
        @Body('moderators') moderators: string,
        @Body('location') location: string,
        @Body('issues') issues: string,
        @Body('meetings') meetings: object[],
        @Body('files') files: string,
    ) {
        const generatedId = await this.cabildosService.insertCabildo(
            name,
            members,
            moderators,
            location,
            issues,
            meetings,
            files,
        );
        return { id: generatedId };
    }

    @Get()
    async getAllCabildos() {
        const cabildos = await this.cabildosService.getCabildos();
        return cabildos;
    }

    @Get(':id')
    getProduct(@Param('id') cabildoId: string) {
        return this.cabildosService.getCabildoById(cabildoId);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') cabildoId: string) {
        await this.cabildosService.deleteCabildo(cabildoId);
        return null;
    }
}
