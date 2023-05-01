import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DomainProcessors {
  @Prop({ required: true })
  processor_id: string;

  @Prop({ required: true })
  domain_id: string;

  @Prop({ default: '' })
  public_key: string;

  @Prop({ default: '' })
  private_key: string;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;

  @Prop({ default: true })
  active: boolean;
}

export type DomainProcessorsDocument = DomainProcessors &
  Document & { active: boolean };
export const DomainProcessorsSchema =
  SchemaFactory.createForClass(DomainProcessors);

DomainProcessorsSchema.pre<DomainProcessorsDocument>('save', function (next) {
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
