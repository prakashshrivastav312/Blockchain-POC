import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionDto } from './DTO/Transaction.dto';

@Controller('trans')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-status-of-tranasaction/:transactionHash')
  async getTransactions(@Param('transactionHash') transactionHash: string
  ): Promise<TransactionDto[]> {
    const transactions = await this.appService.getTransactionStatus(transactionHash);
    return transactions;
  }


  @Get('get-details-of-immutability/:transactionHash')
  async toCheckImmutabiity(@Param('transactionHash') transactionHash: string
  ): Promise<TransactionDto[]> {
    const transactions = await this.appService.toCheckTheImmutability(transactionHash);
    return transactions;
  }

  @Get('get-nft-details/:transactionHash')
  async getNFTDetailsThroughTransactionHash(@Param('transactionHash') transactionHash: string
  ): Promise<TransactionDto[]> {
    const transactions = await this.appService.getNFTDetails(transactionHash);
    return transactions;
  }
}
