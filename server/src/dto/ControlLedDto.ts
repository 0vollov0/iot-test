import { IsBoolean } from 'class-validator';

export class ControlLedDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsBoolean()
  flag: boolean;
}
