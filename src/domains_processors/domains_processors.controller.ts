import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { DomainsProcessorsService } from './domains_processors.service';
import { CreateDomainsProcessorDto } from './dto/create-domains_processor.dto';
import { UpdateDomainsProcessorDto } from './dto/update-domains_processor.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface ProcessorActive {
  active: boolean;
}

@UseGuards(JwtAuthGuard)
@Controller('domains-processors')
export class DomainsProcessorsController {
  constructor(
    private readonly domainsProcessorsService: DomainsProcessorsService,
  ) {}

  @Post()
  create(@Body() createDomainsProcessorDto: CreateDomainsProcessorDto) {
    console.log('body', createDomainsProcessorDto);
    return this.domainsProcessorsService.create(createDomainsProcessorDto);
  }

  @Get(':id')
  findAllByDomain(@Param('id') id: string) {
    return this.domainsProcessorsService.findAllByDomainId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.domainsProcessorsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDomainsProcessorDto: UpdateDomainsProcessorDto,
  ) {
    return this.domainsProcessorsService.update(id, updateDomainsProcessorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.domainsProcessorsService.remove(id);
  }

  @Put(':id/active')
  updateActiveStatus(@Param('id') id: string, @Body() body: ProcessorActive) {
    console.log('body', body);
    return this.domainsProcessorsService.updateActiveStatus(id, body.active);
  }
}
