import { Reducer } from 'redux';

export interface OhmModelState {
  voltage?: number;
  resistance?: number;
  current?: number;
  power?: number;
  lastEdit?: undefined | 'voltage' | 'resistance' | 'current' | 'power';
  latestEdit?: undefined | 'voltage' | 'resistance' | 'current' | 'power';
}

export interface OhmModelType {
  namespace: string;
  state: OhmModelState;
  reducers: {
    setVoltage: Reducer<OhmModelState>;
    setResistance: Reducer<OhmModelState>;
    setCurrent: Reducer<OhmModelState>;
    setPower: Reducer<OhmModelState>;
    clear: Reducer<OhmModelState>;
  };
}

const OhmModel: OhmModelType = {
  namespace: 'ohm',
  state: {
    voltage: undefined,
    resistance: undefined,
    current: undefined,
    power: undefined,
    lastEdit: undefined,
    latestEdit: undefined,
  },
  reducers: {
    setVoltage(
      state = {
        voltage: undefined,
        resistance: undefined,
        current: undefined,
        power: undefined,
        lastEdit: undefined,
        latestEdit: undefined,
      },
      { payload },
    ): OhmModelState {
      return {
        ...state,
        voltage: payload,
        latestEdit: state.lastEdit,
        lastEdit: 'voltage',
      };
    },
    setResistance(
      state = {
        voltage: undefined,
        resistance: undefined,
        current: undefined,
        power: undefined,
        lastEdit: undefined,
        latestEdit: undefined,
      },
      { payload },
    ): OhmModelState {
      return {
        ...state,
        resistance: payload,
        latestEdit: state.lastEdit,
        lastEdit: 'resistance',
      };
    },
    setCurrent(
      state = {
        voltage: undefined,
        resistance: undefined,
        current: undefined,
        power: undefined,
        lastEdit: undefined,
        latestEdit: undefined,
      },
      { payload },
    ): OhmModelState {
      return {
        ...state,
        current: payload,
        latestEdit: state.lastEdit,
        lastEdit: 'current',
      };
    },
    setPower(
      state = {
        voltage: undefined,
        resistance: undefined,
        current: undefined,
        power: undefined,
        lastEdit: undefined,
        latestEdit: undefined,
      },
      { payload },
    ): OhmModelState {
      return {
        ...state,
        power: payload,
        latestEdit: state.lastEdit,
        lastEdit: 'power',
      };
    },
    clear(state, payload): OhmModelState {
      return {
        voltage: undefined,
        resistance: undefined,
        current: undefined,
        power: undefined,
        lastEdit: undefined,
        latestEdit: undefined,
      };
    },
  },
};

export default OhmModel;
