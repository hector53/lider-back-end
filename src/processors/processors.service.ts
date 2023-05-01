import {
  HttpException,
  Injectable,
  Module,
  NotFoundException,
} from '@nestjs/common';
import { CreateProcessorDto } from './dto/create-processor.dto';
import { UpdateProcessorDto } from './dto/update-processor.dto';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Processor, ProcessorDocument } from './schema/processors.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ProcessorsService {
  constructor(
    @InjectModel(Processor.name)
    private processorModel: Model<ProcessorDocument>,
  ) {}
  async create(createProcessorDto: CreateProcessorDto) {
    return this.processorModel.create(createProcessorDto);
  }

  findAll() {
    return this.processorModel.find({});
    return `This action returns all processors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} processor`;
  }

  updateWithImage(id: string, updateProcessorDto: UpdateProcessorDto) {
    return this.processorModel.findOneAndUpdate(
      { _id: id },
      updateProcessorDto,
    );
  }
  updateWithOutImage(id: string, updateProcessorDto: UpdateProcessorDto) {
    return this.processorModel.findOneAndUpdate(
      { _id: id },
      updateProcessorDto,
    );
  }

  remove(id: string) {
    console.log('borrar id: ', id);
    return this.processorModel.findByIdAndDelete(id);
  }

  async updateStatusProcessor(id: string, status: boolean) {
    console.log('status', status);
    const processorById = await this.processorModel.findById(id);
    if (!processorById)
      throw new NotFoundException(`Processor with ID ${id} not found`);
    const updateStatus = await this.processorModel.updateOne(
      { _id: id },
      { $set: { active: status } },
    );
    if (!updateStatus) throw new HttpException('ERROR', 403);
    return true;
  }
}
