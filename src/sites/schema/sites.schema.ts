import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generarCodigoAleatorio } from 'src/utils/coderandom.utils';

@Schema()
export class Site {
  @Prop()
  site: string;

  @Prop({ default: null })
  amounts: string;

  @Prop({ default: false })
  fee_quantity: boolean;

  @Prop()
  webhook: string;

  @Prop({ default: null })
  assigned_domain: string;

  @Prop({ default: null })
  assigned_user: string;

  @Prop({ default: null })
  template_individual: string;

  @Prop({ default: null })
  template_multiple: string;

  @Prop({ default: null })
  language: string;

  @Prop({ type: [String], default: [] })
  currency: string[];

  @Prop()
  public_key: string;

  @Prop()
  private_key: string;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;

  @Prop({ default: true })
  active: boolean;
}

export type SiteDocument = Site & Document & { active: boolean };
export const SiteSchema = SchemaFactory.createForClass(Site);

SiteSchema.pre<SiteDocument>('save', function (next) {
  const now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }
  if (this.isNew && this.active === undefined) {
    this.active = true;
  }
  if (this.isNew) {
    this.public_key = generarCodigoAleatorio(10);
    this.private_key = generarCodigoAleatorio(30);
  }
  next();
});
