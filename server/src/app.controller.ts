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

  @Post('led')
  controlLed(@Body() dto: ControlLedDto) {
    console.log(dto);
    
    this.appService.publishMessage('0vollov0/led', dto.flag);
    return dto.flag;
  }

  @Get('dht11')
  getTemperatureHumidityLog() {
    return this.appService.getTemperatureHumidityLog();
  }

  @MessagePattern('0vollov0/dht11')
  handleIncomingMessage(@Payload() data: Omit<TemperatureHumidity, 'createdAt'>) {
    this.appService.publishTemperatureHumidity(data);
  }
}
