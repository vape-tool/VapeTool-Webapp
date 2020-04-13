import { Dispatch, Reducer } from 'redux';
import { Effect } from 'dva';
import { Coil, Properties, Wire, wireGenerator, WireStyle } from '@vapetool/types';
import { message } from 'antd';
import { calculateForResistance, calculateForWraps, calculateProperties } from '@/services/coil';
import { ConnectState } from '@/models/connect';

export const COIL = 'coil';
export const SET_SETUP = 'setSetup';
export const SET_INNER_DIAMETER = 'setInnerDiameter';
export const SET_COIL = 'setCoil';
export const SET_LEGS_LENGTH = 'setLegsLength';
export const SET_RESISTANCE = 'setResistance';
export const SET_WRAPS = 'setWraps';
export const SET_VOLTAGE = 'setVoltage';
export const SET_PROPERTIES = 'setProperties';
export const SET_TYPE = 'setType';
export const SET_WIRE = 'setWire';
export const DELETE_WIRE = 'deleteWire';
export const ADD_WIRE = 'addWire';

export const CALCULATE_FOR_RESISTANCE = 'calculateForResistance';
export const CALCULATE_FOR_WRAPS = 'calculateForWraps';
export const CALCULATE_PROPERTIES = 'calculateProperties';

export function dispatchSetCoilType(dispatch: Dispatch, wireType: string, paths: Path[]) {
  dispatch({
    type: `${COIL}/${SET_TYPE}`,
    payload: { type: wireType, paths },
  });
}

export function dispatchAddWire(dispatch: Dispatch, path: Path[], wire: Wire) {
  dispatch({
    type: `${COIL}/${ADD_WIRE}`,
    payload: { paths: path, wire },
  });
}

export function dispatchDeleteWire(dispatch: Dispatch, paths: Path[]) {
  dispatch({
    type: `${COIL}/${DELETE_WIRE}`,
    paths,
  });
}

export function dispatchSetWire(dispatch: Dispatch, paths: Path[], wire: Wire) {
  dispatch({
    type: `${COIL}/${SET_WIRE}`,
    payload: { paths, wire },
  });
}

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
    [SET_SETUP]: Reducer<CoilModelState>;
    [SET_INNER_DIAMETER]: Reducer<CoilModelState>;
    [SET_COIL]: Reducer<CoilModelState>;
    [SET_LEGS_LENGTH]: Reducer<CoilModelState>;
    [SET_RESISTANCE]: Reducer<CoilModelState>;
    [SET_WRAPS]: Reducer<CoilModelState>;
    [SET_VOLTAGE]: Reducer<CoilModelState>;
    [SET_PROPERTIES]: Reducer<CoilModelState>;
    [SET_TYPE]: Reducer<CoilModelState>;
    [SET_WIRE]: Reducer<CoilModelState>;
    [DELETE_WIRE]: Reducer<CoilModelState>;
    [ADD_WIRE]: Reducer<CoilModelState>;
  };
  effects: {
    [CALCULATE_FOR_RESISTANCE]: Effect;
    [CALCULATE_FOR_WRAPS]: Effect;
    [CALCULATE_PROPERTIES]: Effect;
  };
}

const initialState: CoilModelState = {
  currentCoil: wireGenerator.claptonCoil(),
  baseVoltage: 3.7,
};

function* calculateEffect(call, coil, cancel, put, method) {
  try {
    const response = yield call(method, coil);
    if (response instanceof Response) {
      cancel();
    } else if (response instanceof Object) {
      yield put({
        type: SET_COIL,
        payload: response,
      });
      yield put({ type: CALCULATE_PROPERTIES, coil });
    }
  } catch (e) {
    message.error(e.message);
  }
}

const CoilModel: CoilModelType = {
  namespace: COIL,
  state: initialState,
  effects: {
    *[CALCULATE_FOR_RESISTANCE]({ coil }, { call, put, cancel }) {
      yield* calculateEffect(call, coil, cancel, put, calculateForResistance);
    },
    *[CALCULATE_FOR_WRAPS]({ coil }, { call, put, cancel }) {
      yield* calculateEffect(call, coil, cancel, put, calculateForWraps);
    },
    *[CALCULATE_PROPERTIES]({ coil }, { call, put, cancel, select }) {
      try {
        const baseVoltage = yield select((state: ConnectState) => state.coil.baseVoltage);
        const response = yield call(calculateProperties, coil, baseVoltage);
        if (response instanceof Response) {
          cancel();
        } else if (response instanceof Object) {
          yield put({
            type: SET_PROPERTIES,
            payload: response,
          });
        }
      } catch (e) {
        message.error(e.message);
      }
    },
  },
  reducers: {
    [SET_SETUP](state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          setup: payload,
        },
      };
    },
    [SET_INNER_DIAMETER](state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          innerDiameter: payload,
        },
      };
    },
    [SET_COIL](state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          ...payload,
        },
      };
    },
    [SET_LEGS_LENGTH](state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          legsLength: payload,
        },
      };
    },
    [SET_RESISTANCE](state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          resistance: payload,
        },
      };
    },
    [SET_WRAPS](state = initialState, { payload }) {
      return {
        ...state,
        currentCoil: {
          ...state.currentCoil,
          wraps: payload,
        },
      };
    },
    [SET_VOLTAGE](state = initialState, { payload }) {
      return {
        ...state,
        baseVoltage: payload,
      };
    },
    [SET_PROPERTIES](state = initialState, { payload }) {
      return {
        ...state,
        properties: payload,
      };
    },
    [SET_TYPE](state = initialState, { payload: { paths, type } }) {
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
