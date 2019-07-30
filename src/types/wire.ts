export enum WireType {
  CUSTOM = -1,
  NORMAL,
  PARALLEL,
  TWISTED,
  CLAPTON,
  RIBBON,
  FUSED_CLAPTON,
  ALIEN_CLAPTON,
  TIGER,
  STAPLE,
  STAGGERED_CLAPTON,
  STAGGERED_FUSED_CLAPTON,
  STAPLE_STAGGERED_FUSED_CLAPTON,
  FRAMED_STAPLE,
  JUGGERNAUT,
}

export type WireTypeStrings = keyof typeof WireType

export enum WireFormat {
  NORMAL,
  STAGGERED
}

export enum WireStyle {
  CORE,
  OUTER
}

export enum WireKind {
  ROUND,
  RIBBON
}

export interface Material {
  id: string;
  name: string;
  resistivity: number;
  diameter: number;
  tcr: number;
}

export interface WiresTree {
  type: WireType;
  cores: Wire[];
  outers: Wire[];
  pitch: number;
}

export class Wire implements WiresTree {
  type: WireType;

  material: Material;

  style: WireStyle;

  format: WireFormat;

  kind: WireKind;

  mm: number;

  width: number;

  height: number;

  pitch: number;

  space: number;

  innerDiameter: number;

  totalLength: number;

  wrapLength: number;

  widthDiameter: number;

  heightDiameter: number;

  resistance: number;

  cores: Wire[];

  outers: Wire[];

  constructor(type: WireType, material: Material, style: WireStyle, format: WireFormat, kind: WireKind, mm: number, width: number, height: number, pitch: number, space: number, innerDiameter: number, totalLength: number, wrapLength: number, widthDiameter: number, heightDiameter: number, resistance: number, cores: Wire[], outers: Wire[]) {
    this.type = type;
    this.material = material;
    this.style = style;
    this.format = format;
    this.kind = kind;
    this.mm = mm;
    this.width = width;
    this.height = height;
    this.pitch = pitch;
    this.space = space;
    this.innerDiameter = innerDiameter;
    this.totalLength = totalLength;
    this.wrapLength = wrapLength;
    this.widthDiameter = widthDiameter;
    this.heightDiameter = heightDiameter;
    this.resistance = resistance;
    this.cores = cores;
    this.outers = outers;
  }
}
