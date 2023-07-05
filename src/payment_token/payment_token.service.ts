import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentTokenDto } from './dto/create-payment_token.dto';
import { UpdatePaymentTokenDto } from './dto/update-payment_token.dto';
import {
  PaymentToken,
  PaymentTokenDocument,
} from './schema/payment-token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Domain } from 'domain';
import { DomainDocument } from 'src/domains/schema/domains.schema';
import { generarCodigoAleatorio } from 'src/utils/coderandom.utils';
import { Site, SiteDocument } from 'src/sites/schema/sites.schema';
import { HttpService } from '@nestjs/axios';
import { GetTokenDto } from './dto/get-token.dto';
import { Template } from 'src/templates/entities/template.entity';
import { TemplateDocument } from 'src/templates/schema/templates.schema';
import { languajes } from 'src/languaje/langs';
import {
  ProcessorsSiteDomainCLass,
  ProcessorsSiteDomainDocument,
} from 'src/processors-site-domain/schema/processors-site-domain.schema';
import {
  Processor,
  ProcessorDocument,
} from 'src/processors/schema/processors.schema';
import { CreatePaymentTokenInput } from './dto/create-payment_token.input';
import { GetProcessorDto } from './dto/get_processor.dto';
import {
  DomainProcessors,
  DomainProcessorsDocument,
} from 'src/domains_processors/schema/domains_processors.schema';
import { UpdateTokenDto } from './dto/update-token.dto';
import * as https from 'https';
import { SiteprocessorDto } from './dto/site-procesor.dto';

