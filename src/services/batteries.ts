import { batteriesRef } from '@/utils/firebase';
import { Affiliate, Battery } from '@/types';
import { getBatteryUrl } from '@/services/storage';
import { id } from '@vapetool/types';
import { Dispatch } from 'umi';
import { dispatchSetBatteries } from '@/models/batteries';

export function subscribeBatteries(dispatch: Dispatch) {
  const ref = batteriesRef;

  ref.on('value', (snapshot: firebase.database.DataSnapshot) => {
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
    ref.off();
  };
}

export function setAffiliate(batteryId: string, { name, link }: Affiliate) {
  return batteriesRef
    .child(batteryId)
    .child('affiliate')
    .child(name)
    .set(link);
}
