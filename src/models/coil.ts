import { Reducer } from 'redux';
import { Effect } from 'dva';
import { Coil, Properties, Wire, wireGenerator, WireStyle } from '@vapetool/types';
import { message } from 'antd';
import { calculateForResistance, calculateForWraps, calculateProperties } from '@/services/coil';
import { ConnectState } from '@/models/connect';

export interface Path {
  style: WireStyle;
  index: number;
}

export interface CoilModelState {
  currentCoil: Coil;
  properties?: Properties;
  baseVoltage: number;
}

export interface CoilModelType {
  namespace: string;
  state: CoilModelState;
  reducers: {
    setSetup: Reducer<CoilModelState>;
    setInnerDiameter: Reducer<CoilModelState>;
    setCoil: Reducer<CoilModelState>;
    setLegsLength: Reducer<CoilModelState>;
    setResistance: Reducer<CoilModelState>;
    setWraps: Reducer<CoilModelState>;
    setProperties: Reducer<CoilModelState>;
    setType: Reducer<CoilModelState>;
    setWire: Reducer<CoilModelState>;
    deleteWire: Reducer<CoilModelState>;
    addWire: Reducer<CoilModelState>;
  };
  effects: {
    calculateForResistance: Effect;
    calculateForWraps: Effect;
    calculateProperties: Effect;
  };
}

const initialState: CoilModelState = {
  currentCoil: wireGenerator.claptonCoil(),
  baseVoltage: 3.7,
};

const CoilModel: CoilModelType = {
  namespace: 'coil',
  state: initialState,
  effects: {
    *calculateForResistance({ coil }, { call, put, cancel }) {
      try {
        const response = yield call(calculateForResistance, coil);
        if (response instanceof Response) {
          cancel();
        } else if (response instanceof Object) {
          yield put({
            type: 'setCoil',
            payload: response,
          });
          yield put({ type: 'calculateProperties', coil });
        }
      } catch (e) {
        message.error(e.message);
      }
    },
    *calculateForWraps({ coil }, { call, put, cancel }) {
      try {
        const response = yield call(calculateForWraps, coil);
        if (response instanceof Response) {
          cancel();
        } else if (response instanceof Object) {
          yield put({
            type: 'setCoil',
            payload: response,
          });
          yield put({ type: 'calculateProperties', coil });
        }
      } catch (e) {
        message.error(e.message);
      }
    },
    *calculateProperties({ coil }, { call, put, cancel, select }) {
      try {
        const baseVoltage = yield select((state: ConnectState) => state.coil.baseVoltage);
        const response = yield call(calculateProperties, coil, baseVoltage);
        if (response instanceof Response) {
          cancel();
        } else if (response instanceof Object) {
          yield put({
            type: 'setProperties',
            properties: response,
          });
        }
      } catch (e) {
        message.error(e.message);
      }
    },
  },
  reducers: {
    setSetup(state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          setup: payload,
        },
      };
    },
    setInnerDiameter(state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          innerDiameter: payload,
        },
      };
    },
    setCoil(state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          ...payload,
        },
      };
    },
    setLegsLength(state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          legsLength: payload,
        },
      };
    },
    setResistance(state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          resistance: payload,
        },
      };
    },
    setWraps(state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          wraps: payload,
        },
      };
    },
    setProperties(state = initialState, { properties }) {
      return {
        ...state,
        properties,
      };
    },
    setType(state = initialState, { payload: { paths, type } }) {
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
      return newState;
    },
    setWire(state = initialState, { payload: { wire, paths } }) {
      const newState = {
        ...state,
        currentCoil: {
          ...state.currentCoil,
        },
      };
      modifyWireOnPath(newState.currentCoil, wire, paths);

      return newState;
    },
    deleteWire(state = initialState, { paths }) {
      const newState = {
        ...state,
        currentCoil: {
          ...state.currentCoil,
        },
      };
      deleteWireOnPath(newState.currentCoil, paths);

      return newState;
    },
    addWire(state = initialState, { payload: { wire, paths } }) {
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
        wire.cores.splice(path.index, 1);
      } else {
        wire.outers.splice(path.index, 1);
      }
    }
    if (path.style === WireStyle.CORE) {
      deleteWireOnPath(wire.cores[path.index], paths);
    } else {
      deleteWireOnPath(wire.outers[path.index], paths);
    }
  }
}

function addWireOnPath(wire: Coil | Wire, newWire: Wire, paths: Path[]) {
  const path = paths.shift();
  if (path === undefined) {
    wire.cores.push(newWire);
  } else {
    addWireOnPath(wire.cores[path.index], newWire, paths);
  }
}

function modifyWireOnPath(wire: Coil | Wire, newWire: Wire, paths: Path[]) {
  const path = paths.shift();
  if (path !== undefined) {
    if (path.style === WireStyle.CORE) {
      modifyWireOnPath(wire.cores[path.index], newWire, paths);
    } else {
      modifyWireOnPath(wire.outers[path.index], newWire, paths);
    }
  } else {
    Object.assign(wire, newWire);
  }
}

export default CoilModel;
