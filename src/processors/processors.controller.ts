import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  UseGuards,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ProcessorsService } from './processors.service';
import { CreateProcessorDto } from './dto/create-processor.dto';
import { UpdateProcessorDto } from './dto/update-processor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
interface ProcessorActive {
  active: boolean;
}
@UseGuards(JwtAuthGuard)
@Controller('processors')
export class ProcessorsController {
  constructor(private readonly processorsService: ProcessorsService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    file: Express.Multer.File,
    @Body() createProcessorDto: CreateProcessorDto,
  ) {
    console.log('file image', file);
    //aqui ya guardo la imagen ahora debo guardar en la db

    console.log('body', createProcessorDto);
    createProcessorDto.image = file.filename;
    return this.processorsService.create(createProcessorDto);
  }

  @Put(':id/with_image')
  @UseInterceptors(FileInterceptor('image'))
  updateWithImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateProcessorDto: UpdateProcessorDto,
  ) {
    updateProcessorDto.image = file.filename;
    return this.processorsService.updateWithImage(id, updateProcessorDto);
  }

  @Put(':id/without_image')
  updateWithOutImage(
    @Param('id') id: string,
    @Body() updateProcessorDto: UpdateProcessorDto,
  ) {
    console.log('updateProcessorDto', updateProcessorDto);
    return this.processorsService.updateWithOutImage(id, updateProcessorDto);
  }

  @Get()
  findAll() {
    return this.processorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.processorsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processorsService.remove(id);
  }

  @Put(':id/active')
  updateStatusProcessor(
    @Param('id') id: string,
    @Body() body: ProcessorActive,
  ) {
    console.log('body', body);
    return this.processorsService.updateStatusProcessor(id, body.active);
  }
}
