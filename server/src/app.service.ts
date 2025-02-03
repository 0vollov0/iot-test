import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export type TemperatureHumidity = {
  tep: number;
  hum: number;
  createdAt: Date;
};

@Injectable()
export class AppService {
  private mqttClient: ClientProxy;
  private TH_LOGS: TemperatureHumidity[];

  constructor() {
    this.mqttClient = ClientProxyFactory.create({
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://localhost:1883',
      },
    });
    this.TH_LOGS = [];
  }

  publishTemperatureHumidity(dto: Omit<TemperatureHumidity, 'createdAt'>) {
    this.TH_LOGS.push({
      ...dto,
      createdAt: new Date(),
    });
  }

  getTemperatureHumidityLog() {
    return this.TH_LOGS;
  }

  publishMessage(topic: string, message: any) {
    return this.mqttClient.emit(topic, message); // MQTT 메시지 발행
  }
}
