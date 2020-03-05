import { Effect } from 'dva';
import { Reducer, Dispatch } from 'redux';

import { id } from '@vapetool/types';
import { Battery } from '@/types';
import { ConnectState } from '@/models/connect';
import { setAffiliate } from '@/services/batteries';

export const BATTERIES = 'batteries';
export const SET_BATTERIES = 'setBatteries';
export const SHOW_NEW_AFFILIATE_MODAL = 'showNewAffiliateModal';
export const HIDE_NEW_AFFILIATE_MODAL = 'hideNewAffiliateModal';
export const EDIT_AFFILIATE = 'editAffiliate';
export const TOGGLE_EDIT_BATTERY = 'toggleEditBattery';
export const SELECT_BATTERY = 'selectBattery';
export const ADD_BATTERY = 'addBattery';
export const REMOVE_BATTERY = 'removeBattery';
export const SET_BATTERY = 'setBattery';
export const SET_AFFILIATE = 'setAffiliate';

export function dispatchSetAffiliate(
  dispatch: Dispatch,
  affiliate: { name: string; link: string | null },
) {
  dispatch({
    type: `${BATTERIES}/${SET_AFFILIATE}`,
    affiliate,
  });
}

export function dispatchSetBatteries(dispatch: Dispatch, batteries: Battery[]) {
  dispatch({
    type: `${BATTERIES}/${SET_BATTERIES}`,
    batteries,
  });
}

export function dispatchSelectBattery(dispatch: Dispatch, battery?: Battery) {
  dispatch({
    type: `${BATTERIES}/${SELECT_BATTERY}`,
    battery,
  });
}

export function dispatchToggleEditBattery(dispatch: Dispatch) {
  dispatch({
    type: `${BATTERIES}/${TOGGLE_EDIT_BATTERY}`,
  });
}

export interface BatteriesModelState {
  batteries: Battery[];
  selectedBattery?: Battery;
  editBattery?: boolean;
  showNewAffiliateModal?: boolean;
}

export interface BatteriesModelType {
  namespace: string;
  state: BatteriesModelState;
  effects: {
    [SET_AFFILIATE]: Effect;
  };
  reducers: {
    [SHOW_NEW_AFFILIATE_MODAL]: Reducer<BatteriesModelState>;
    [HIDE_NEW_AFFILIATE_MODAL]: Reducer<BatteriesModelState>;
    [TOGGLE_EDIT_BATTERY]: Reducer<BatteriesModelState>;
    [SELECT_BATTERY]: Reducer<BatteriesModelState>;
    [ADD_BATTERY]: Reducer<BatteriesModelState>;
    [REMOVE_BATTERY]: Reducer<BatteriesModelState>;
    [SET_BATTERY]: Reducer<BatteriesModelState>;
    [SET_BATTERIES]: Reducer<BatteriesModelState>;
  };
}

const BatteriesModel: BatteriesModelType = {
  namespace: BATTERIES,

  state: {
    batteries: [],
    selectedBattery: undefined,
    editBattery: false,
    showNewAffiliateModal: undefined,
  },
  effects: {
    *setAffiliate({ affiliate }, { call, select }) {
      const selectedBattery = yield select(
        (state: ConnectState) => state.batteries.selectedBattery,
      );
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
      const newBatteries = state.batteries.map((it: Battery) => {
        if (battery === id(it)) {
          return battery;
        }
        return it;
      });
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
};

export default BatteriesModel;
