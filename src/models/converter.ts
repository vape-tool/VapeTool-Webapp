import { Reducer } from 'redux';
import { awgToMm, mmToAwg } from '@/utils/math';

export interface ConverterModelState {
  currentTab: 'awg' | 'inch' | 'temp';
  awg?: number;
  mm?: number;
  nominator?: number;
  denominator?: number;
  inchMm?: number;
  celsius?: number;
  fahrenheit?: number;
  lastEdit?: undefined | 'voltage' | 'resistance' | 'current' | 'power';
  latestEdit?: undefined | 'voltage' | 'resistance' | 'current' | 'power';
}

export interface ConverterModelType {
  namespace: string;
  state: ConverterModelState;
  reducers: {
    setTab: Reducer<ConverterModelState>;
    setAwg: Reducer<ConverterModelState>;
    setMm: Reducer<ConverterModelState>;
    setNominator: Reducer<ConverterModelState>;
    setDenominator: Reducer<ConverterModelState>;
    setCelsius: Reducer<ConverterModelState>;
    setFahrenheit: Reducer<ConverterModelState>;
    clear: Reducer<ConverterModelState>;
  };
}

const ConverterModel: ConverterModelType = {
  namespace: 'converter',
  state: {
    currentTab: 'awg',
  },
  reducers: {
    setTab(
      state = {
        currentTab: 'awg',
      },
      { payload },
    ): ConverterModelState {
      return {
        ...state,
        currentTab: payload,
      };
    },
    setAwg(state, { payload }): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        awg: payload,
        mm: awgToMm(payload),
      };
    },
    setMm(state, { payload }): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        mm: payload,
        awg: mmToAwg(payload),
      };
    },
    setNominator(state, { payload }): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        nominator: payload,
        inchMm:
          state && state.denominator && state.denominator !== 0
            ? payload / state.denominator / 0.03937
            : 0,
      };
    },
    setDenominator(state, { payload }): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        denominator: payload,
        inchMm: state && state.nominator && payload !== 0 ? state.nominator / payload / 0.03937 : 0,
      };
    },
    setCelsius(state, { payload }): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        celsius: payload,
        fahrenheit: payload * (9.0 / 5.0) + 32.0,
      };
    },
    setFahrenheit(state, { payload }): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        fahrenheit: payload,
        celsius: (payload - 32.0) * (5.0 / 9.0),
      };
    },

    clear(state): ConverterModelState {
      return {
        ...state,
        currentTab: 'awg',
      };
    },
  },
};

export default ConverterModel;
