import { IsNotEmpty } from 'class-validator';
export class CreateDomainsProcessorDto {
  @IsNotEmpty()
  processor_id: string;

  domain_id: string;

  public_key: string;

  private_key: string;
}
