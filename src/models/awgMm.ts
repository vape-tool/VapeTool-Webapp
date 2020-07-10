import * as math from '@/utils/math';
import { useState } from "react";
import { nanToUndefined, safeConvert } from "@/utils/utils";

const precision = 3;

export default () => {
  const [awg, setAwg] = useState<number | undefined>(undefined);
  const [mm, setMm] = useState<number | undefined>(undefined);

  const reduceAwg = (awgStr: string) => {
    const newAwg = nanToUndefined(awgStr);
    setAwg(newAwg);
    setMm(safeConvert(([_awg]) => math.awgToMm(_awg), [newAwg], precision));
  };

  const reduceMm = (mmStr: string) => {
    const newMm = nanToUndefined(mmStr);
    setMm(newMm);
    setAwg(safeConvert(([_mm]) => math.mmToAwg(_mm), [newMm]));
  };
  return {
    awg,
    setAwg: reduceAwg,
    mm,
    setMm: reduceMm,
  };
}