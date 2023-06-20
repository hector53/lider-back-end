import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import {
  PaymentToken,
  PaymentTokenDocument,
} from 'src/payment_token/schema/payment-token.schema';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { netAmountInterface } from './dto/daily.input';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(PaymentToken.name)
    private PaymentTokenModel: Model<PaymentTokenDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async findPaymentsByAdmin(
    page: number,
    limit: number,
    search: string,
    user_id: string,
  ) {
    console.log('-------------------------------');
    const user = await this.userModel.findById(user_id);

    page = Number(page);
    limit = Number(limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    console.log('endIndex', endIndex);
    let query;
    const query1 = {
      paid: true,
      assigned_user: user_id,
      $or: [
        { processor_identy: { $regex: search, $options: 'i' } },
        { 'assigned_user.fullName': { $regex: search, $options: 'i' } },
        { 'assigned_user.email': { $regex: search, $options: 'i' } },
      ],
    };
    const query2 = {
      paid: true,
      $or: [
        { processor_identy: { $regex: search, $options: 'i' } },
        { 'assigned_user.fullName': { $regex: search, $options: 'i' } },
        { 'assigned_user.email': { $regex: search, $options: 'i' } },
      ],
    };
    if (user.role == 'admin') {
      query = query2;
    } else {
      query = query1;
    }

    const payments = await this.PaymentTokenModel.aggregate([
      { $match: query },
      { $skip: startIndex },
      { $limit: limit },
      {
        $lookup: {
          from: 'processors',
          let: { identyP: '$processor_identy' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$identy', '$$identyP'],
                },
              },
            },
            {
              $project: {
                name: 1,
                identy: 1,
                image: 1,
              },
            },
          ],
          as: 'processor',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { idUser: '$assigned_user' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', { $toObjectId: '$$idUser' }],
                },
              },
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                email: 1,
              },
            },
          ],
          as: 'assigned_user',
        },
      },
    ]);
    //console.log('payments:', payments);
    const count: number = await this.PaymentTokenModel.countDocuments(query);
    console.log('count', count);
    const totalPages: number = Math.ceil(count / limit);

    const hasNextPage: boolean = endIndex < count;
    const hasPreviousPage: boolean = startIndex > 0;
    console.log('page', page);
    const nextPage: number = hasNextPage ? page + 1 : null;
    console.log('nextPage', nextPage);
    const previousPage: number = hasPreviousPage ? page - 1 : null;
    return {
      payments: payments,
      count,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  async totalSales(id: string) {
    //priermo buscar el user y ver si es admin o no , depende de eso el filtro
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(`user with ID ${id} not found`);
    const today = new Date();
    //  today.setUTCHours(0, 0, 0, 0);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    startOfYear.setUTCHours(0, 0, 0, 0);
    const endOfYear = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    endOfYear.setUTCHours(0, 0, 0, 0);
    let payments: netAmountInterface[] = [];
    if (user.role == 'admin') {
      payments = await this.PaymentTokenModel.find({
        paid: true,
        created: {
          $gte: startOfYear,
          $lt: endOfYear,
        },
      });
    } else {
      payments = await this.PaymentTokenModel.find({
        paid: true,
        assigned_user: id,
        created: {
          $gte: startOfYear,
          $lt: endOfYear,
        },
      });
    }
    console.log('startOfYear', startOfYear);
    console.log('endOfYear', endOfYear);
    //ahora recorro y saco el calculo
    let countAmount = 0;
    for (const item of payments) {
      countAmount += item.amount_conversion;
    }
    return {
      value: countAmount,
      porcentaje: 0,
    };
  }

  async monthlySales(id: string) {
    //priermo buscar el user y ver si es admin o no , depende de eso el filtro
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(`user with ID ${id} not found`);
    const today = new Date();
    //  today.setUTCHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setUTCHours(0, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    endOfMonth.setUTCHours(0, 0, 0, 0);
    let payments: netAmountInterface[] = [];
    if (user.role == 'admin') {
      payments = await this.PaymentTokenModel.find({
        paid: true,
        created: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });
    } else {
      payments = await this.PaymentTokenModel.find({
        paid: true,
        assigned_user: id,
        created: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });
    }
    console.log('startOfMonth', startOfMonth);
    console.log('endOfMonth', endOfMonth);
    //ahora recorro y saco el calculo
    let countAmount = 0;
    for (const item of payments) {
      countAmount += item.amount_conversion;
    }
    return {
      value: countAmount,
      porcentaje: 0,
      ordenes: payments.length,
    };
  }

  async dailySales(id: string) {
    //priermo buscar el user y ver si es admin o no , depende de eso el filtro
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(`user with ID ${id} not found`);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let payments: netAmountInterface[] = [];
    if (user.role == 'admin') {
      payments = await this.PaymentTokenModel.find({
        created: {
          $gte: today,
          $lt: tomorrow,
        },
      });
    } else {
      payments = await this.PaymentTokenModel.find({
        assigned_user: id,
        created: {
          $gte: today,
          $lt: tomorrow,
        },
      });
    }
    //ahora recorro y saco el calculo
    let countAmount = 0;
    for (const item of payments) {
      countAmount += item.amount_conversion;
    }
    return {
      value: countAmount,
      porcentaje: 0,
    };
  }
}
