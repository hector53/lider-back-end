import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class FEE_EXTRA extends Document {
  @Prop()
  type: string;

  @Prop()
  value: number;
}

@Schema()
export class ProcessorsSiteDomainCLass {
  @Prop({ required: true })
  site_id: string;

  @Prop({ required: true })
  domain_id: string;

  @Prop({ required: true })
  processor_domain_id: string;

  @Prop({ required: true })
  processor_id: string;

  @Prop({ required: true })
  identy: string;

  @Prop()
  fee_extra: FEE_EXTRA; // especifica el tipo de fee_extra como un objeto

  @Prop({ required: true })
  custom_fee: number;

  @Prop({ default: false })
  hosted: boolean;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;

  @Prop({ default: false })
  active: boolean;
}

export type ProcessorsSiteDomainDocument = ProcessorsSiteDomainCLass &
  Document & { active: boolean };
export const ProcessorsSiteDomainSchema = SchemaFactory.createForClass(
  ProcessorsSiteDomainCLass,
);

ProcessorsSiteDomainSchema.pre<ProcessorsSiteDomainDocument>(
  'save',
  function (next) {
    const now = new Date();
    this.updated = now;
    if (!this.created) {
      this.created = now;
    }
    if (this.isNew && this.active === undefined) {
      this.active = false;
    }
    next();
  },
);
