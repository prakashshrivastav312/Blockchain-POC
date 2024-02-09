import { Injectable, Logger } from '@nestjs/common';
import { TransactionDto } from './DTO/Transaction.dto';
import axios from 'axios';
const API_KEY = 'W3IGGRT4PQSDCI9K5AZVVM6HKXVRM4TR5N';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);
 

  async getTransactionStatus(transactionHash: string): Promise<any> {
    this.logger.log(`Transaction hash --> ${transactionHash}`);
    
    const block = await this.queryToCheckStatus(transactionHash);
    this.logger.log(`Status of transaction hash --> ${block}`);

    if(block.status === '1'){
      return{
        StatusOfTransaction: "Success",
      }
    }else{
      return{
        StatusOfTransaction: "Failed",
      }
    }
   
  }

  async queryToCheckStatus(transactionHash: string): Promise<any> {
    const response = await axios.get(`https://api.etherscan.io/api?module=transaction&action=getstatus&txhash=${transactionHash}&apikey=${API_KEY}`);
    return response.data;
  }

  async toCheckTheImmutability(transactionHash: string): Promise<any> {
    this.logger.log(`Transaction Hash  --> ${transactionHash}`);
    const valueInWeb2 = 0.66;
    
    const block = await this.getTransactionHashesForNFTAddress(transactionHash);
    this.logger.log(`Status of transaction hash --> ${block}`);
    console.log(block);
    const valueInTransaction = block.result.value;
    const valueInWei = parseInt(valueInTransaction, 16);
    const valueInEther = valueInWei / Math.pow(10, 18);

    if(valueInEther === valueInWeb2){
      return {
        Immutability: "Success",
        Message: "There is no change in ETH value, The value of ETH is same as what we have sent through a backend",
      }
    }

    return {
      Message: "The ETH value are differ!"
    };
   
  }

  async queryToCheckBlock(transactionHash: string): Promise<any> {
    const response = await axios.get(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${transactionHash}&apikey=${API_KEY}`);
    return response.data;
  }

  
  async getNFTDetails(transactionHash: string): Promise<any> {
    this.logger.log(`Transaction hash --> ${transactionHash}`);
    
    const block = await this.queryToNFT(transactionHash);
    console.log(block);
    const logs = block.result.logs;
    console.log(logs.length);
    console.log(logs[1].topics);
    const v = this.decodeHexNumber(logs[1].topics[3]);
    console.log('hex', v);

    // Parse and format each log entry
  const formattedLogs = logs[1].topics.map(log => {
  const { timestamp, level, message, ...extra } = JSON.parse(log);
  const formattedTimestamp = new Date(timestamp).toLocaleString();
  const formattedExtra = Object.keys(extra).map(key => `${key}: ${extra[key]}`).join(', ');
  return `${formattedTimestamp} [${level}] - ${message}${formattedExtra ? ` (${formattedExtra})` : ''}`;
});

// Print formatted logs
formattedLogs.forEach(log => console.log(log));
    this.logger.log(`Status of transaction hash --> ${block}`);

    if(block.status === '1'){
      return{
        StatusOfTransaction: "Success",
      }
    }else{
      return{
        StatusOfTransaction: "Failed",
      }
    }
   
  }


  async queryToNFT(transactionHash: string): Promise<any> {
    const response = await axios.get(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${transactionHash}&apikey=${API_KEY}`);
    return response.data;
  }


  decodeHexAddress(hexAddress: string): string {
    // Ensure hexAddress is a string and remove '0x' prefix if present
    const cleanHex = hexAddress.startsWith('0x') ? hexAddress.slice(2) : hexAddress;
    console.log('cleanHex', cleanHex);
    // Add '0x' prefix and convert to readable address
    const readableAddress = `0x${cleanHex}`;
    return readableAddress;
  }

  decodeHexNumber(hexNumber: string): number {
    // Convert hex number to decimal
    const decimalNumber = parseInt(hexNumber, 16);
    return decimalNumber;
  }


  // Function to fetch transaction hashes for a given NFT address
async  getTransactionHashesForNFTAddress(nftAddress) {
  try {
      const response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokennfttx&address=${nftAddress}&apikey=${API_KEY}`);
      
      // Extract transaction hashes from the response
      console.log(response.data);
      const transactionHashes = response.data.result.map(tx => tx.hash);
      
      return transactionHashes;
  } catch (error) {
      console.error('Error fetching transaction hashes:', error);
      throw error;
  }
}


}
