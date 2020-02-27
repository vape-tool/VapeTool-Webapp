import { Dispatch, Reducer } from 'redux';

export const OHM = 'ohm';
export const SET_VOLTAGE = 'setVoltage';
export const SET_RESISTANCE = 'setResistance';
export const SET_CURRENT = 'setCurrent';
export const SET_POWER = 'setPower';
export const CALCULATE = 'calculate';
export const CLEAR = 'clear';

export const onChange = (dispatch: Dispatch, action: string) => (value?: number) => {
  dispatch({
    type: `${OHM}/${action}`,
    payload: value,
  });
};

export const clear = (dispatch: Dispatch) => {
  dispatch({
    type: `${OHM}/${CLEAR}`,
  });
};
export const calculate = (dispatch: Dispatch) => {
  dispatch({
    type: `${OHM}/${CALCULATE}`,
  });
};

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
    [SET_VOLTAGE]: Reducer<OhmModelState>;
    [SET_RESISTANCE]: Reducer<OhmModelState>;
    [SET_CURRENT]: Reducer<OhmModelState>;
    [SET_POWER]: Reducer<OhmModelState>;
    [CALCULATE]: Reducer<OhmModelState>;
    [CLEAR]: Reducer<OhmModelState>;
  };
}

const OhmModel: OhmModelType = {
  namespace: OHM,
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
      return {
        ...state,
        current: payload,
        latestEdit: state.lastEdit !== 'current' ? state.lastEdit : state.latestEdit,
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
        latestEdit: state.lastEdit !== 'power' ? state.lastEdit : state.latestEdit,
        lastEdit: 'power',
      };
    },
    calculate(
      state = {
        voltage: undefined,
        resistance: undefined,
        current: undefined,
        power: undefined,
        lastEdit: undefined,
        latestEdit: undefined,
      },
    ): OhmModelState {
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
          if (factors.includes('voltage') && factors.includes('resistance')) {
            const [voltage, resistance] =
              last === 'voltage' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              current: voltage / resistance,
              power: voltage ** 2 / resistance,
            };
          }
          if (factors.includes('voltage') && factors.includes('current')) {
            const [voltage, current] =
              last === 'voltage' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              resistance: voltage / current,
              power: voltage * current,
            };
          }
          if (factors.includes('voltage') && factors.includes('power')) {
            const [voltage, power] =
              last === 'voltage' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              resistance: voltage ** 2 / power,
              current: power * voltage,
            };
          }
          if (factors.includes('current') && factors.includes('resistance')) {
            const [current, resistance] =
              last === 'current' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              voltage: resistance * current,
              power: current ** 2 * resistance,
            };
          }
          if (factors.includes('power') && factors.includes('resistance')) {
            const [power, resistance] =
              last === 'power' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              voltage: Math.sqrt(power * resistance),
              current: Math.sqrt(power / resistance),
            };
          }
          if (factors.includes('power') && factors.includes('current')) {
            const [power, current] =
              last === 'power' ? [lastValue, latestValue] : [latestValue, lastValue];
            return {
              ...state,
              voltage: power / current,
              resistance: power / current ** 2,
            };
          }
        }
      }
      return state;
    },
    clear(): OhmModelState {
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
