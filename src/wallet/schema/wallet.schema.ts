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

@Schema()
export class Wallet {
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

  @Prop()
  user_id: string;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;

  @Prop({ default: true })
  active: boolean;
}

export type WalletDocument = Wallet & Document & { active: boolean };
export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.pre<WalletDocument>('save', function (next) {
  const now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }
  if (this.isNew && this.active === undefined) {
    this.active = true;
  }

  next();
});
