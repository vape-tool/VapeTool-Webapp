import { Battery as FirebaseBattery } from '@vapetool/types';

export interface Battery extends FirebaseBattery {
  url: string;
  id: string;
}
