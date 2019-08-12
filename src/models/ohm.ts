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
    calculate: Reducer<OhmModelState>;
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
        latestEdit: state.lastEdit !== 'voltage' ? state.lastEdit : state.latestEdit,
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
        latestEdit: state.lastEdit !== 'resistance' ? state.lastEdit : state.latestEdit,
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
      const newState = {
        ...state,
        current: payload,
        latestEdit: state.lastEdit !== 'current' ? state.lastEdit : state.latestEdit,
        lastEdit: 'current',
      };
      console.log(newState);
      return newState;
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
        latestEdit: state.lastEdit !== 'power' ? state.lastEdit : state.latestEdit,
        lastEdit: 'power',
      };
    },
    calculate(state = {
      voltage: undefined,
      resistance: undefined,
      current: undefined,
      power: undefined,
      lastEdit: undefined,
      latestEdit: undefined,
    }, { payload }): OhmModelState {
      const last = state.lastEdit;
      const latest = state.latestEdit;
      const factors = [last, latest];
      console.log(last);
      console.log(latest);
      if (last && latest) {

        const lastValue = state[last];
        const latestValue = state[latest];
        console.log(lastValue);
        console.log(latestValue);

        if (lastValue !== undefined && latestValue !== undefined) {
          if ('voltage' in factors && 'resistance' in factors) {
            const [voltage, resistance] = last === 'voltage' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              current: voltage / resistance,
              power: (voltage ** 2) / resistance,
            };
          }
          if ('voltage' in factors && 'current' in factors) {
            const [voltage, current] = last === 'voltage' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              resistance: voltage / current,
              power: voltage * current,
            };
          }
          if ('voltage' in factors && 'power' in factors) {
            const [voltage, power] = last === 'voltage' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              resistance: (voltage ** 2) / power,
              current: power * voltage,
            };
          }
          if ('current' in factors && 'resistance' in factors) {
            const [current, resistance] = last === 'current' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              voltage: resistance * current,
              power: (current ** 2) * resistance,
            };
          }
          if ('power' in factors && 'resistance' in factors) {
            const [power, resistance] = last === 'power' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              voltage: Math.sqrt(power * resistance),
              current: Math.sqrt(power / resistance),
            };
          }
          if ('power' in factors && 'current' in factors) {
            const [power, current] = last === 'power' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              voltage: power / current,
              resistance: power / (current ** 2),
            };
          }
        }
      }
      return state;
    },
    clear(state, { payload }): OhmModelState {
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
