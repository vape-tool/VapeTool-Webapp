import { Battery as FirebaseBattery } from '@vapetool/types';

export default interface Battery extends FirebaseBattery {
  url: string;
  id: string;
}
