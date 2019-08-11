import { Reducer } from 'redux';
import { Effect } from 'dva';
import { Flavor, Liquid, Result } from '@vapetool/types';
import { calculateResults } from '@/services/liquid';

export interface LiquidModelState {
  currentLiquid: Liquid;
  results: Result[];
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

    setFlavor: Reducer<LiquidModelState>;
    removeFlavor: Reducer<LiquidModelState>;
    addFlavor: Reducer<LiquidModelState>;
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
  },
  effects: {
    * calculateResults({ payload }, { call, put, cancel }) {
      const response = yield call(calculateResults, payload);
      if (response instanceof Response) {
        cancel();
      } else if (response instanceof Array) {
        yield put({
          type: 'setResults',
          payload: response,
        });
      }
    },
  },
  reducers: {
    setBaseStrength(
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          baseStrength: payload,
        },
      };
    },
    setBaseRatio(
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          baseRatio: payload,
        },
      };
    },
    setThinner(
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          thinner: payload,
        },
      };
    },
    setAmount(
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          amount: payload,
        },
      };
    },
    setTargetStrength(
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          targetStrength: payload,
        },
      };
    },
    setTargetRatio(
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          targetRatio: payload,
        },
      };
    },
    setResults(
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      return {
        ...(state as LiquidModelState),
        results: payload,
      };
    },
    setLiquid(
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      return {
        ...state,
        currentLiquid: payload,
      };
    },

    addFlavor(
      state: LiquidModelState = {
        currentLiquid: new Liquid(),
        results: [],
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
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
      const newFlavors = state.currentLiquid.flavors.map((flavor: Flavor) =>
        flavor.uid === payload.uid ? payload : flavor,
      );
      return {
        ...state,
        currentLiquid: {
          ...state.currentLiquid,
          flavors: newFlavors,
        },
      };
    },
    removeFlavor(
      state = {
        currentLiquid: new Liquid(),
        results: [],
      },
      { payload },
    ): LiquidModelState {
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
