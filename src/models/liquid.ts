import { Dispatch, Reducer } from 'redux';
import { Effect } from 'dva';
import { Flavor, Liquid, Result } from '@vapetool/types';
import { message } from 'antd';
import { calculateResults } from '@/services/liquid';
import { ConnectState } from '@/models/connect';

export const LIQUID = 'liquid';
export const SHOW_NEW_FLAVOR_MODAL = 'showNewFlavorModal';
export const HIDE_NEW_FLAVOR_MODAL = 'hideNewFlavorModal';
export const SET_TARGET_RATIO = 'setTargetRatio';
export const SET_TARGET_STRENGTH = 'setTargetStrength';
export const SET_AMOUNT = 'setAmount';
export const SET_THINNER = 'setThinner';
export const SET_BASE_RATIO = 'setBaseRatio';
export const SET_BASE_STRENGTH = 'setBaseStrength';
export const CALCULATE_RESULTS = 'calculateResults';
export const SET_LIQUID = 'setLiquid';
export const SET_RESULTS = 'setResults';
export const ADD_FLAVOR = 'addFlavor';
export const REMOVE_FLAVOR = 'removeFlavor';
export const EDIT_FLAVOR = 'editFlavor';
export const SET_FLAVOR = 'setFlavor';

/**
 * show modal to all new flavor
 * @param dispatch - Dispatcher
 */
export function dispatchShowNewFlavorModal(dispatch: Dispatch) {
  dispatch({
    type: `${LIQUID}/${SHOW_NEW_FLAVOR_MODAL}`,
  });
}

/**
 * hide modal to all new flavor
 * @param dispatch - Dispatcher
 */
export function dispatchHideNewFlavorModal(dispatch: Dispatch) {
  dispatch({
    type: `${LIQUID}/${HIDE_NEW_FLAVOR_MODAL}`,
  });
}

/**
 * dispatch new target ratio PG.
 * @param dispatch - Dispatcher
 * @param ratio - value in range from 0 to 100
 */
export function dispatchSetTargetRatio(dispatch: Dispatch, ratio: number) {
  dispatch({
    type: `${LIQUID}/${SET_TARGET_RATIO}`,
    ratio,
  });
}

/**
 * dispatch new target liquid strength mg/ml
 * @param dispatch - Dispatcher
 * @param strength - positive number in mg/ml unit
 */
export function dispatchSetTargetStrength(dispatch: Dispatch, strength: number | undefined) {
  dispatch({
    type: `${LIQUID}/${SET_TARGET_STRENGTH}`,
    strength,
  });
}

/**
 * dispatch new target amount ml
 * @param dispatch - Dispatcher
 * @param amount - positive number ml unit
 */
export function dispatchSetAmount(dispatch: Dispatch, amount: number | undefined) {
  dispatch({
    type: `${LIQUID}/${SET_AMOUNT}`,
    amount,
  });
}

/**
 * dispatch new thinner %
 * @param dispatch - Dispatcher
 * @param thinner - positive number in percentage unit
 */
export function dispatchSetThinner(dispatch: Dispatch, thinner: number | undefined) {
  dispatch({
    type: `${LIQUID}/${SET_THINNER}`,
    thinner,
  });
}

/**
 * dispatch new base ratio PG.
 * @param dispatch - Dispatcher
 * @param ratio - value in range from 0 to 100
 */
export function dispatchSetBaseRatio(dispatch: Dispatch, ratio: number) {
  dispatch({
    type: `${LIQUID}/${SET_BASE_RATIO}`,
    ratio,
  });
}

/**
 * dispatch new base strength mg/ml
 * @param dispatch - Dispatcher
 * @param strength - positive number in mg/ml unit
 */
export function dispatchSetBaseStrength(dispatch: Dispatch, strength: number | undefined) {
  dispatch({
    type: `${LIQUID}/${SET_BASE_STRENGTH}`,
    strength,
  });
}

/**
 * dispatch calculate results for specified liquid
 * @param dispatch - Dispatcher
 */
export function dispatchCalculateResults(dispatch: Dispatch) {
  dispatch({
    type: `${LIQUID}/${CALCULATE_RESULTS}`,
  });
}

/**
 * add flavor to flavor collection
 * @param dispatch - Dispatcher
 * @param flavor - new flavor
 */
export function dispatchAddFlavor(dispatch: Dispatch, flavor: Flavor) {
  dispatch({
    type: `${LIQUID}/${ADD_FLAVOR}`,
    payload: flavor,
  });
}

/**
 * set flavor in flavor collection
 * @param dispatch - Dispatcher
 * @param uid - flavor uid
 * @param row - row values of updated flavor
 */
export function dispatchSetFlavor(dispatch: Dispatch, uid: string, row: any) {
  dispatch({
    type: `${LIQUID}/${SET_FLAVOR}`,
    payload: { uid, row },
  });
}

