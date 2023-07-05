import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment-timezone';
@Schema()
export class PaymentToken {
  @Prop({ required: true })
  invoice: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  public_key: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  assigned_user: string;

  @Prop({ default: false })
  paid: boolean;

  @Prop({ required: true })
  domain_id: string;

  @Prop({ default: '' })
  processor_identy: string;

  @Prop({ default: '' })
  receipt_url: string;

  @Prop({ default: 0 })
  fee: number;

  @Prop({ default: 0 })
  fee_extra: number;

  @Prop({ default: 0 })
  net_amount: number;

  @Prop({ default: 0 })
  amount_conversion: number;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;
}

export type PaymentTokenDocument = PaymentToken &
  Document & { active: boolean };
export const PaymentTokenSchema = SchemaFactory.createForClass(PaymentToken);

PaymentTokenSchema.pre<PaymentTokenDocument>('save', function (next) {
  const now = new Date();
  console.log('Fecha y hora actual:', now.toLocaleString());
  const nyTime = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const nowNew = new Date(Date.parse(nyTime));
  console.log('Fecha y hora en Nueva York:', nowNew);

  this.updated = nowNew;
  if (!this.created) {
    this.created = nowNew;
  }
  if (this.isNew && this.active === undefined) {
    this.paid = false;
  }

  next();
});
