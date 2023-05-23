import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generarCodigoAleatorio } from 'src/utils/coderandom.utils';

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

  @Prop({ default: '' })
  processor_id: string;

  @Prop({ default: 1 })
  template: number;

  @Prop({ default: '' })
  receipt_url: string;

  @Prop({ default: false })
  paid: boolean;

  @Prop({ required: true })
  domain_id: string;

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
