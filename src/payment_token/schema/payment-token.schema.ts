import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }
  if (this.isNew && this.active === undefined) {
    this.paid = false;
  }

  next();
});
