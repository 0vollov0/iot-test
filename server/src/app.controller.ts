import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService, TemperatureHumidity } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ControlLedDto } from './dto/ControlLedDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return { th_log: this.appService.getTemperatureHumidityLog() };
  }

  @Post('/led')
  controlLed(@Body() dto: ControlLedDto) {
    return this.appService.publishMessage('led', dto.flag ? 1 : 0);
  }

  @Get('TemperatureHumidity')
  getTemperatureHumidityLog() {
    return this.appService.getTemperatureHumidityLog();
  }

  @MessagePattern('TemperatureHumidity')
  handleIncomingMessage(@Payload() data: Omit<TemperatureHumidity, 'createdAt'>) {
    this.appService.publishTemperatureHumidity(data);
  }
}
