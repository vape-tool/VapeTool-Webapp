import { Reducer } from 'redux';

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
    setAwg(
      state,
      { payload },
    ): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        awg: payload,
        mm: (92.0 ** ((36.0 - payload) / 39.0)) * 0.127,
      };
    },
    setMm(
      state,
      { payload },
    ): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        mm: payload,
        awg: Math.log((92.0 ** 36) / ((payload / 0.127) ** 39.0)) / Math.log(92.0),
      };
    },
    setNominator(
      state,
      { payload },
    ): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        nominator: payload,
        inchMm: state && state.denominator ? (payload / state.denominator) / 0.039370 : 0,
      };
    },
    setDenominator(
      state,
      { payload },
    ): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        denominator: payload,
        inchMm: state && state.nominator ? (state.nominator / payload) / 0.039370 : 0,
      };
    },
    setCelsius(
      state,
      { payload },
    ): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        celsius: payload,
        fahrenheit: payload * (9.0 / 5.0) + 32.0,
      };
    },
    setFahrenheit(
      state,
      { payload },
    ): ConverterModelState {
      return {
        ...(state as ConverterModelState),
        fahrenheit: payload,
        celsius: (payload - 32.0) * (5.0 / 9.0),
      };
    },

    clear(state, { _ }): ConverterModelState {
      return {
        ...state,
        currentTab: 'awg',
      };
    },
  },
};

export default ConverterModel;
