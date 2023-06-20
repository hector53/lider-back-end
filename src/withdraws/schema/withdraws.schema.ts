import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class detailsWire extends Document {
  @Prop({ default: null })
  payee_name: string;

  @Prop({ default: null })
  type_payee: string;

  @Prop({ default: null })
  address: string;

  @Prop({ default: null })
  apt_or_suite: string;

  @Prop({ default: null })
  bank_name: string;

  @Prop({ default: null })
  routing_number: string;
}
class detailsCrypto extends Document {
  @Prop({ default: null })
  currency: string;

  @Prop({ default: null })
  red: string;
}

class walletWithdraw extends Document {
  @Prop() //1=Bank transfer, 2=eWallet, 3=Crypto
  type: number;

  @Prop()
  wallet: string;

  @Prop()
  detailsWire: detailsWire;

  @Prop()
  detailsCrypto: detailsCrypto;

  @Prop({ default: null })
  typeEwallet: string;
}

@Schema()
export class Withdraw {
  @Prop()
  site: string;

  @Prop()
  currency: string;

  @Prop()
  wallet: walletWithdraw;

  @Prop()
  detailsCrypto: detailsCrypto;

  @Prop()
  amount: number;

  @Prop()
  user_id: string;

  @Prop({ default: '' })
  txid: string;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;

  @Prop({ default: 0 })
  status: number;
  //0=pending, 1=approved, 2=In progress, 3=Blocked
}

export type WithdrawDocument = Withdraw & Document & { active: boolean };
export const WithdrawSchema = SchemaFactory.createForClass(Withdraw);

WithdrawSchema.pre<WithdrawDocument>('save', function (next) {
  const now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }

  next();
});
