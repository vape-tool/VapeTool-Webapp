import { Reducer } from 'redux';
import { Effect } from 'dva';
import { Flavor, Liquid, Result } from '@vapetool/types';
import { message } from 'antd';
import { calculateResults } from '@/services/liquid';
import { ConnectState } from '@/models/connect';

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
