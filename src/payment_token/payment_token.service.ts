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
      const respuesta = await this.httpService.axiosRef.post(url, datos);
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
    //con el id del procesador del sitio puedo tener el id del procesador del dominio
    const processorsSite = await this.processorsSiteDomainModel.findOne({
      _id: getProcessorDto.id_processor,
    });
    if (!processorsSite) {
      throw new NotFoundException(
        `Processor site with id ${getProcessorDto.id_processor} not found`,
      );
    }
    //ahora necesito el processor domain para el piublic key y secret key
    const domainProcessor = await this.domainProcessorsModel.findOne({
      _id: processorsSite.processor_domain_id,
    });
    if (!domainProcessor) {
      throw new NotFoundException(
        `Domain processor with id ${processorsSite.processor_domain_id} not found`,
      );
    }
    //necesito el custom fee, si esta en 0 debo buscar el de processor general
    let custom_fee = processorsSite.custom_fee;
    if (custom_fee == 0) {
      const processor = await this.processorModel.findOne({
        _id: processorsSite.processor_id,
      });
      custom_fee = processor.fee;
    }
    const result = {
      public_key: domainProcessor.public_key,
      secret_key: domainProcessor.private_key,
      fee_extra: processorsSite.fee_extra,
      custom_fee: custom_fee,
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
    const tokenPayment = await this.PaymentTokenModel.findByIdAndUpdate(
      updateTokenDto.lider_token_id,
      {
        paid: true,
        fee: updateTokenDto.fee,
        net_amount: updateTokenDto.net_amount,
        amount_conversion: updateTokenDto.amount_conversion,
        receipt_url: updateTokenDto.receipt_url,
        processor_identy: updateTokenDto.identy,
      },
    );
    if (!tokenPayment) {
      throw new NotFoundException(
        `tokenPayment with id ${updateTokenDto.lider_token_id} not found`,
      );
    }
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
      processors.push({
        id: item._id,
        name: processor.name,
        image: processor.image,
        fee_type: item.fee_extra.type,
        fee: item.fee_extra.value,
        identy: processor.identy,
      });
    }
    //ya aqui tengo todo me parece

    return {
      languaje: languaje,
      nameStore: 'Test Name Store',
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
