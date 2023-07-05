export class FeeExtraProcessorSite {
  type: string;
  value: number;
}
export class SiteprocessorDto {
  _id?: string;

  success_url: string;

  identy: string;

  fee_extra: FeeExtraProcessorSite;

  custom_fee: string;

  hosted: boolean;
  processor_id: string;
  public_key: string;
  private_key: string;
}
