import { batteriesRef, DataSnapshot } from '@/utils/firebase';
import { Affiliate, Battery } from '@/types';
import { getBatteryUrl } from '@/services/storage';
import { id } from '@vapetool/types';
import { Dispatch } from 'redux';
import { dispatchSetBatteries } from '@/models/batteries';

export function subscribeBatteries(dispatch: Dispatch) {
  console.log('subscribeBatteries');
  const ref = batteriesRef;

  ref.on('value', (snapshot: DataSnapshot) => {
    console.log('fetched batteries');
    const batteriesPromise: Promise<Battery>[] = new Array<Promise<Battery>>();
    snapshot.forEach(snap => {
      const promise = getBatteryUrl(snap.key || id(snap.val())).then((url: string) => ({
        ...snap.val(),
        url,
        id: snap.key,
        affiliate: snap.val().affiliate ? new Map(Object.entries(snap.val().affiliate)) : undefined,
      }));
      batteriesPromise.push(promise);
    });

    Promise.all(batteriesPromise).then(batteries => {
      dispatchSetBatteries(dispatch, batteries);
    });
  });

  return () => {
    console.log('unsubscribeBatteries triggered');
    ref.off();
  };
}

export function setAffiliate(batteryId: string, { name, link }: Affiliate) {
  console.log(`setAffiliate for ${batteryId} name: ${name} : ${link}`);
  return batteriesRef
    .child(batteryId)
    .child('affiliate')
    .child(name)
    .set(link);
}
