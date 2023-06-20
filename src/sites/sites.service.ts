import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSiteInput } from './dto/create-site.input';
import { UpdateSiteInput } from './dto/update-site.input';
import { Site, SiteDocument } from './schema/sites.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ProcessorsSiteDomainCLass,
  ProcessorsSiteDomainDocument,
} from 'src/processors-site-domain/schema/processors-site-domain.schema';
import { UpdateSiteActiveInput } from './dto/update-site-active.input';
import { languajes } from 'src/languaje/langs';
import {
  Processor,
  ProcessorDocument,
} from 'src/processors/schema/processors.schema';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name)
    private siteModel: Model<SiteDocument>,
    @InjectModel(ProcessorsSiteDomainCLass.name)
    private processorsSiteDomainModel: Model<ProcessorsSiteDomainDocument>,
    @InjectModel(Processor.name)
    private processorModel: Model<ProcessorDocument>,
  ) {}
  create(createSiteInput: CreateSiteInput) {
    return this.siteModel.create(createSiteInput);
  }

  async findAll(page: number, limit: number, search: string) {
    console.log('-------------------------------');
    page = Number(page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log('endIndex', endIndex);
    const query = search
      ? {
          $or: [{ site: { $regex: search, $options: 'i' } }],
        }
      : {};

    const sites = await this.siteModel.aggregate([
      { $match: query },
      { $skip: startIndex },
      { $limit: limit },
      {
        $lookup: {
          from: 'processorssitedomainclasses',
          let: { siteId: { $toString: '$_id' }, domainId: '$assigned_domain' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$site_id', '$$siteId'] },
                    { $eq: ['$domain_id', '$$domainId'] },
                    { $eq: ['$active', true] },
                  ],
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
                processor_name: { $arrayElemAt: ['$processor.name', 0] },
                processor_image: { $arrayElemAt: ['$processor.image', 0] },
                active: 1,
              },
            },
          ],
          as: 'processorsSites',
        },
      },
      {
        $project: {
          _id: 1,
          site: 1,
          nameStore: 1,
          amounts: 1,
          webhook: 1,
          fee_quantity: 1,
          assigned_domain: 1,
          assigned_user: 1,
          template_individual: 1,
          template_multiple: 1,
          language: 1,
          success_url: 1,
          currency: 1,
          processorsSites: 1,
          domain_id: 1,
          processor_id: 1,
          active: 1,
          created: 1,
          updated: 1,
          public_key: 1,
          private_key: 1,
        },
      },
    ]);
    console.log('sites', sites);
    const count: number = await this.siteModel.countDocuments(query);
    console.log('count', count);
    const totalPages: number = Math.ceil(count / limit);

    const hasNextPage: boolean = endIndex < count;
    const hasPreviousPage: boolean = startIndex > 0;
    console.log('page', page);
    const nextPage: number = hasNextPage ? page + 1 : null;
    console.log('nextPage', nextPage);
    const previousPage: number = hasPreviousPage ? page - 1 : null;
    return {
      sites: sites,
      count,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    };
  }

  getLanguaje(lang: string) {
    if (lang == 'English') {
      return languajes.English;
    } else if (lang == 'French') {
      return languajes.French;
    }
  }

  async getProcessors() {
    const processors = await this.processorModel.find({ active: true });
    const arrayProcessors = [];
    for (const item of processors) {
      if (item.identy == 'stripe') {
        item.name = 'Pay with card';
      }
      const objP = {
        _id: item._id,
        name: item.name,
        image: item.image,
        identy: item.identy,
        fee: item.fee,
        fee_type: '%',
        fee_extra: 5,
      };
      arrayProcessors.push(objP);
    }
    console.log('processors', arrayProcessors);
    return arrayProcessors;
  }

  findOne(id: number) {
    return `This action returns a #${id} site`;
  }

  getSiteByUserId(id: string) {
    return this.siteModel.findOne({
      assigned_user: id,
    });
  }

  updateSiteWebhook(site_id: string, webhook: string) {
    return this.siteModel.findOneAndUpdate(
      {
        _id: site_id,
      },
      {
        webhook: webhook,
      },
    );
  }

  updateSiteActive(activeInput: UpdateSiteActiveInput) {
    return this.siteModel.updateOne(
      { _id: activeInput._id },
      {
        $set: {
          active: activeInput.active,
        },
      },
    );
  }

  async update(updateSiteInput: UpdateSiteInput) {
    console.log('llego updateSiteInput', updateSiteInput);
    const updateSite = await this.siteModel.updateOne(
      { _id: updateSiteInput._id },
      {
        $set: {
          site: updateSiteInput.site,
          nameStore: updateSiteInput.nameStore,
          amounts: updateSiteInput.amounts,
          fee_quantity: updateSiteInput.fee_quantity,
          webhook: updateSiteInput.webhook,
          assigned_domain: updateSiteInput.assigned_domain,
          assigned_user: updateSiteInput.assigned_user,
          template_individual: updateSiteInput.template_individual,
          template_multiple: updateSiteInput.template_multiple,
          language: updateSiteInput.language,
          success_url: updateSiteInput.success_url,
          currency: updateSiteInput.currency,
        },
      },
    );
    if (!updateSite) throw new HttpException('ERROR_UPDATE_SITE', 403);
    //recorro los procesadores y los actualizo
    for (const item of updateSiteInput.processorsSites) {
      await this.processorsSiteDomainModel.updateOne(
        { _id: item._id },
        {
          $set: {
            fee_extra: item.fee_extra,
            custom_fee: item.custom_fee,
            hosted: item.hosted,
            active: item.active,
          },
        },
      );
    }
    return true;
  }

  async remove(id: string) {
    const siteById = await this.siteModel.findById(id);
    if (!siteById) throw new NotFoundException(`Site with ID ${id} not found`);

    await this.processorsSiteDomainModel.deleteMany({
      site_id: id,
    });
    await this.siteModel.findOneAndDelete({
      _id: id,
    });
    return true;
  }
}
