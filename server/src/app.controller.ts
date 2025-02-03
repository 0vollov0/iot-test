import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService, TemperatureHumidity } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ControllLedDto } from './dto/ControllLedDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return { th_log: this.appService.getTemperatureHumidityLog() };
  }

  @Post('/led')
  controllLed(@Body() dto: ControllLedDto) {
    return this.appService.publishMessage('led', dto.flag ? 1 : 0);
  }

  @Get('TemperatureHumidity')
  getTemperatureHumidityLog() {
    return this.appService.getTemperatureHumidityLog();
  }

  @MessagePattern('TemperatureHumidity')
  handleIncomingMessage(@Payload() data: string) {
    const dto = JSON.parse(data) as Omit<TemperatureHumidity, 'createdAt'>;
    this.appService.publishTemperatureHumidity(dto);
    return `Received: ${JSON.stringify(data)}`;
  }
}
