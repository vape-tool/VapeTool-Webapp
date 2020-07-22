import * as math from '@/utils/math';
import { useState } from 'react';
import { nanToUndefined, safeConvert } from '@/utils/utils';
import { message } from 'antd';

export default () => {
  const [celsius, setCelsius] = useState<number | undefined>(undefined);
  const [fahrenheit, setFahrenheit] = useState<number | undefined>(undefined);

  function reduceCelsius(celsiusStr: string | number | undefined) {
    if (!celsiusStr) {
      message.error('Celsius is not defined');
      return;
    }
    const newCelsius = nanToUndefined(celsiusStr);
    setCelsius(newCelsius);
    setFahrenheit(safeConvert(([_celsius]) => math.celsiusToFahrenheit(_celsius), [newCelsius], 1));
  }

  function reduceFahrenheit(fahrenheitStr: string | number | undefined) {
    if (!fahrenheitStr) {
      message.error('Fahrenheit is not defined');
      return;
    }
    const newFahrenheit = nanToUndefined(fahrenheitStr);
    setFahrenheit(newFahrenheit);
    setCelsius(
      safeConvert(([_fahrenheit]) => math.fahrenheitToCelsius(_fahrenheit), [newFahrenheit], 2),
    );
  }
  return {
    celsius,
    setCelsius: reduceCelsius,
    fahrenheit,
    setFahrenheit: reduceFahrenheit,
  };
};
