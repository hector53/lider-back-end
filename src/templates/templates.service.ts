import { Injectable } from '@nestjs/common';
import { CreateTemplateInput } from './dto/create-template.input';
import { UpdateTemplateInput } from './dto/update-template.input';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './entities/template.entity';
import { Model } from 'mongoose';
import { TemplateDocument } from './schema/templates.schema';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name)
    private templateModel: Model<TemplateDocument>,
  ) {}

  create(createTemplateInput: CreateTemplateInput) {
    return this.templateModel.create(createTemplateInput);
  }

  async findAll(page: number, limit: number, search: string) {
    console.log('-------------------------------');
    page = Number(page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log('endIndex', endIndex);
    const query = search
      ? {
          $or: [{ name: { $regex: search, $options: 'i' } }],
        }
      : {};

    const templates = await this.templateModel
      .find(query)
      .skip(startIndex)
      .limit(limit);
    const count: number = await this.templateModel.countDocuments(query);
    console.log('count', count);
    const totalPages: number = Math.ceil(count / limit);

    const hasNextPage: boolean = endIndex < count;
    const hasPreviousPage: boolean = startIndex > 0;
    console.log('page', page);
    const nextPage: number = hasNextPage ? page + 1 : null;
    console.log('nextPage', nextPage);
    const previousPage: number = hasPreviousPage ? page - 1 : null;
    console.log('templates', templates);
    return {
      templates: templates,
      count,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    };
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

  update(updateTemplateDto: UpdateTemplateDto) {
    return this.templateModel.findByIdAndUpdate(updateTemplateDto.id, {
      html: updateTemplateDto.html,
    });
  }

  remove(id: string) {
    return this.templateModel.findByIdAndDelete(id);
  }
}
