import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Template {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  html: string;

  @Prop()
  type: number;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;

  @Prop({ default: true })
  active: boolean;
}

export type TemplateDocument = Template & Document & { active: boolean };
export const TemplateSchema = SchemaFactory.createForClass(Template);

TemplateSchema.pre<TemplateDocument>('save', function (next) {
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
