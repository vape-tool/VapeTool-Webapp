import { database } from '@/utils/firebase';
import { Affiliate } from '@/types';

export function setAffiliate(batteryId: string, { name, link }: Affiliate) {
  console.log(`setAffiliate for ${batteryId} name: ${name} : ${link}`);
  return database
    .ref('batteries')
    .child(batteryId)
    .child('affiliate')
    .child(name)
    .set(link);
}
