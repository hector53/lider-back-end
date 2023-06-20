import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWithdrawInput } from './dto/create-withdraw.input';
import { UpdateWithdrawInput } from './dto/update-withdraw.input';
import { InjectModel } from '@nestjs/mongoose';
import { Withdraw, WithdrawDocument } from './schema/withdraws.schema';
import { Model } from 'mongoose';
import { Site, SiteDocument } from 'src/sites/schema/sites.schema';
import {
  PaymentToken,
  PaymentTokenDocument,
} from 'src/payment_token/schema/payment-token.schema';

@Injectable()
export class WithdrawsService {
  constructor(
    @InjectModel(Withdraw.name)
    private withdrawModel: Model<WithdrawDocument>,
    @InjectModel(Site.name)
    private siteModel: Model<SiteDocument>,
    @InjectModel(PaymentToken.name)
    private PaymentTokenModel: Model<PaymentTokenDocument>,
  ) {}
  async create(createWithdrawInput: CreateWithdrawInput) {
    //primero necesito buscar el sitio por el user id,de no tener nada no guardo nada
    const site = await this.siteModel.findOne({
      assigned_user: createWithdrawInput.user_id,
    });
    if (!site)
      throw new NotFoundException(
        `Site with  assigned  user id ${createWithdrawInput.user_id} not found`,
      );
    createWithdrawInput.site = site.site;
    //primero consultar si lo q voy a retirar es menor q lo disponible
    const disponible = await this.availableByUser(createWithdrawInput.user_id);
    if (disponible > createWithdrawInput.amount) {
      return this.withdrawModel.create(createWithdrawInput);
    } else {
      throw new HttpException('not enough funds', 403);
    }
  }

  async availableByUser(id: string) {
    //primero consultar todos los payments completados por user
    const totalP = await this.PaymentTokenModel.aggregate([
      { $match: { assigned_user: id, paid: true } },
      { $group: { _id: null, totalAmount: { $sum: '$amount_conversion' } } },
      { $project: { _id: 0 } },
    ]);
    const totalPayments = totalP[0]?.totalAmount ?? 0;
    console.log('totalPayments', totalPayments);
    //ahora buscar los withdraws de este user
    const totalW = await this.withdrawModel.aggregate([
      { $match: { user_id: id } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
      { $project: { _id: 0 } },
    ]);
    const totalWithdraws = totalW[0]?.totalAmount ?? 0;
    console.log('totalWithdraws', totalWithdraws);
    return totalPayments - totalWithdraws;
  }

  async updateStatusWithdraw(id: string, status: number, txid: string) {
    return this.withdrawModel.findByIdAndUpdate(id, {
      status: status,
      txid: txid,
    });
  }

  async withdrawsByUser(
    page: number,
    limit: number,
    search: string,
    userId: string,
  ) {
    console.log('-------------------------------');
    page = Number(page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log('endIndex', endIndex);
    const query = {
      $and: [
        search ? { $or: [{ site: { $regex: search, $options: 'i' } }] } : {},
        { user_id: userId },
      ],
    };

    const withdraws = await this.withdrawModel
      .find(query)
      .skip(startIndex)
      .limit(limit);
    console.log('withdraws', withdraws);
    const count: number = await this.withdrawModel.countDocuments(query);
    console.log('count', count);
    const totalPages: number = Math.ceil(count / limit);

    const hasNextPage: boolean = endIndex < count;
    const hasPreviousPage: boolean = startIndex > 0;
    console.log('page', page);
    const nextPage: number = hasNextPage ? page + 1 : null;
    console.log('nextPage', nextPage);
    const previousPage: number = hasPreviousPage ? page - 1 : null;
    return {
      withdraws: withdraws,
      count,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    };
  }

  async findAll(page: number, limit: number, search: string) {
    console.log('-------------------------------');
    page = Number(page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log('endIndex', endIndex);
    const query = {
      $and: [
        search ? { $or: [{ site: { $regex: search, $options: 'i' } }] } : {},
      ],
    };

    const withdraws = await this.withdrawModel
      .find(query)
      .skip(startIndex)
      .limit(limit);
    console.log('withdraws', withdraws);
    const count: number = await this.withdrawModel.countDocuments(query);
    console.log('count', count);
    const totalPages: number = Math.ceil(count / limit);

    const hasNextPage: boolean = endIndex < count;
    const hasPreviousPage: boolean = startIndex > 0;
    console.log('page', page);
    const nextPage: number = hasNextPage ? page + 1 : null;
    console.log('nextPage', nextPage);
    const previousPage: number = hasPreviousPage ? page - 1 : null;
    return {
      withdraws: withdraws,
      count,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} withdraw`;
  }

  update(id: number, updateWithdrawInput: UpdateWithdrawInput) {
    return `This action updates a #${id} withdraw`;
  }

  remove(id: number) {
    return `This action removes a #${id} withdraw`;
  }
}
