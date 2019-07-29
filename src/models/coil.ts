import { Reducer } from 'redux';

export interface CurrentCoil {
  setup: number;
}

export interface CoilModelState {
  currentCoil: CurrentCoil;
}

export interface CoilModelType {
  namespace: 'coil';
  state: CoilModelState;
  reducers: {
    setSetup: Reducer<CoilModelState>
  }
}

const CoilModel: CoilModelType = {
  namespace: 'coil',
  state: {
    currentCoil: {
      setup: 1,
    },
  },
  reducers: {
    setSetup(
      state = {
        currentCoil: {
          setup: 1,
        },
      },
      { payload }) {
      const mutated = {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          setup: payload,
        },
      };
      return mutated;
    },
  },
};

export default CoilModel;
