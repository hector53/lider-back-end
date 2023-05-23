import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Processor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  identy: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  fee: number;

  @Prop({ required: true })
  image: string;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;

  @Prop({ default: true })
  active: boolean;
}

export type ProcessorDocument = Processor & Document & { active: boolean };
export const ProcessorSchema = SchemaFactory.createForClass(Processor);

ProcessorSchema.pre<ProcessorDocument>('save', function (next) {
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
