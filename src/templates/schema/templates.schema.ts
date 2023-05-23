import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Template {
  @Prop()
  name: string;

  @Prop()
  html: string;

  @Prop()
  type: number;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;
}

export type TemplateDocument = Template & Document & { active: boolean };
export const TemplateSchema = SchemaFactory.createForClass(Template);

TemplateSchema.pre<TemplateDocument>('save', function (next) {
  const now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }

  next();
});
