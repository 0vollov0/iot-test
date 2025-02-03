import { IsBoolean } from 'class-validator';

export class ControllLedDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsBoolean()
  flag: boolean;
}
