import { Reducer } from 'redux';
import { Effect } from 'dva';
import { Coil, Wire, wireGenerator, WireStyle } from '@vapetool/types';
import { calculateForResistance, calculateForWraps, getSweetSpot } from '@/services/coil';

export interface Path {
  style: WireStyle;
  index: number;
}

export interface CoilModelState {
  currentCoil: Coil;
}

export interface CoilModelType {
  namespace: 'coil';
  state: CoilModelState;
  reducers: {
    setSetup: Reducer<CoilModelState>
    setInnerDiameter: Reducer<CoilModelState>
    setCoil: Reducer<CoilModelState>
    setLegsLength: Reducer<CoilModelState>
    setResistance: Reducer<CoilModelState>
    setWraps: Reducer<CoilModelState>
    setType: Reducer<CoilModelState>
    setWire: Reducer<CoilModelState>
    deleteWire: Reducer<CoilModelState>
    addWire: Reducer<CoilModelState>
  },
  effects: {
    calculateForResistance: Effect,
    calculateForWraps: Effect,
    getSweetSpot: Effect,
  }
}

const CoilModel: CoilModelType = {
  namespace: 'coil',
  state: {
    currentCoil: wireGenerator.normalCoil(),
  },
  effects: {
    * calculateForResistance({ payload }, { call, put, cancel }) {
      const response = yield call(calculateForResistance, payload);
      if (response instanceof Response) {
        cancel()
      } else if (response instanceof Object) {
        yield put({
          type: 'setCoil',
          payload: response,
        });
      }
    },
    * calculateForWraps({ payload }, { call, put, cancel }) {
      const response = yield call(calculateForWraps, payload);
      if (response instanceof Response) {
        cancel()
      } else if (response instanceof Object) {
        yield put({
          type: 'setCoil',
          payload: response,
        });
      }
    },
    * getSweetSpot(_, { call, put, cancel }) {
      const response = yield call(getSweetSpot);
      if (response instanceof Response) {
        cancel()
      } else if (response instanceof Object) {
        yield put({
          type: 'setSweetSpot',
          payload: response,
        });
      }
    },
  },
  reducers: {
    setSetup(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      },
      { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          setup: payload,
        },
      };
    },
    setInnerDiameter(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      },
      { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          innerDiameter: payload,
        },
      };
    },
    setCoil(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      },
      { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          ...payload,
        },
      };
    },
    setLegsLength(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      },
      { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          legsLength: payload,
        },
      };
    },
    setResistance(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      },
      { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          resistance: payload,
        },
      };
    },
    setWraps(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      },
      { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          wraps: payload,
        },
      };
    },
    setType(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      },
      { payload: { paths, type } }) {
      console.dir(paths);
      console.log(type);
      if (paths.length > 0) {
        const newCoil = wireGenerator.coilOfType(type);
        return {
          ...state,
          currentCoil: newCoil,
        };
      }
      const newWire: Wire = new Wire({ ...wireGenerator.coilOfType(type) });
      const newState = {
        ...state,
        currentCoil: {
          ...state.currentCoil,
        },
      };
      modifyWireOnPath(newState.currentCoil, newWire, paths);
      console.dir(newState);
      return newState
    },
    setWire(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      }, { payload: { wire, paths } }) {
      const newState = {
        ...state,
        currentCoil: {
          ...state.currentCoil,
        },
      };
      modifyWireOnPath(newState.currentCoil, wire, paths);

      return newState;
    },
    deleteWire(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      },
      { paths }) {
      const newState = {
        ...state,
        currentCoil: {
          ...state.currentCoil,
        },
      };
      deleteWireOnPath(newState.currentCoil, paths);

      return newState;
    },
    addWire(
      state = {
        currentCoil: wireGenerator.normalCoil(),
      },
      { payload: { wire, paths } }) {
      const newState = {
        ...state,
        currentCoil: {
          ...state.currentCoil,
        },
      };
      console.log('Paths for new wire');
      console.dir(paths);

      addWireOnPath(newState.currentCoil, wire, paths);
      console.dir(newState);

      return newState;
    },

  },
};

function deleteWireOnPath(wire: Coil | Wire, paths: Path[]) {
  const path = paths.shift();
  const isLast = paths.length === 0;
  if (path !== undefined) {
    if (isLast) {
      if (path.style === WireStyle.CORE) {
        wire.cores.splice(path.index, 1)
      } else {
        wire.outers.splice(path.index, 1)
      }
    }
    if (path.style === WireStyle.CORE) {
      deleteWireOnPath(wire.cores[path.index], paths)
    } else {
      deleteWireOnPath(wire.outers[path.index], paths)
    }
  }
}

function addWireOnPath(wire: Coil | Wire, newWire: Wire, paths: Path[]) {
  const path = paths.shift();
  if (path === undefined) {
    wire.cores.push(newWire)
  } else {
    addWireOnPath(wire.cores[path.index], newWire, paths)
  }
}

function modifyWireOnPath(wire: Coil | Wire, newWire: Wire, paths: Path[]) {
  const path = paths.shift();
  if (path !== undefined) {
    if (path.style === WireStyle.CORE) {
      modifyWireOnPath(wire.cores[path.index], newWire, paths)
    } else {
      modifyWireOnPath(wire.outers[path.index], newWire, paths)
    }
  } else {
    Object.assign(wire, newWire);
  }
}

export default CoilModel;
