import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get('/languajes')
  getlanguaje(@Query('lang') lang = 'English') {
    console.log('params', lang);
    return this.sitesService.getLanguaje(lang);
  }

  @Get('/processors')
  getProcessors() {
    return this.sitesService.getProcessors();
  }
}