@Injectable()
export class PaymentTokenService {
  constructor(
    @InjectModel(PaymentToken.name)
    private PaymentTokenModel: Model<PaymentTokenDocument>,
    @InjectModel(Domain.name) private domainModel: Model<DomainDocument>,
    @InjectModel(Site.name)
    private siteModel: Model<SiteDocument>,
    private readonly httpService: HttpService,
    @InjectModel(Template.name)
    private templateModel: Model<TemplateDocument>,
    @InjectModel(ProcessorsSiteDomainCLass.name)
    private processorsSiteDomainModel: Model<ProcessorsSiteDomainDocument>,
    @InjectModel(Processor.name)
    private processorModel: Model<ProcessorDocument>,
    @InjectModel(DomainProcessors.name)
    private domainProcessorsModel: Model<DomainProcessorsDocument>,
  ) {}
  async enviarToken(datos: any, url: string): Promise<any> {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      const respuesta = await this.httpService.axiosRef.post(url, datos, {
        httpsAgent,
      });
      console.log('respuesta', respuesta);
      return true;
    } catch (error) {
      console.error('error al enviar token', error);
      return false;
    }
  }

  async create(
    createPaymentTokenDto: CreatePaymentTokenDto | CreatePaymentTokenInput,
  ) {
    const objFail = {
      status: 0,
      message: 'Goods info error. Please contact webmaster! Thank you!',
      data: {},
    };
    //primero que nada necesito buscar el site por el public key
    const site = await this.siteModel.findOne({
      public_key: createPaymentTokenDto.key,
    });
    if (!site) {
      objFail.message = `Site with public key ${createPaymentTokenDto.key} not found`;
      return objFail;
    }

    //ahora vamos a ir validando cosas
    //validar montos permitidos
    if (!site.fee_quantity) {
      //no tiene fee quantity
      //los montos vienen separados por coma
      const amount = createPaymentTokenDto.amount;
      const amounts = site.amounts;
      // Convertir la cadena en un array de números
      const allowedAmounts = amounts.split(',').map(Number);

      // Verificar si el valor de amount está presente en el array de montos permitidos
      const isAmountAllowed = allowedAmounts.includes(amount);

      if (!isAmountAllowed) {
        objFail.message = `Amount ${amount} is not allowed`;
        return objFail;
      }
    }

    //ahora lo mismo pero con currency
    const currency = createPaymentTokenDto.currency.toUpperCase();
    const isCurrencyAllowed = site.currency.includes(currency);
    if (!isCurrencyAllowed) {
      objFail.message = `Currency ${currency} is not allowed`;
      return objFail;
    }

    //ahora voy a reunir todos los datos necesarios para formar el token payment
    //voy a empezar por el dominio para conocer la url
    const domain_id = site.assigned_domain;
    //necesito la url del dominio
    const domain = await this.domainModel.findById(domain_id);
    if (!domain) {
      objFail.message = `Domain with ID ${domain_id} not found`;
      return objFail;
    }
    //ahora necesito el token
    const token = generarCodigoAleatorio(40);
    //creamos url de pago
    const token_domain = domain.token;
    const urlPayment = domain.url + '/pay/' + token;
    const objSuccess = {
      status: 1,
      message: 'success',
      data: {
        invoice: createPaymentTokenDto.invoice,
        payment_url: urlPayment,
        amount: createPaymentTokenDto.amount,
        currency: createPaymentTokenDto.currency,
        key: createPaymentTokenDto.key,
      },
    };
    //ahora creamos el token y retornamos
    const create = await this.PaymentTokenModel.create({
      invoice: createPaymentTokenDto.invoice,
      amount: createPaymentTokenDto.amount,
      currency: createPaymentTokenDto.currency,
      public_key: createPaymentTokenDto.key,
      token: token,
      domain_id: domain_id,
      assigned_user: site.assigned_user,
    });
    if (create) {
      //en este punto todo esta listo ahora hace falta crearlo en el dominio tambien , lo haremos via api rest
      const urlEndpointToken = domain.url + '/wp-json/lider/v1/token';
      const datosEnviar = {
        row: create,
        token_domain: token_domain,
      };
      const enviarToken = await this.enviarToken(datosEnviar, urlEndpointToken);
      if (!enviarToken) {
        objFail.message = `Error save token in endpoint ${urlEndpointToken}`;
        return objFail;
      }
      return objSuccess;
    } else {
      return objFail;
    }
  }

  async getProcessorData(getProcessorDto: GetProcessorDto) {
    console.log('getProcessorDto', getProcessorDto);
    //ahora voy a buscar los datos del sitio con la public key del sitio

    const siteProcessor: SiteprocessorDto | any =
      await this.siteModel.aggregate([
        {
          $match: { public_key: getProcessorDto.public_key },
        },
        {
          $lookup: {
            from: 'processorssitedomainclasses',
            let: {
              site_id: { $toString: '$_id' },
              assigned_domain: '$assigned_domain',
              identy: getProcessorDto.identy,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$site_id', '$$site_id'] },
                      { $eq: ['$domain_id', '$$assigned_domain'] },
                      { $eq: ['$identy', '$$identy'] }, // nueva condición
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  identy: 1,
                  fee_extra: 1,
                  custom_fee: 1,
                  hosted: 1,
                  processor_id: 1,
                  processor_domain_id: 1,
                },
              },
            ],
            as: 'processor',
          },
        },
        {
          $lookup: {
            from: 'domainprocessors',
            let: {
              processor_domain_id: {
                $arrayElemAt: ['$processor.processor_domain_id', 0],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', { $toObjectId: '$$processor_domain_id' }],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  public_key: 1,
                  private_key: 1,
                },
              },
            ],
            as: 'domain',
          },
        },
        {
          $project: {
            _id: 1,
            success_url: 1,
            identy: { $arrayElemAt: ['$processor.identy', 0] },
            fee_extra: { $arrayElemAt: ['$processor.fee_extra', 0] },
            custom_fee: { $arrayElemAt: ['$processor.custom_fee', 0] },
            hosted: { $arrayElemAt: ['$processor.hosted', 0] },
            processor_id: { $arrayElemAt: ['$processor.processor_id', 0] },
            public_key: { $arrayElemAt: ['$domain.public_key', 0] },
            private_key: { $arrayElemAt: ['$domain.private_key', 0] },
          },
        },
        {
          $limit: 1,
        },
      ]);

    console.log('siteProcessor', siteProcessor[0]);

    if (!siteProcessor) {
      throw new NotFoundException(
        `Processor site with public_key ${getProcessorDto.public_key} not found`,
      );
    }

    //necesito el custom fee, si esta en 0 debo buscar el de processor general
    let custom_fee = siteProcessor[0].custom_fee;
    if (custom_fee == 0) {
      const processor = await this.processorModel.findOne({
        _id: siteProcessor[0].processor_id,
      });
      custom_fee = processor.fee;
    }
    const result = {
      public_key: siteProcessor[0].public_key,
      secret_key: siteProcessor[0].private_key,
      fee_extra: siteProcessor[0].fee_extra,
      custom_fee: custom_fee,
      success_url: siteProcessor[0].success_url,
    };

    //entonces ahora si armo la salida

    return result;
  }

  async update_token_paid(updateTokenDto: UpdateTokenDto) {
    //primero verificar que el token del dominio exista
    const domain = await this.domainModel.findOne({
      token: updateTokenDto.token_domain,
    });
    if (!domain) {
      throw new NotFoundException(
        `Domain with token ${updateTokenDto.token_domain} not found`,
      );
    }

    //ahora buscamos el token payment y actualizamos
    //necesito los datos del token completos para sacar el id del sitio
    const tokenPayment = await this.PaymentTokenModel.findByIdAndUpdate(
      updateTokenDto.lider_token_id,
      {
        paid: true,
        fee: updateTokenDto.custom_fee,
        net_amount: updateTokenDto.net_amount,
        amount_conversion: updateTokenDto.amount_conversion,
        receipt_url: updateTokenDto.receipt_url,
        processor_identy: updateTokenDto.identy,
        fee_extra: updateTokenDto.fee_extra,
      },
    );
    if (!tokenPayment) {
      throw new NotFoundException(
        `tokenPayment with id ${updateTokenDto.lider_token_id} not found`,
      );
    }
    //ahora preparamos el objeto para enviar al webhook correspondiente
    //pero necesitamos saber el webhook
    const site = await this.siteModel.findOne({
      public_key: tokenPayment.public_key,
    });
    const webhookSite = site.webhook;

    const objSend = {
      amount: tokenPayment.net_amount,
      currency: tokenPayment.currency,
      invoice: tokenPayment.invoice,
      status: 'paid',
      processor: tokenPayment.processor_identy,
      token: site.private_key,
    };
    await this.enviarToken(objSend, webhookSite);
    return true;
  }

  async getByToken(getTokenDto: GetTokenDto) {
    //primero verificar que el token del dominio exista
    const domain = await this.domainModel.findOne({
      token: getTokenDto.token_domain,
    });
    if (!domain) {
      throw new NotFoundException(
        `Domain with token ${getTokenDto.token_domain} not found`,
      );
    }
    //ahora a buscar el tokenpayment pa ver si es verdad que existe
    const tokenpayment = await this.PaymentTokenModel.findOne({
      token: getTokenDto.token_url,
      paid: false,
    });
    if (!tokenpayment) {
      throw new NotFoundException(`token ${getTokenDto.token_url} not found`);
    }
    if (tokenpayment.paid) {
      throw new NotFoundException(`token ${getTokenDto.token_url} is paid`);
    }
    //voy a retornar de una vez los datos del sitio
    //necesito buscar por el public key el sitio
    //necesito buscar el template cuando hay uno o mas procesadores activos
    const site = await this.siteModel.findOne({
      public_key: tokenpayment.public_key,
    });
    if (!site) {
      throw new NotFoundException(
        `site with public key ${tokenpayment.public_key} not found`,
      );
    }
    const templateIndividual = site.template_individual;
    const templateMultiple = site.template_multiple;
    let templateSelected = '';
    //necesito saber cuantos procesadores tiene activo este sitio
    const processorsSite = await this.processorsSiteDomainModel.find({
      site_id: site.id,
      active: true,
    });
    if (!processorsSite) {
      throw new NotFoundException(`processorsSite with side id  not found`);
    }
    if (processorsSite.length > 0) {
      templateSelected = templateMultiple;
    } else {
      templateSelected = templateIndividual;
    }
    //ahora a buscar mi template
    const getTemplate = await this.templateModel.findById(templateSelected);
    console.log('getTemplate', getTemplate);
    if (!getTemplate) {
      throw new NotFoundException(`Template with  id  not found`);
    }
    //me falta el languaje
    let languaje = {};
    if (site.language == 'English') {
      languaje = languajes.English;
    }
    if (site.language == 'French') {
      languaje = languajes.French;
    }
    //ahora los procesadores
    const processors = [];
    for (const item of processorsSite) {
      const processor = await this.processorModel.findById(item.processor_id);
      let customFee = item.custom_fee;
      if (customFee == 0) {
        customFee = processor.fee;
      }
      processors.push({
        id: item._id,
        name: processor.name,
        image: processor.image,
        fee_type: item.fee_extra.type,
        fee_extra: item.fee_extra.value,
        fee: customFee,
        identy: processor.identy,
        hosted: item.hosted,
      });
    }
    //ya aqui tengo todo me parece

    return {
      languaje: languaje,
      nameStore: site.nameStore,
      invoice: tokenpayment.invoice,
      amount: tokenpayment.amount,
      currency: tokenpayment.currency,
      processors: processors,
      template: getTemplate.html,
    };
  }

  findAll() {
    return `This action returns all paymentToken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentToken`;
  }

  update(id: number, updatePaymentTokenDto: UpdatePaymentTokenDto) {
    return `This action updates a #${id} paymentToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentToken`;
  }
}
