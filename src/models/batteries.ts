import { Subscription } from 'dva';
import { Reducer } from 'redux';

import { id, OnlineContentStatus } from '@vapetool/types';
import { database, DataSnapshot } from '@/utils/firebase';
import { getBatteryUrl } from '@/services/storage';
import { Battery } from '@/types/battery';

export interface BatteriesModelState {
  batteries: Battery[];
}

export interface BatteriesModelType {
  namespace: string;
  state: BatteriesModelState;
  reducers: {
    addBattery: Reducer<BatteriesModelState>;
    removeBattery: Reducer<BatteriesModelState>;
    setBattery: Reducer<BatteriesModelState>;
  };
  subscriptions: {
    subscribeBatteries: Subscription;
  };
}

const BatteriesModel: BatteriesModelType = {
  namespace: 'batteries',

  state: {
    batteries: [],
  },

  reducers: {
    addBattery(state = { batteries: [] }, { battery }): BatteriesModelState {
      state.batteries.push(battery);
      return {
        ...(state as BatteriesModelState),
        batteries: state.batteries,
      };
    },
    removeBattery(state = { batteries: [] }, { key }): BatteriesModelState {
      const newBatteries = state.batteries.filter((battery: Battery) => id(battery) !== key);
      return {
        ...(state as BatteriesModelState),
        batteries: newBatteries,
      };
    },
    setBattery(state = { batteries: [] }, { battery }): BatteriesModelState {
      const newBatteries = state.batteries.map((it: Battery) =>
        (battery === id(it) ? battery : it));
      return {
        ...(state as BatteriesModelState),
        batteries: newBatteries,
      };
    },
  },

  subscriptions: {
    subscribeBatteries({ dispatch }) {
      console.log('subscribeBatteries');
      const ref = database
        .ref('batteries')
        .orderByChild('status')
        .equalTo(OnlineContentStatus.ONLINE_PUBLIC)
        .limitToLast(100);

      ref.on('child_added', (snapshot: DataSnapshot) => {
        if (!snapshot || !snapshot.key) {
          return;
        }
        getBatteryUrl(snapshot.key).then(url =>
          dispatch({
            type: 'addBattery',
            battery: Object.create({ ...snapshot.val(), url }) as Battery,
          }),
        );
      });
      ref.on('child_changed', (snapshot: DataSnapshot) => {
        dispatch({
          type: 'setBattery',
          battery: snapshot.val(),
        });
      });
      ref.on('child_removed', (snapshot: DataSnapshot) => {
        dispatch({
          type: 'removeBattery',
          key: snapshot.key,
        });
      });

      return () => {
        console.log('unsubscribeBatteries triggered');
        ref.off();
      };
    },
  },
};

export default BatteriesModel;
