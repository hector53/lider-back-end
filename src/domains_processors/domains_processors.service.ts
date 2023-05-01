import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDomainsProcessorDto } from './dto/create-domains_processor.dto';
import { UpdateDomainsProcessorDto } from './dto/update-domains_processor.dto';
import {
  DomainProcessors,
  DomainProcessorsDocument,
} from './schema/domains_processors.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Domain } from 'domain';
import { DomainDocument } from 'src/domains/schema/domains.schema';
import {
  Processor,
  ProcessorDocument,
} from 'src/processors/schema/processors.schema';

@Injectable()
export class DomainsProcessorsService {
  constructor(
    @InjectModel(DomainProcessors.name)
    private domainProcessorsModel: Model<DomainProcessorsDocument>,
    @InjectModel(Domain.name) private domainModel: Model<DomainDocument>,
    @InjectModel(Processor.name)
    private processorModel: Model<ProcessorDocument>,
  ) {}
  create(createDomainsProcessorDto: CreateDomainsProcessorDto) {
    return this.domainProcessorsModel.create(createDomainsProcessorDto);
  }

  async findAllByDomainId(id: string) {
    //quiero el nombre del dominio y todos los procesadore de ese dominio
    //primero traer el nombre del dominio
    const domain = await this.domainModel.findById(id);
    if (!domain) throw new NotFoundException(`Domain with ID ${id} not found`);
    //ahora si busco los procesadores de este dominio

    let arrayDomainProcessors = [];
    const domainsProcessorsByDomain =
      await this.domainProcessorsModel.aggregate([
        {
          $match: { domain_id: id },
        },
        {
          $lookup: {
            from: 'processors',
            let: { processorID: '$processor_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', { $toObjectId: '$$processorID' }],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  name: 1,
                  description: 1,
                  fee: 1,
                  image: 1,
                },
              },
            ],
            as: 'processor',
          },
        },
        {
          $project: {
            _id: 1,
            domain_id: 1,
            processor_id: 1,
            public_key: 1,
            private_key: 1,
            active: 1,
            created: 1,
            updated: 1,
            processor_name: { $arrayElemAt: ['$processor.name', 0] },
            processor_description: {
              $arrayElemAt: ['$processor.description', 0],
            },
            processor_fee: { $arrayElemAt: ['$processor.fee', 0] },
            processor_image: { $arrayElemAt: ['$processor.image', 0] },
          },
        },
      ]);

    if (domainsProcessorsByDomain) {
      arrayDomainProcessors = domainsProcessorsByDomain;
    }
    let arrayProcessors = [];
    const assignedProcessorIds = await this.domainProcessorsModel.distinct(
      'processor_id',
      { domain_id: id },
    );
    const unassignedProcessors = await this.processorModel.find({
      _id: { $nin: assignedProcessorIds },
    });
    if (unassignedProcessors) {
      arrayProcessors = unassignedProcessors;
    }

    return {
      domainUrl: domain.url,
      domainProcessors: arrayDomainProcessors,
      processors: arrayProcessors,
    };
  }

  findAll() {
    return `This action returns all domainsProcessors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} domainsProcessor`;
  }

  async update(
    id: string,
    updateDomainsProcessorDto: UpdateDomainsProcessorDto,
  ) {
    const processorDomainById = await this.domainProcessorsModel.findById(id);
    if (!processorDomainById)
      throw new NotFoundException(`Proccessor domain with ID ${id} not found`);
    const updateProcessorDomain = await this.domainProcessorsModel.updateOne(
      { _id: id },
      { $set: updateDomainsProcessorDto },
    );
    if (!updateProcessorDomain) throw new HttpException('UPDATE_ERROR', 403);
    return true;
  }

  remove(id: string) {
    return this.domainProcessorsModel.findByIdAndDelete(id);
  }
  async updateActiveStatus(id: string, active: boolean) {
    console.log('active', active);
    const processorDomainById = await this.domainProcessorsModel.findById(id);
    if (!processorDomainById)
      throw new NotFoundException(`Processor with ID ${id} not found`);
    const updateStatus = await this.domainProcessorsModel.updateOne(
      { _id: id },
      { $set: { active: active } },
    );
    if (!updateStatus) throw new HttpException('ERROR', 403);
    return true;
  }
}
