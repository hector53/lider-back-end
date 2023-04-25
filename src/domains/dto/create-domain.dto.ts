import { IsNotEmpty } from 'class-validator';
export class CreateDomainDto {
  @IsNotEmpty()
  url: string;
}
