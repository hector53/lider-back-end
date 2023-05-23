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

@Injectable()
export class PaymentTokenService {
  constructor(
    @InjectModel(PaymentToken.name)
    private PaymentTokenModel: Model<PaymentTokenDocument>,
    @InjectModel(Domain.name) private domainModel: Model<DomainDocument>,
    @InjectModel(Site.name)
    private siteModel: Model<SiteDocument>,
    private readonly httpService: HttpService,
  ) {}
  async enviarToken(datos: any, url: string): Promise<any> {
    try {
      const respuesta = await this.httpService.axiosRef.post(url, datos);
      console.log('respuesta', respuesta);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async create(createPaymentTokenDto: CreatePaymentTokenDto) {
    const objFail = {
      status: 0,
      message: 'Goods info error. Please contact webmaster! Thank you!',
      details: '',
    };
    //primero que nada necesito buscar el site por el public key
    const site = await this.siteModel.findOne({
      public_key: createPaymentTokenDto.key,
    });
    if (!site) {
      objFail.details = `Site with public key ${createPaymentTokenDto.key} not found`;
      throw new NotFoundException(objFail);
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
        objFail.details = `Amount ${amount} is not allowed`;
        throw new NotFoundException(objFail);
      }
    }

    //ahora lo mismo pero con currency
    const currency = createPaymentTokenDto.currency;
    const isCurrencyAllowed = site.currency.includes(currency);
    if (!isCurrencyAllowed) {
      objFail.details = `Currency ${currency} is not allowed`;
      throw new NotFoundException(objFail);
    }

    //ahora voy a reunir todos los datos necesarios para formar el token payment
    //voy a empezar por el dominio para conocer la url
    const domain_id = site.assigned_domain;
    //necesito la url del dominio
    const domain = await this.domainModel.findById(domain_id);
    if (!domain) {
      objFail.details = `Domain with ID ${domain_id} not found`;
      throw new NotFoundException(objFail);
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
      template: createPaymentTokenDto.template,
      domain_id: domain_id,
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
        objFail.details = `Error save token in endpoint ${urlEndpointToken}`;
        throw new NotFoundException(objFail);
      }
      return objSuccess;
    } else {
      return objFail;
    }
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
    return true;
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
