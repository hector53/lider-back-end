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
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/update')
  updateTemplate(@Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templatesService.update(updateTemplateDto);
  }
}
