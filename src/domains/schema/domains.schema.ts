import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generarCodigoAleatorio } from 'src/utils/coderandom.utils';

@Schema()
export class Domain {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  token: string;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;

  @Prop({ default: true })
  active: boolean;
}

export type DomainDocument = Domain & Document & { active: boolean };
export const DomainSchema = SchemaFactory.createForClass(Domain);

DomainSchema.pre<DomainDocument>('save', function (next) {
  const now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }
  if (this.isNew && this.active === undefined) {
    this.active = true;
  }

  if (this.isNew) {
    this.token = generarCodigoAleatorio(10);
  }
  next();
});
