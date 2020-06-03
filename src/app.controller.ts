import { Controller, Get, HttpStatus, Res, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/check/db/check')
  public async checkMainDb(@Res() res: any) {
    try {
      const ress = await this.appService.getDbData();
      // console.log(ress);
      return res.status(HttpStatus.OK).send(ress);
    } catch (err) {
      // console.log(err);
      return res.status(HttpStatus.BAD_REQUEST).send(err);
    }
  }

  @Post('/check/db/insert')
  public async checkInsert(@Res() res: any) {
    try {
      const response = await this.appService.addData();

      return res.status(HttpStatus.OK).send(response);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send(err);
    }
  }

  @Post('/check/db/inserte')
  public async checkInserte(@Res() res: any) {
    try {
      const response = await this.appService.addDataError();

      return res.status(HttpStatus.OK).send(response);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send(err);
    }
  }

  @Put('/check/db/update')
  public async checkUpdate(@Res() res: any) {
    try {
      const response = await this.appService.updateData();

      return res.status(HttpStatus.OK).send(response);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).send(err);
    }
  }
}
