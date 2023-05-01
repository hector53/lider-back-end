import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { Domain, DomainDocument } from './schema/domains.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DomainsService {
  constructor(
    @InjectModel(Domain.name) private domainModel: Model<DomainDocument>,
  ) {}
  create(createDomainDto: CreateDomainDto) {
    return this.domainModel.create(createDomainDto);
  }

  async findAll(page: number, limit: number, search: string) {
    console.log('-------------------------------');
    page = Number(page);
    limit = Number(limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log('endIndex', endIndex);
    const query = search
      ? {
          $or: [{ url: { $regex: search, $options: 'i' } }],
        }
      : {};

    const domains = await this.domainModel.aggregate([
      { $match: query },
      { $skip: startIndex },
      { $limit: limit },
      {
        $lookup: {
          from: 'domainprocessors',
          let: { domainId: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$domain_id', '$$domainId'],
                },
              },
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
                      active: 1,
                    },
                  },
                ],
                as: 'processor',
              },
            },
            {
              $project: {
                _id: 0,
                processor_id: 0,
                domain_id: 0,
              },
            },
          ],
          as: 'domainprocessors',
        },
      },
    ]);
    const count: number = await this.domainModel.countDocuments(query);
    console.log('count', count);
    const totalPages: number = Math.ceil(count / limit);

    const hasNextPage: boolean = endIndex < count;
    const hasPreviousPage: boolean = startIndex > 0;
    console.log('page', page);
    const nextPage: number = hasNextPage ? page + 1 : null;
    console.log('nextPage', nextPage);
    const previousPage: number = hasPreviousPage ? page - 1 : null;
    return {
      domains: domains,
      count,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} domain`;
  }

  async update(id: string, updateDomainDto: UpdateDomainDto) {
    const domainById = await this.domainModel.findById(id);
    if (!domainById)
      throw new NotFoundException(`Domain with ID ${id} not found`);
    const updateDomain = await this.domainModel.updateOne(
      { _id: id },
      { $set: updateDomainDto },
    );
    if (!updateDomain) throw new HttpException('UPDATE_ERROR', 403);
    return true;
  }

  remove(id: string) {
    console.log('borrar id: ', id);
    return this.domainModel.findByIdAndDelete(id);
  }

  async updateStatusDomain(id: string, status: boolean) {
    console.log('status', status);
    const domainById = await this.domainModel.findById(id);
    if (!domainById)
      throw new NotFoundException(`Domain with ID ${id} not found`);
    const updateStatus = await this.domainModel.updateOne(
      { _id: id },
      { $set: { active: status } },
    );
    if (!updateStatus) throw new HttpException('ERROR', 403);
    return true;
  }
}
