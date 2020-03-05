import { Dispatch, Reducer } from 'redux';
import { awgToMm, celsiusToFahrenheit, fahrenheitToCelsius, mmToAwg } from '@/utils/math';
import { identity, nanToUndefined, safeConvert } from '@/utils/utils';

export const CONVERTER = 'converter';

export const AWG_TO_MM = 'awgToMm';
export const INCH_TO_MM = 'inchesToMm';
export const TEMPERATURE = 'temperature';

export const SET_AWG_IN_AWG_TO_MM = 'setAwgInAwgToMm';
export const SET_MM_IN_AWG_TO_MM = 'setMmInAwgToMm';
export const SET_NOMINATOR_IN_INCH_TO_MM = 'setNominatorInInchToMm';
export const SET_DENOMINATOR_IN_INCH_TO_MM = 'setDenominatorInInchToMm';
export const SET_INCH_IN_INCH_TO_MM = 'setInchInInchToMm';
export const SET_MM_IN_INCH_TO_MM = 'setMmInInchToMm';
export const SET_CELSIUS_IN_TEMPERATURE = 'setCelsiusInTemperature';
export const SET_FAHRENHEIT_IN_TEMPERATURE = 'setFahrenheitInTemperature';

export const dispatchChangeValue = (dispatch: Dispatch, type: string) => (value?: number) => {
  dispatch({
    type: `${CONVERTER}/${type}`,
    payload: value,
  });
};

export interface ConverterModelState {
  [AWG_TO_MM]: {
    awg?: number;
    mm?: number;
  };
  [INCH_TO_MM]: {
    nominator?: number;
    denominator?: number;
    inch?: number;
    mm?: number;
  };
  [TEMPERATURE]: {
    celsius?: number;
    fahrenheit?: number;
  };
  lastEdit?: undefined | 'voltage' | 'resistance' | 'current' | 'power';
  latestEdit?: undefined | 'voltage' | 'resistance' | 'current' | 'power';
}

export interface ConverterModelType {
  namespace: string;
  state: ConverterModelState;
  reducers: {
    [SET_AWG_IN_AWG_TO_MM]: Reducer<ConverterModelState>;
    [SET_MM_IN_AWG_TO_MM]: Reducer<ConverterModelState>;

    [SET_NOMINATOR_IN_INCH_TO_MM]: Reducer<ConverterModelState>;
    [SET_DENOMINATOR_IN_INCH_TO_MM]: Reducer<ConverterModelState>;
    [SET_INCH_IN_INCH_TO_MM]: Reducer<ConverterModelState>;
    [SET_MM_IN_INCH_TO_MM]: Reducer<ConverterModelState>;

    [SET_CELSIUS_IN_TEMPERATURE]: Reducer<ConverterModelState>;
    [SET_FAHRENHEIT_IN_TEMPERATURE]: Reducer<ConverterModelState>;
  };
}

const INCHES_TO_MM_FACTOR = 0.03937;
const ConverterModel: ConverterModelType = {
  namespace: 'converter',
  state: {
    [AWG_TO_MM]: {},
    [INCH_TO_MM]: {},
    [TEMPERATURE]: {},
  },
  reducers: {
    setAwgInAwgToMm(state, { payload: awgStr }): ConverterModelState {
      const awg = nanToUndefined(awgStr);

      return {
        ...(state as ConverterModelState),
        [AWG_TO_MM]: {
          awg,
          mm: safeConvert(([_awg]) => awgToMm(_awg), [awg], 3),
        },
      };
    },
    setMmInAwgToMm(state, { payload: mmStr }): ConverterModelState {
      const mm = nanToUndefined(mmStr);

      return {
        ...(state as ConverterModelState),
        [AWG_TO_MM]: {
          awg: safeConvert(([_mm]) => mmToAwg(_mm), [mm]),
          mm,
        },
      };
    },

    setNominatorInInchToMm(state, { payload: nominatorStr }): ConverterModelState {
      const nominator = nanToUndefined(nominatorStr);
      const denominator =
        state && state[INCH_TO_MM].denominator ? Number(state[INCH_TO_MM].denominator) : undefined;
      const inch = nominator && denominator ? nominator / denominator : undefined;

      return {
        ...(state as ConverterModelState),
        [INCH_TO_MM]: {
          nominator,
          denominator,
          inch: safeConvert(identity, [inch], 4),
          mm: safeConvert(([_inch]) => _inch / INCHES_TO_MM_FACTOR, [inch], 3),
        },
      };
    },
    setDenominatorInInchToMm(state, { payload: denominatorStr }): ConverterModelState {
      const denominator = nanToUndefined(denominatorStr);
      const nominator =
        state && state[INCH_TO_MM].nominator ? Number(state[INCH_TO_MM].nominator) : undefined;
      const inch = nominator && denominator ? nominator / denominator : undefined;

      return {
        ...(state as ConverterModelState),
        [INCH_TO_MM]: {
          nominator,
          denominator,
          inch: safeConvert(identity, [inch], 4),
          mm: safeConvert(([_inch]) => _inch / INCHES_TO_MM_FACTOR, [inch], 3),
        },
      };
    },
    setInchInInchToMm(state, { payload: inchStr }): ConverterModelState {
      const inch = nanToUndefined(inchStr);

      return {
        ...(state as ConverterModelState),
        [INCH_TO_MM]: {
          nominator: undefined,
          denominator: undefined,
          inch,
          mm: safeConvert(([_inch]) => _inch / INCHES_TO_MM_FACTOR, [inch], 3),
        },
      };
    },
    setMmInInchToMm(state, { payload: mmStr }): ConverterModelState {
      const mm = nanToUndefined(mmStr);

      return {
        ...(state as ConverterModelState),
        [INCH_TO_MM]: {
          nominator: undefined,
          denominator: undefined,
          inch: safeConvert(([_mm]) => _mm * INCHES_TO_MM_FACTOR, [mm], 4),
          mm,
        },
      };
    },

    setCelsiusInTemperature(state, { payload: celsiusStr }): ConverterModelState {
      const celsius = nanToUndefined(celsiusStr);

      return {
        ...(state as ConverterModelState),
        [TEMPERATURE]: {
          celsius,
          fahrenheit: safeConvert(([_celsius]) => celsiusToFahrenheit(_celsius), [celsius], 1),
        },
      };
    },
    setFahrenheitInTemperature(state, { payload: fahrenheitStr }): ConverterModelState {
      const fahrenheit = nanToUndefined(fahrenheitStr);

      return {
        ...(state as ConverterModelState),
        [TEMPERATURE]: {
          fahrenheit,
          celsius: safeConvert(
            ([_fahrenheit]) => fahrenheitToCelsius(_fahrenheit),
            [fahrenheit],
            2,
          ),
        },
      };
    },
  },
};

export default ConverterModel;
