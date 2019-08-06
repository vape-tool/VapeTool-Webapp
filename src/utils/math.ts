import { Wire, WireKind } from '@vapetool/types';

export function getResistancePerMeter(wire: Wire): number {
  return wire.kind === WireKind.ROUND ?
    getResistancePerMeterRound(wire.material.resistivity, wire.mm)
    : getResistancePerMeterRibbon(wire.material.resistivity, wire.width, wire.height)
}

export function getResistancePerMeterRound(resistivity: number, diameter: number): number {
  return resistivity / (((diameter / 2) ** 2) * Math.PI);
}

export function getResistancePerMeterRibbon(resistivity: number,
                                            width: number,
                                            height: number): number {
  if (width === 0.0 || height === 0.0) return 0;
  return resistivity / (0.92 * width * height)
}

export function mmToAwg(mm: number): number {
  return Math.log((92.0 ** 36) / ((mm / 0.127) ** 39)) / Math.log(92.0)
}


export function awgToMm(awg: number): number {
  return 0.127 * (92.0 ** ((36.0 - awg) / 39.0))
}
