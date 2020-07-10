import { identity, nanToUndefined, safeConvert } from '@/utils/utils';
import { useState } from 'react';

const INCHES_TO_MM_FACTOR = 0.03937;

export default () => {
  const [inch, setInch] = useState<number | undefined>(undefined);
  const [mm, setMm] = useState<number | undefined>(undefined);
  const [nominator, setNominator] = useState<number | undefined>(undefined);
  const [denominator, setDenominator] = useState<number | undefined>(undefined);

  const reduceNominator = (nominatorStr: string) => {
    const newNominator = nanToUndefined(nominatorStr);
    const newDenominator = denominator ? Number(denominator) : undefined;
    const newInch = newNominator && newDenominator ? newNominator / newDenominator : undefined;

    setNominator(newNominator);
    setDenominator(newDenominator);
    setInch(safeConvert(identity, [newInch], 4));
    setMm(safeConvert(([_inch]) => _inch / INCHES_TO_MM_FACTOR, [newInch], 3));
  };

  const reduceDenominator = (denominatorStr: string) => {
    const newDenominator = nanToUndefined(denominatorStr);
    const newNominator = nominator ? Number(nominator) : undefined;
    const newInch = newNominator && newDenominator ? newNominator / newDenominator : undefined;

    setNominator(newNominator);
    setDenominator(newDenominator);
    setInch(safeConvert(identity, [newInch], 4));
    setMm(safeConvert(([_inch]) => _inch / INCHES_TO_MM_FACTOR, [newInch], 3));
  };

  const reduceInch = (inchStr: string) => {
    const newInch = nanToUndefined(inchStr);
    setInch(newInch);
    setNominator(undefined);
    setDenominator(undefined);
    setMm(safeConvert(([_inch]) => _inch / INCHES_TO_MM_FACTOR, [newInch], 3));
  };

  const reduceMm = (mmStr: string) => {
    const newMm = nanToUndefined(mmStr);
    setNominator(undefined);
    setDenominator(undefined);
    setInch(safeConvert(([_mm]) => _mm * INCHES_TO_MM_FACTOR, [newMm], 4));
    setMm(newMm);
  };
  return {
    mm,
    setMm: reduceMm,
    inch,
    setInch: reduceInch,
    nominator,
    setNominator: reduceNominator,
    denominator,
    setDenominator: reduceDenominator,
  };
};
