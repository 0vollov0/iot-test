import { IsBoolean, IsNumber, Max, Min } from 'class-validator';

export class ControlLedDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  @Min(0)
  @Max(1)
  flag: boolean;
}
