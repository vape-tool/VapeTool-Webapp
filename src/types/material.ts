export class Material {
  id: string;

  name: string;

  resistivity: number;

  diameter: number;

  tcr: number;

  constructor(id: string, name: string, resistivity: number, diameter: number, tcr: number) {
    this.id = id;
    this.name = name;
    this.resistivity = resistivity;
    this.diameter = diameter;
    this.tcr = tcr;
  }
}

export const KANTHAL_A1_AMP = new Material('0', 'Kanthal A1/AMP', 1.45298, 0.0, 0.0);
export const KANTHAL_A_AE_AF = new Material('1', 'Kanthal A/AE/AF', 1.39015, 0.0, 0.0);
export const KANTHAL_D = new Material('2', 'Kanthal D', 1.35214, 0.0, 0.0);
export const NICHROME_N20 = new Material('3', 'Nichrome N20', 0.95, 0.0, 0.0);
export const NICHROME_N40 = new Material('4', 'Nichrome N40', 1.04, 0.0, 0.0);
export const NICHROME_N60 = new Material('5', 'Nichrome N60', 1.11, 0.0, 0.0);
export const NICHROME_N70 = new Material('6', 'Nichrome N70', 1.18, 0.0, 0.0);
export const NICHROME_N80 = new Material('7', 'Nichrome N80', 1.09, 0.0, 0.0);
export const NICHROME_N90 = new Material('26', 'Nichrome N90', 0.68, 0.0, 0.0);
export const NICKEL_NI200 = new Material('8', 'Nickel Ni200', 0.096304, 0.0, 0.0);
export const NICKEL_DH = new Material('24', 'Nickel DH', 0.089830, 0.0, 0.0);
export const TITANIUM_TI = new Material('9', 'Titanium Ti', 0.4701929, 0.0, 0.0);
export const TITANIUM_TI_R504 = new Material('20', 'Titanium Ti (R504)', 0.5600232, 0.0, 0.0);
export const SS_304_V2A = new Material('12', 'SS 304 (V2A)', 0.715405395, 0.0, 0.0);
export const SS_316_V4A = new Material('10', 'SS 316 (V4A)', 0.771245, 0.0, 0.0);
export const SS_316L = new Material('21', 'SS 316L ', 0.750204, 0.0, 0.0);
export const SS_317L = new Material('11', 'SS 317L', 0.81009, 0.0, 0.0);
export const SS_321 = new Material('18', 'SS 321', 0.7461581, 0.0, 0.0);
export const SS_430 = new Material('13', 'SS 430', 0.5996780, 0.0, 0.0);
export const NIFE = new Material('23', 'NiFe', 0.4337752, 0.0, 0.0);
export const NIFE30_STEALTHVAPE = new Material('14', 'NiFe30 (StealthVape)', 0.21200, 0.0, 0.0);
export const NIFE30_RESISTHERM = new Material('22', 'NiFe30 (Resistherm)', 0.3301871, 0.0, 0.0);
export const NIFE48_52_ALLOY52 = new Material('15', 'NiFe48/52 (Alloy52)', 0.38545, 0.0, 0.0);
export const NIFE70_ALLOY120 = new Material('16', 'NiFe70 (Alloy120)', 0.199892, 0.0, 0.0);
export const TUNGSTEN = new Material('19', 'Tungsten', 0.560023, 0.0, 0.0);
export const INVAR_NILO_PERNIFER_36 = new Material('25', 'Invar/Nilo/Pernifer 36', 0.819802, 0.0, 0.0);
export const SILVER = new Material('17', 'Silver', 0.01570, 0.0, 0.0);
export const ALUCHROME = new Material('27', 'AluChrome', 1.35, 0.0, 0.0);
