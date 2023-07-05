import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProcessorsSiteDomainInput } from './dto/create-processors-site-domain.input';
import { UpdateProcessorsSiteDomainInput } from './dto/update-processors-site-domain.input';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProcessorsSiteDomainCLass,
  ProcessorsSiteDomainDocument,
} from './schema/processors-site-domain.schema';
import { Model } from 'mongoose';
import { DomainsProcessorsService } from 'src/domains_processors/domains_processors.service';
import { CreateDomainsProcessorDto } from 'src/domains_processors/dto/create-domains_processor.dto';

@Injectable()
export class ProcessorsSiteDomainService {
  constructor(
    private readonly domainsProcessorsService: DomainsProcessorsService,
    @InjectModel(ProcessorsSiteDomainCLass.name)
    private processorsSiteDomainModel: Model<ProcessorsSiteDomainDocument>,
  ) {}

  async create(
    createProcessorsSiteDomainInput: CreateProcessorsSiteDomainInput,
  ) {
    return await this.processorsSiteDomainModel.create(
      createProcessorsSiteDomainInput,
    );
  }

  async get_processors_site_domain(domain_id: string, site_id: string) {
    return await this.processorsSiteDomainModel.aggregate([
      {
        $match: { domain_id: domain_id, site_id: site_id },
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
                identy: 1,
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
          processor_domain_id: 1,
          site_id: 1,
          fee_extra: 1,
          custom_fee: 1,
          hosted: 1,
          active: 1,
          processor_name: { $arrayElemAt: ['$processor.name', 0] },
          processor_identy: { $arrayElemAt: ['$processor.identy', 0] },
          processor_fee: { $arrayElemAt: ['$processor.fee', 0] },
          processor_image: { $arrayElemAt: ['$processor.image', 0] },
        },
      },
    ]);
  }

  async findAllProcessorsSiteDomain(domain_id: string, site_id: string) {
    console.log('entrando a findall ', domain_id, site_id);
    //primero listamos de la coleccion processorsSiteDOmain

    let processorsSiteDomains = await this.get_processors_site_domain(
      domain_id,
      site_id,
    );
    console.log('lsitando processorsSiteDomains:', processorsSiteDomains);
    if (processorsSiteDomains.length == 0) {
      console.log('no hay nada en la coleccion entonces los creamos ');
      //no tenemos nada pa crear entonces los buscamos
      const processorsDomains: [CreateDomainsProcessorDto] | any =
        await this.domainsProcessorsService.getProcessorsDomainsByIdDomain(
          domain_id,
        );
      if (!processorsDomains)
        throw new NotFoundException(`Domain with ID ${domain_id} not found`);

      console.log('si existen los processors domain', processorsDomains);
      //aqui si existen me retorna un array de domainsProcessor
      for (const item of processorsDomains) {
        //createProcessorsSiteDomainInput
        const itemSite: CreateProcessorsSiteDomainInput = {
          site_id: site_id,
          domain_id: domain_id,
          custom_fee: 0,
          fee_extra: { type: '%', value: 0 },
          processor_domain_id: item._id,
          processor_id: item.processor_id,
          identy: item.identy,
          hosted: false,
        };
        await this.create(itemSite);
      }

      processorsSiteDomains = await this.get_processors_site_domain(
        domain_id,
        site_id,
      );
    } else {
      //si hay entonces debo comparar a ver si hay nuevos
      const processorsDomains: [CreateDomainsProcessorDto] | any =
        await this.domainsProcessorsService.getProcessorsDomainsByIdDomain(
          domain_id,
        );
      if (!processorsDomains)
        throw new NotFoundException(`Domain with ID ${domain_id} not found`);

      let numDocuments: number;

      if (Array.isArray(processorsDomains)) {
        numDocuments = processorsDomains.length;
      } else {
        numDocuments = 1;
      }
      if (numDocuments > processorsSiteDomains.length) {
        //hay procesadores nuevos en ese dominio entonces agregarlo
        //necesito saber la diferencia de ambos y agregar los nuevos
        for (const item of processorsDomains) {
          const similar = await this.get_processor_not_similar(
            item,
            processorsSiteDomains,
          );
          if (similar == false) {
            const itemSite: CreateProcessorsSiteDomainInput = {
              site_id: site_id,
              domain_id: domain_id,
              custom_fee: 0,
              fee_extra: { type: '%', value: 0 },
              processor_domain_id: item._id,
              processor_id: item.processor_id,
              identy: item.identy,
              hosted: false,
            };
            await this.create(itemSite);
          }
        }

        processorsSiteDomains = await this.get_processors_site_domain(
          domain_id,
          site_id,
        );
      }
    }
    return processorsSiteDomains;
  }

  async get_processor_not_similar(
    item: CreateDomainsProcessorDto,
    arrayProcessors: [CreateProcessorsSiteDomainInput] | any,
  ) {
    console.log('buenos vamos a comparar: ', item, arrayProcessors);
    let igual = false;
    for (const processor of arrayProcessors) {
      console.log('if ', item.identy, '=', processor.processor_identy);
      if (item.identy == processor.processor_identy) {
        console.log('no es igual entonces lo agrego');
        igual = true;
      }
    }
    return igual;
  }

  findAll() {
    return `This action returns all processorsSiteDomain`;
  }

  findOne(id: number) {
    return `This action returns a #${id} processorsSiteDomain`;
  }

  update(
    id: number,
    updateProcessorsSiteDomainInput: UpdateProcessorsSiteDomainInput,
  ) {
    return `This action updates a #${id} processorsSiteDomain`;
  }

  remove(id: number) {
    return `This action removes a #${id} processorsSiteDomain`;
  }
}
