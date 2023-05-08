import { Injectable } from '@nestjs/common';
import { CreateTemplateInput } from './dto/create-template.input';
import { UpdateTemplateInput } from './dto/update-template.input';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './entities/template.entity';
import { Model } from 'mongoose';
import { TemplateDocument } from './schema/templates.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name)
    private templateModel: Model<TemplateDocument>,
  ) {}
  create(createTemplateInput: CreateTemplateInput) {
    return this.templateModel.create(createTemplateInput);
  }

  findAll() {
    return this.templateModel.find({});
  }

  findIndividual() {
    return this.templateModel.find({
      type: 1,
    });
  }

  findMultiple() {
    return this.templateModel.find({
      type: 2,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  update(id: number, updateTemplateInput: UpdateTemplateInput) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
