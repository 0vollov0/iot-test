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
        url: 'mqtt://test.mosquitto.org',
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
    this.mqttClient
    return this.mqttClient.emit(topic, message);
  }
}
