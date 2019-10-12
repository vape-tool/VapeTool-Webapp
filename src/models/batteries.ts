import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { id } from '@vapetool/types';
import { database, DataSnapshot } from '@/utils/firebase';
import { getBatteryUrl } from '@/services/storage';
import { Battery } from '@/types/battery';
import { ConnectState } from '@/models/connect';
import { setAffiliate } from '@/services/batteries';

export interface BatteriesModelState {
  batteries: Battery[];
  selectedBattery?: Battery;
  editBattery?: boolean;
  editingAffiliate?: string;
  showNewAffiliateModal?: boolean;
}

export interface BatteriesModelType {
  namespace: string;
  state: BatteriesModelState;
  effects: {
    setAffiliate: Effect;
  };
  reducers: {
    showNewAffiliateModal: Reducer<BatteriesModelState>;
    hideNewAffiliateModal: Reducer<BatteriesModelState>;
    editAffiliate: Reducer<BatteriesModelState>;
    toggleEditBattery: Reducer<BatteriesModelState>;
    selectBattery: Reducer<BatteriesModelState>;
    addBattery: Reducer<BatteriesModelState>;
    removeBattery: Reducer<BatteriesModelState>;
    setBattery: Reducer<BatteriesModelState>;
    setBatteries: Reducer<BatteriesModelState>;
  };
  subscriptions: {
    subscribeBatteries: Subscription;
  };
}

const BatteriesModel: BatteriesModelType = {
  namespace: 'batteries',

  state: {
    batteries: [],
    selectedBattery: undefined,
    editBattery: false,
    editingAffiliate: undefined,
    showNewAffiliateModal: undefined,
  },
  effects: {
    *setAffiliate({ affiliate }, { call, select, put }) {
      console.log('model/setAffiliate');
      console.log(affiliate);
      const selectedBattery = yield select(
        (state: ConnectState) => state.batteries.selectedBattery,
      );
      console.log(`model/selected battery: ${selectedBattery}`);
      if (!selectedBattery) throw Error('can not set affiliate on undefined battery');

      yield call(setAffiliate, selectedBattery.id, affiliate);
    },
  },
  reducers: {
    hideNewAffiliateModal(state = { batteries: [] }): BatteriesModelState {
      return {
        ...(state as BatteriesModelState),
        showNewAffiliateModal: false,
      };
    },
    showNewAffiliateModal(state = { batteries: [] }): BatteriesModelState {
      return {
        ...(state as BatteriesModelState),
        showNewAffiliateModal: true,
      };
    },
    editAffiliate(state = { batteries: [] }, { name }): BatteriesModelState {
      return {
        ...(state as BatteriesModelState),
        editingAffiliate: name,
      };
    },
    toggleEditBattery(state = { batteries: [] }): BatteriesModelState {
      return {
        ...(state as BatteriesModelState),
        editBattery: !state.editBattery,
      };
    },
    selectBattery(state = { batteries: [] }, { battery }): BatteriesModelState {
      return {
        ...(state as BatteriesModelState),
        selectedBattery: battery,
      };
    },
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
        (battery === id(it) ? battery : it),
      );
      return {
        ...(state as BatteriesModelState),
        batteries: newBatteries,
      };
    },
    setBatteries(state = { batteries: [] }, { batteries }): BatteriesModelState {
      console.log('setBatteries');
      const { selectedBattery } = state;
      const refreshedSelectedBat = selectedBattery
        ? batteries.find((battery: Battery) => battery.id === selectedBattery.id)
        : undefined;
      return {
        ...(state as BatteriesModelState),
        batteries,
        selectedBattery: refreshedSelectedBat,
      };
    },
  },

  subscriptions: {
    subscribeBatteries({ dispatch }) {
      console.log('subscribeBatteries');
      const ref = database.ref('batteries');

      ref.on('value', (snapshot: DataSnapshot) => {
        console.log('fetched batteries');
        const batteriesPromise: Promise<Battery>[] = new Array<Promise<Battery>>();
        snapshot.forEach(snap => {
          const promise = getBatteryUrl(snap.key || id(snap.val())).then((url: string) => ({
            ...snap.val(),
            url,
            id: snap.key,
            affiliate: snap.val().affiliate
              ? new Map(Object.entries(snap.val().affiliate))
              : undefined,
          }));
          batteriesPromise.push(promise);
        });

        Promise.all(batteriesPromise).then(batteries => {
          dispatch({
            type: 'setBatteries',
            batteries,
          });
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
