import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

type VerifyVc = {
  vc: string;
};

type IssueVc = {
  hodlerAddress: string;
  type: string;
  name: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('registerDID')
  async registerDID(): Promise<void> {
    return await this.appService.registerDID();
  }

  @Post('/issueVc')
  async issueVc(@Body() body: IssueVc): Promise<string> {
    return await this.appService.issueVc(
      body.hodlerAddress,
      body.type,
      body.name,
    );
  }

  @Post('/verifyVc')
  async verifyVc(@Body() body: VerifyVc): Promise<boolean> {
    return await this.appService.verifyVc(body.vc);
  }
}
