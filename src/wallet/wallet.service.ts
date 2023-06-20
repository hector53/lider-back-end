import { Injectable } from '@nestjs/common';
import { CreateWalletInput } from './dto/create-wallet.input';
import { UpdateWalletInput } from './dto/update-wallet.input';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletDocument } from './schema/wallet.schema';
import { Model } from 'mongoose';
import { UpdateWalletActiveInput } from './dto/update-wallet-active.input';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}
  create(createWalletInput: CreateWalletInput) {
    return this.walletModel.create(createWalletInput);
  }

  async findAll(page: number, limit: number, search: string) {
    console.log('-------------------------------');
    page = Number(page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const query = search
      ? {
          $or: [{ wallet: { $regex: search, $options: 'i' } }],
        }
      : {};

    const wallets = await this.walletModel.aggregate([
      { $match: query },
      { $skip: startIndex },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          let: { user_id: '$user_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', { $toObjectId: '$$user_id' }],
                },
              },
            },
            {
              $project: {
                fullName: 1,
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'sites',
          let: { user_id: '$user_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$assigned_user', '$$user_id'],
                },
              },
            },
            {
              $project: {
                _id: 0,
                site: 1,
              },
            },
          ],
          as: 'site',
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          wallet: 1,
          detailsWire: 1,
          detailsCrypto: 1,
          typeEwallet: 1,
          user_id: 1,
          active: 1,
          created: 1,
          user: { $arrayElemAt: ['$user.fullName', 0] },
          site: { $arrayElemAt: ['$site.site', 0] },
        },
      },
    ]);

    const count: number = await this.walletModel.countDocuments(query);
    console.log('count', count);
    const totalPages: number = Math.ceil(count / limit);

    const hasNextPage: boolean = endIndex < count;
    const hasPreviousPage: boolean = startIndex > 0;
    console.log('page', page);
    const nextPage: number = hasNextPage ? page + 1 : null;
    console.log('nextPage', nextPage);
    const previousPage: number = hasPreviousPage ? page - 1 : null;
    return {
      wallets: wallets,
      count,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    };
  }

  getWalletUser(id: string) {
    return this.walletModel.findOne({
      user_id: id,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: string, updateWalletInput: UpdateWalletInput) {
    console.log('updateWalletInput', updateWalletInput);
    return this.walletModel.findByIdAndUpdate(id, updateWalletInput);
  }

  updateWallerUser(id: string, updateWalletInput: UpdateWalletInput) {
    console.log('updateWalletInput', updateWalletInput);

    if (id != '') {
      return this.walletModel.findByIdAndUpdate(id, {
        type: updateWalletInput.type,
        wallet: updateWalletInput.wallet,
        detailsWire: updateWalletInput.detailsWire,
        detailsCrypto: updateWalletInput.detailsCrypto,
        typeEwallet: updateWalletInput.typeEwallet,
        active: false,
      });
    } else {
      return this.walletModel.create({
        type: updateWalletInput.type,
        wallet: updateWalletInput.wallet,
        detailsWire: updateWalletInput.detailsWire,
        detailsCrypto: updateWalletInput.detailsCrypto,
        typeEwallet: updateWalletInput.typeEwallet,
        active: true,
        user_id: updateWalletInput.user_id,
      });
    }
  }

  remove(id: string) {
    return this.walletModel.findByIdAndDelete(id);
  }

  updateWalletActive(walletActive: UpdateWalletActiveInput) {
    return this.walletModel.updateOne(
      { _id: walletActive._id },
      {
        $set: {
          active: walletActive.active,
        },
      },
    );
  }
}
