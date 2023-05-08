import { IsNotEmpty } from 'class-validator';
export class CreateDomainsProcessorDto {
  _id?: string;

  @IsNotEmpty()
  processor_id: string;

  domain_id: string;

  public_key: string;

  private_key: string;
}
