import {
    Controller,
    Post,
    Body,
    Get,
    Delete,
    UseGuards,
    Headers,
    ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { idFromToken } from '../constants';
import { Cabildo } from './cabildo.schema';
import { CabildoService } from './cabildo.service';

@UseGuards(JwtAuthGuard)
@Controller('cabildo') // http://localhost:3000/cabildo
export class CabildoController {
    constructor(private readonly cabildoService: CabildoService) {}

    @Post() // http://localhost:3000/cabildo
    async addCabildo(
        @Headers() headers: any,
        @Body('cabildo') cabildo: Cabildo,
    ) {
        const idUser = idFromToken(headers.authorization);
        cabildo.admin = idUser;
        const generatedId = await this.cabildoService.insertCabildo(cabildo);
        return { id: generatedId };
    }

    @Get() // http://localhost:3000/cabildo
    async getAllCabildos() {
        return await this.cabildoService.getAllCabildos();
    }

    @Get('check') // http://localhost:3000/cabildo/check/:name
    async checkCabildoName(
        @Body('cabildoName') cabildoName: string,
    ) {
        return await this.cabildoService.checkCabildoName(cabildoName);
    }

    @Get('feed') // http://localhost:3000/cabildo/feed/:id
    async getCabildoFeed(
        @Headers() headers: any,
        @Body('idCabildo') idCabildo: string,
    ) {
        const idUser = idFromToken(headers.authorization);
        return this.cabildoService.getCabildoFeed(idCabildo, idUser);
    }

    @Get('profile') // http://localhost:3000/cabildo/:id
    async getCabildoProfile(
        @Body('idCabildo') idCabildo: string,
    ) {
        return this.cabildoService.getCabildoProfile(idCabildo);
    }

    @Delete() // http://localhost:3000/cabildo/:id
    async deleteCabildo(
        @Headers() headers: any,
        @Body('idCabildo') idCabildo: string,
    ) {
        // We'll have to pull other data, like this id from other lists, and transfer activities to global maybe
        // Big design choice here
        const idUser = idFromToken(headers.authorization);
        const idAdmin = (await this.cabildoService.getCabildoAdmin(idCabildo))._id;
        console.error(idUser);
        console.error(idAdmin);
        if (idUser !== idAdmin)
            throw new ForbiddenException('You are not the admin of this cabildo');
        await this.cabildoService.deleteCabildo(idCabildo);
    }
}
