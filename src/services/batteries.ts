import { batteriesRef } from '@/utils/firebase';
import { Affiliate, Battery } from '@/types';
import { getBatteryUrl } from '@/services/storage';
import { id } from '@vapetool/types';

export function subscribeBatteries(onValueChange: (items: Battery[]) => void) {
  const ref = batteriesRef;

  ref.on('value', (snapshot: firebase.database.DataSnapshot) => {
    const batteriesPromise: Promise<Battery>[] = new Array<Promise<Battery>>();
    snapshot.forEach((snap) => {
      const promise = getBatteryUrl(snap.key || id(snap.val())).then((url: string | undefined) => ({
        ...snap.val(),
        url,
        id: snap.key,
        affiliate: snap.val().affiliate ? new Map(Object.entries(snap.val().affiliate)) : undefined,
      }));
      batteriesPromise.push(promise);
    });

    Promise.all(batteriesPromise).then(onValueChange);
  });

  return () => {
    ref.off();
  };
}

export function saveAffiliate(batteryId: string, { name, link }: Affiliate) {
  return batteriesRef.child(batteryId).child('affiliate').child(name).set(link);
}
