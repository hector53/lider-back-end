import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentTokenService } from './payment_token.service';
import { CreatePaymentTokenDto } from './dto/create-payment_token.dto';
import { UpdatePaymentTokenDto } from './dto/update-payment_token.dto';
import { GetTokenDto } from './dto/get-token.dto';
import { GetProcessorDto } from './dto/get_processor.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Controller('payment-token')
export class PaymentTokenController {
  constructor(private readonly paymentTokenService: PaymentTokenService) {}

  @Post()
  create(@Body() createPaymentTokenDto: CreatePaymentTokenDto) {
    console.log('createPaymentTokenDto', createPaymentTokenDto);
    return this.paymentTokenService.create(createPaymentTokenDto);
  }

  @Get()
  createTokenGet(@Body() createPaymentTokenDto: CreatePaymentTokenDto) {
    console.log('createPaymentTokenDto', createPaymentTokenDto);
    return this.paymentTokenService.create(createPaymentTokenDto);
  }

  @Post('/get')
  getByToken(@Body() getTokenDto: GetTokenDto) {
    return this.paymentTokenService.getByToken(getTokenDto);
  }

  @Post('/get_processor')
  get_processor(@Body() getProcessorDto: GetProcessorDto) {
    return this.paymentTokenService.getProcessorData(getProcessorDto);
  }

  @Post('/update_token')
  update_token(@Body() updateTokenDto: UpdateTokenDto) {
    return this.paymentTokenService.update_token_paid(updateTokenDto);
  }

  @Get()
  findAll() {
    return this.paymentTokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTokenService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentTokenDto: UpdatePaymentTokenDto,
  ) {
    return this.paymentTokenService.update(+id, updatePaymentTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentTokenService.remove(+id);
  }
}
