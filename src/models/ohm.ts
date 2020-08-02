import { useState } from 'react';

type Inputs = 'voltage' | 'resistance' | 'current' | 'power';

export default () => {
  const [voltage, setVoltage] = useState<number | undefined>(undefined);
  const [resistance, setResistance] = useState<number | undefined>(undefined);
  const [current, setCurrent] = useState<number | undefined>(undefined);
  const [power, setPower] = useState<number | undefined>(undefined);
  const [latestEdit, setLatestEdit] = useState<Inputs | undefined>(undefined);
  const [lastEdit, setLastEdit] = useState<Inputs | undefined>(undefined);

  const onVoltageChange = (volts: number | string | undefined) => {
    if (!volts) throw new Error('Voltage is not defined');
    setVoltage(Number(volts));
    setLatestEdit(lastEdit !== 'voltage' ? lastEdit : latestEdit);
    setLastEdit('voltage');
  };
  const onResistanceChange = (ohms: number | string | undefined) => {
    if (!ohms) throw new Error('Resistance is not defined');
    setResistance(Number(ohms));
    setLatestEdit(lastEdit !== 'resistance' ? lastEdit : latestEdit);
    setLastEdit('resistance');
  };
  const onCurrentChange = (amps: number | string | undefined) => {
    setCurrent(Number(amps));
    setLatestEdit(lastEdit !== 'current' ? lastEdit : latestEdit);
    setLastEdit('current');
  };
  const onPowerChange = (watts: number | string | undefined) => {
    if (!watts) throw new Error('Power is not defined');
    setPower(Number(watts));
    setLatestEdit(lastEdit !== 'power' ? lastEdit : latestEdit);
    setLastEdit('power');
  };

  const clear = () => {
    setVoltage(undefined);
    setResistance(undefined);
    setCurrent(undefined);
    setPower(undefined);
  };
  const calculate = () => {
    const last = lastEdit;
    const latest = latestEdit;
    const factors = [last, latest];
    if (last && latest) {
      let lastValue;
      switch (lastEdit) {
        case 'voltage':
          lastValue = voltage;
          break;
        case 'current':
          lastValue = current;
          break;
        case 'power':
          lastValue = power;
          break;
        case 'resistance':
          lastValue = resistance;
          break;
        default:
          throw new Error('Could not retreive lastValue');
      }

      let latestValue;
      switch (latestEdit) {
        case 'voltage':
          latestValue = voltage;
          break;
        case 'current':
          latestValue = current;
          break;
        case 'power':
          latestValue = power;
          break;
        case 'resistance':
          latestValue = resistance;
          break;
        default:
          throw new Error('Could not retreive latest');
      }

      if (lastValue !== undefined && latestValue !== undefined) {
        if (factors.includes('voltage') && factors.includes('resistance')) {
          const [volts, ohms] =
            last === 'voltage' ? [lastValue, latestValue] : [latestValue, lastValue];
          setCurrent(volts / ohms);
          setPower(volts ** 2 / ohms);
        }
        if (factors.includes('voltage') && factors.includes('current')) {
          const [volts, amps] =
            last === 'voltage' ? [lastValue, latestValue] : [latestValue, lastValue];
          setResistance(volts / amps);
          setPower(volts * amps);
        }
        if (factors.includes('voltage') && factors.includes('power')) {
          const [volts, watts] =
            last === 'voltage' ? [lastValue, latestValue] : [latestValue, lastValue];
          setResistance(volts ** 2 / watts);
          setCurrent(watts * volts);
        }
        if (factors.includes('current') && factors.includes('resistance')) {
          const [amps, ohms] =
            last === 'current' ? [lastValue, latestValue] : [latestValue, lastValue];
          setVoltage(ohms * amps);
          setPower(amps ** 2 * ohms);
        }
        if (factors.includes('power') && factors.includes('resistance')) {
          const [watts, ohms] =
            last === 'power' ? [lastValue, latestValue] : [latestValue, lastValue];
          setVoltage(Math.sqrt(watts * ohms));
          setCurrent(Math.sqrt(watts / ohms));
        }
        if (factors.includes('power') && factors.includes('current')) {
          const [watts, amps] =
            last === 'power' ? [lastValue, latestValue] : [latestValue, lastValue];
          setVoltage(watts / amps);
          setResistance(watts / amps ** 2);
        }
      }
    }
  };

  return {
    voltage,
    resistance,
    power,
    current,
    lastEdit,
    latestEdit,
    onVoltageChange,
    onResistanceChange,
    onCurrentChange,
    onPowerChange,
    clear,
    calculate,
  };
};