export interface LiquidModelState {
  currentLiquid: Liquid;
  results?: Result[];
  editingFlavor?: string;
  showNewFlavorModal?: boolean;
}

export interface LiquidModelType {
  namespace: string;
  state: LiquidModelState;
  reducers: {
    [SET_BASE_STRENGTH]: Reducer<LiquidModelState>;
    [SET_BASE_RATIO]: Reducer<LiquidModelState>;
    [SET_THINNER]: Reducer<LiquidModelState>;
    [SET_AMOUNT]: Reducer<LiquidModelState>;
    [SET_TARGET_STRENGTH]: Reducer<LiquidModelState>;
    [SET_TARGET_RATIO]: Reducer<LiquidModelState>;

    [SET_LIQUID]: Reducer<LiquidModelState>;
    [SET_RESULTS]: Reducer<LiquidModelState>;

    [SHOW_NEW_FLAVOR_MODAL]: Reducer<LiquidModelState>;
    [HIDE_NEW_FLAVOR_MODAL]: Reducer<LiquidModelState>;
    [ADD_FLAVOR]: Reducer<LiquidModelState>;
    [EDIT_FLAVOR]: Reducer<LiquidModelState>;
    [SET_FLAVOR]: Reducer<LiquidModelState>;
    [REMOVE_FLAVOR]: Reducer<LiquidModelState>;
  };
  effects: {
    [CALCULATE_RESULTS]: Effect;
  };
}

const LiquidModel: LiquidModelType = {
  namespace: LIQUID,
  state: {
    currentLiquid: new Liquid(),
    results: [],
    showNewFlavorModal: false,
  },
  effects: {
    *calculateResults(_, { select, call, put, cancel }) {
      try {
        const currentLiquid = yield select((state: ConnectState) => state.liquid.currentLiquid);

        const response = yield call(calculateResults, currentLiquid);
        if (response instanceof Response) {
          cancel();
        } else if (response instanceof Array) {
          yield put({
            type: `${LIQUID}/${SET_RESULTS}`,
            payload: response,
          });
        }
      } catch (e) {
        message.error(e.message);
      }
    },
  },
  reducers: {
    setBaseStrength(
      state = {
        currentLiquid: new Liquid(),
      },
      { strength },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          baseStrength: strength,
        },
      };
    },
    setBaseRatio(
      state = {
        currentLiquid: new Liquid(),
      },
      { ratio },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          baseRatio: ratio,
        },
      };
    },
    setThinner(
      state = {
        currentLiquid: new Liquid(),
      },
      { payload: thinner },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          thinner,
        },
      };
    },
    setAmount(
      state = {
        currentLiquid: new Liquid(),
      },
      { amount },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          amount,
        },
      };
    },
    setTargetStrength(
      state = {
        currentLiquid: new Liquid(),
      },
      { strength },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          targetStrength: strength,
        },
      };
    },
    setTargetRatio(
      state = {
        currentLiquid: new Liquid(),
      },
      { ratio },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          targetRatio: ratio,
        },
      };
    },
    setResults(state = { currentLiquid: new Liquid() }, { payload }): LiquidModelState {
      return {
        ...(state as LiquidModelState),
        results: payload,
      };
    },
    setLiquid(state = { currentLiquid: new Liquid() }, { payload }): LiquidModelState {
      return {
        ...state,
        currentLiquid: payload,
      };
    },

    editFlavor(
      state: LiquidModelState = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      return {
        ...state,
        editingFlavor: payload,
      };
    },
    showNewFlavorModal(
      state: LiquidModelState = { currentLiquid: new Liquid() },
    ): LiquidModelState {
      return {
        ...state,
        showNewFlavorModal: true,
      };
    },
    hideNewFlavorModal(
      state: LiquidModelState = { currentLiquid: new Liquid() },
    ): LiquidModelState {
      return {
        ...state,
        showNewFlavorModal: false,
      };
    },
    addFlavor(
      state: LiquidModelState = {
        currentLiquid: new Liquid(),
      },
      { payload },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          flavors: [...state.currentLiquid.flavors, payload],
        },
      };
    },
    setFlavor(
      state = { currentLiquid: new Liquid() },
      { payload: { uid, row } },
    ): LiquidModelState {
      const newData = [...state.currentLiquid.flavors];
      const index = newData.findIndex(item => uid === item.uid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }

      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          flavors: newData,
        },
      };
    },
    removeFlavor(state = { currentLiquid: new Liquid() }, { payload }): LiquidModelState {
      const newFlavors = state.currentLiquid.flavors.filter(
        (flavor: Flavor) => flavor.uid !== payload,
      );
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          flavors: newFlavors,
        },
      };
    },
  },
};

export default LiquidModel;
