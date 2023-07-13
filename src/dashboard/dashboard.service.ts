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
      {
        $sort: { created: -1 },
      },
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

  getDaysBetweenDates(dateRange: Date[]) {
    const date1 = dateRange[0];
    const date2 = dateRange[1];
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // 1000ms * 60s * 60min * 24h = 86400000ms (número de milisegundos en un día)
    return diffDays;
  }

  async totalSales(id: string, date: Date[], rangeActive: boolean) {
    console.log('llegando daterange', date);
    console.log('rangeActive', rangeActive);
    //priermo buscar el user y ver si es admin o no , depende de eso el filtro
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(`user with ID ${id} not found`);
    const today = new Date();
    //  today.setUTCHours(0, 0, 0, 0);
    let startOfYear = new Date(today.getFullYear(), 0, 1);
    startOfYear.setUTCHours(0, 0, 0, 0);
    let endOfYear = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    endOfYear.setUTCHours(0, 0, 0, 0);

    //ahora calcular el año pasado para las comparaciones
    const lastYear = today.getFullYear() - 1;
    // Fecha de inicio del año pasado
    let startOfLastYear = new Date(lastYear, 0, 1);
    startOfLastYear.setUTCHours(0, 0, 0, 0);
    // Fecha de fin del año pasado
    let endOfLastYear = new Date(lastYear, 11, 31);

    endOfLastYear.setUTCHours(23, 59, 59, 999);

    if (rangeActive) {
      startOfYear = date[0];
      endOfYear = date[1];
      const diffDays = this.getDaysBetweenDates(date);
      console.log('diffdays', diffDays);
      startOfLastYear = new Date(today);
      startOfLastYear.setDate(today.getDate() - diffDays);

      endOfLastYear = new Date(today);
      endOfLastYear.setDate(today.getDate() - 1);
    }

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

    console.log('startOfLastYear', startOfLastYear);
    console.log('endOfLastYear', endOfLastYear);
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

  /**
   * Retrieves the total sales for the current month.
   * @param id The ID of the user making the request.
   * @returns An object containing the total sales value, percentage and number of orders.
   */
  async monthlySales(id: string) {
    // First, we search for the user and check if they are an admin or not, depending on that we apply a filter.
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(`user with ID ${id} not found`);
    //mes actual
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setUTCHours(0, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    endOfMonth.setUTCHours(0, 0, 0, 0);

    // Add new variables for the start and end of the previous month
    const startOfPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );
    startOfPrevMonth.setUTCHours(0, 0, 0, 0);
    const endOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    endOfPrevMonth.setUTCHours(0, 0, 0, 0);

    let paymentsActual: netAmountInterface[] = [];
    let paymentsPrevious: netAmountInterface[] = [];
    if (user.role == 'admin') {
      paymentsActual = await this.PaymentTokenModel.find({
        paid: true,
        created: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });
      paymentsPrevious = await this.PaymentTokenModel.find({
        paid: true,
        created: {
          $gte: startOfPrevMonth,
          $lt: endOfPrevMonth,
        },
      });
    } else {
      paymentsActual = await this.PaymentTokenModel.find({
        paid: true,
        assigned_user: id,
        created: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });
      paymentsPrevious = await this.PaymentTokenModel.find({
        paid: true,
        assigned_user: id,
        created: {
          $gte: startOfPrevMonth,
          $lt: endOfPrevMonth,
        },
      });
    }

    // Calculate the total sales value by iterating over the payments array.
    let countAmount = 0;
    for (const item of paymentsActual) {
      countAmount += item.amount_conversion;
    }
    // Calculate the total sales value by iterating over the payments previous array.
    let countAmountPrevious = 0;
    for (const item of paymentsPrevious) {
      countAmountPrevious += item.amount_conversion;
    }

    console.log('ventas mensuales actuales: ', countAmount);
    console.log('ventas mensuales del mes anterior: ', countAmountPrevious);

    let diferenciaPorcentual = (countAmount - countAmountPrevious) * 100;
    console.log('diferenciaPorcentual ', diferenciaPorcentual);
    diferenciaPorcentual = diferenciaPorcentual / countAmountPrevious;
    console.log('diferencia porcentual: ', diferenciaPorcentual.toFixed(2));
    // Return an object containing the total sales value, percentage and number of orders.
    return {
      value: countAmount,
      porcentaje: diferenciaPorcentual.toFixed(2),
      ordenes: paymentsActual.length,
      ordenesPrevious: paymentsPrevious.length,
      porcentajeOrdenes:
        ((paymentsActual.length - paymentsPrevious.length) * 100) /
        paymentsPrevious.length,
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
    const yesterdayInit = new Date(today);
    yesterdayInit.setDate(today.getDate() - 1);
    yesterdayInit.setUTCHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(today);
    yesterdayEnd.setDate(today.getDate() - 1);
    yesterdayEnd.setUTCHours(23, 59, 59, 99);
    console.log('yesterdayInit', yesterdayInit);
    console.log('yesterdayEnd', yesterdayEnd);
    let payments: netAmountInterface[] = [];
    let paymentsYesterday: netAmountInterface[] = [];
    if (user.role == 'admin') {
      payments = await this.PaymentTokenModel.find({
        created: {
          $gte: today,
          $lt: tomorrow,
        },
      });
      paymentsYesterday = await this.PaymentTokenModel.find({
        created: {
          $gte: yesterdayInit,
          $lt: yesterdayEnd,
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
      paymentsYesterday = await this.PaymentTokenModel.find({
        assigned_user: id,
        created: {
          $gte: yesterdayInit,
          $lt: yesterdayEnd,
        },
      });
    }
    //ahora recorro y saco el calculo
    let countAmount = 0;
    for (const item of payments) {
      countAmount += item.amount_conversion;
    }
    let countAmountYesterday = 0;
    for (const item of paymentsYesterday) {
      countAmountYesterday += item.amount_conversion;
    }
    console.log('ventas diarias actuales: ', countAmount);
    console.log('ventas de ayer: ', countAmountYesterday);

    let diferenciaPorcentual = (countAmount - countAmountYesterday) * 100;
    console.log('diferenciaPorcentual ', diferenciaPorcentual);
    diferenciaPorcentual = diferenciaPorcentual / countAmountYesterday;
    console.log('diferencia porcentual: ', diferenciaPorcentual.toFixed(2));
    return {
      value: countAmount,
      porcentaje: diferenciaPorcentual,
    };
  }
}
