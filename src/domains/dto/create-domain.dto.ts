import { IsNotEmpty } from 'class-validator';
export class CreateDomainDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  url: string;
}
