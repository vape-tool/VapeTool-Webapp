import { Dispatch, Reducer } from 'redux';
import { Effect } from 'dva';
import { Flavor, Liquid, Result } from '@vapetool/types';
import { message } from 'antd';
import { calculateResults } from '@/services/liquid';
import { ConnectState } from '@/models/connect';

/**
 * show modal to all new flavor
 * @param dispatch - Dispatcher
 */
export function dispatchShowNewFlavorModal(dispatch: Dispatch) {
  dispatch({
    type: 'liquid/showNewFlavorModal',
  });
}

/**
 * dispatch new target ratio PG.
 * @param dispatch - Dispatcher
 * @param ratio - value in range from 0 to 100
 */
export function dispatchSetTargetRatio(dispatch: Dispatch, ratio: number) {
  dispatch({
    type: 'liquid/setTargetRatio',
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
    type: 'liquid/setTargetStrength',
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
    type: 'liquid/setAmount',
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
    type: 'liquid/setThinner',
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
    type: 'liquid/setBaseRatio',
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
    type: 'liquid/setBaseStrength',
    strength,
  });
}

/**
 * dispatch calculate results for specified liquid
 * @param dispatch - Dispatcher
 */
export function dispatchCalculateResults(dispatch: Dispatch) {
  dispatch({
    type: 'liquid/calculateResults',
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
    setBaseStrength: Reducer<LiquidModelState>;
    setBaseRatio: Reducer<LiquidModelState>;
    setThinner: Reducer<LiquidModelState>;
    setAmount: Reducer<LiquidModelState>;
    setTargetStrength: Reducer<LiquidModelState>;
    setTargetRatio: Reducer<LiquidModelState>;

    setLiquid: Reducer<LiquidModelState>;
    setResults: Reducer<LiquidModelState>;

    showNewFlavorModal: Reducer<LiquidModelState>;
    hideNewFlavorModal: Reducer<LiquidModelState>;
    addFlavor: Reducer<LiquidModelState>;
    editFlavor: Reducer<LiquidModelState>;
    setFlavor: Reducer<LiquidModelState>;
    removeFlavor: Reducer<LiquidModelState>;
  };
  effects: {
    calculateResults: Effect;
  };
}

const LiquidModel: LiquidModelType = {
  namespace: 'liquid',
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
            type: 'setResults',
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
      state.currentLiquid.flavors.push(payload);
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          flavors: state.currentLiquid.flavors,
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
