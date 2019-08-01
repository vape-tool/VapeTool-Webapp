import { Coil } from '@/types/coil';
import { Wire, WireFormat, WireKind, WireStyle, WireType } from '@/types/wire';
import { KANTHAL_A1_AMP, Material } from '@/types/material';


const defaultCoreMm = 0.511;
const defaultOuterMm = 0.202;
const defaultMaterial: Material = KANTHAL_A1_AMP;
const defaultWidth = 0.5;
const defaultHeight = 0.1;

export function coilOfType(wireType: WireType): Coil {
  switch (wireType) {
    default:
    case WireType.CUSTOM: {
      return customCoil()
    }
    case WireType.NORMAL: {
      return normalCoil()
    }
    case WireType.PARALLEL: {
      return parallelCoil()
    }
    case WireType.TWISTED: {
      return twistedCoil()
    }
    case WireType.CLAPTON: {
      return claptonCoil()
    }
    case WireType.RIBBON: {
      return ribbonCoil()
    }
    case WireType.FUSED_CLAPTON: {
      return fusedClaptonCoil()
    }
    case WireType.TIGER: {
      return tigerCoil()
    }
    case WireType.STAPLE: {
      return stapleCoil()
    }
    case WireType.STAGGERED_CLAPTON: {
      return staggeredClaptonCoil()
    }
    case WireType.STAGGERED_FUSED_CLAPTON: {
      return staggeredFusedClaptonCoil()
    }
    case WireType.STAPLE_STAGGERED_FUSED_CLAPTON: {
      return stapleStaggeredFusedClaptonCoil()
    }
    case WireType.FRAMED_STAPLE: {
      return framedStapleCoil()
    }
    case WireType.JUGGERNAUT: {
      return juggernautClaptonCoil()
    }
  }
}

/**
 * Wires
 */

export function normalWire(mm: number = defaultCoreMm, material: Material = defaultMaterial): Wire {
  return new Wire({ mm, material })
}

function normalWireOuter(mm: number = defaultOuterMm, material: Material = defaultMaterial): Wire {
  return new Wire({ mm, material, style: WireStyle.OUTER })
}

export function customWire(): Wire {
  return new Wire({ cores: [normalWire()] })
}

export function ribbonWire(width: number = defaultWidth,
                           height: number = defaultHeight,
                           material: Material = defaultMaterial): Wire {
  return new Wire({ width, height, material, kind: WireKind.RIBBON })
}

export function claptonWire(core: Wire = normalWire(), outer: Wire = normalWireOuter()): Wire {
  return new Wire({ type: WireType.CLAPTON, cores: [core], outers: [outer] })
}

export function parallelWire(core: Wire = normalWire(), strands: number) {
  const cores = Array(Math.max(2, strands)).map(index => new Wire({ ...core }));
  return new Wire({ type: WireType.PARALLEL, cores });
}

export function staggeredClaptonWire(core: Wire = normalWire(),
                                     outer: Wire = normalWireOuter()): Wire {
  return new Wire({
    type: WireType.STAGGERED_CLAPTON,
    cores: [core],
    outers: [{ ...outer, format: WireFormat.STAGGERED }],
  })
}


/**
 * Custom
 */


export function customCoil(): Coil {
  const core = normalWire();
  core.cores = [normalWire()];
  return new Coil({ type: WireType.CUSTOM, cores: [core], outers: [normalWireOuter()] })
}

/**
 * Normal
 */

export function normalCoil(): Coil {
  return new Coil({ type: WireType.NORMAL, cores: [normalWire()] })
}


/**
 * Parallel
 */


export function parallelCoil(core: Wire = normalWire(), strands: number = 2): Coil {
  const cores = Array(Math.max(2, strands)).map(index => new Wire({ ...core }));
  return new Coil({ type: WireType.PARALLEL, cores });
}

/**
 * Twisted
 */


export function twistedCoil(
  core: Wire = normalWire(),
  strands: number = 2,
  pitch: number = 0.0) {
  const cores = Array(Math.max(2, strands)).map(index => new Wire({ ...core }));
  if (pitch < cores.length * core.mm) {
    // eslint-disable-next-line no-param-reassign
    pitch = cores.length * core.mm * 1.5;
  }
  return new Coil({ type: WireType.TWISTED, cores, pitch });
}

/**
 * Clapton
 */

export function claptonCoil(
  core: Wire = normalWire(),
  outer: Wire = normalWireOuter(),
): Coil {
  return new Coil({ type: WireType.CLAPTON, cores: [{ ...core }], outers: [{ ...outer }] })
}


/**
 * Ribbon
 */

export function ribbonCoil(core: Wire = ribbonWire()): Coil {
  return new Coil({ type: WireType.RIBBON, cores: [{ ...core }] })
}

/**
 * Fused Clapton
 */

export function fusedClaptonCoil(
  core: Wire = normalWire(),
  strands: number = 2,
  outer: Wire = normalWireOuter(),
): Coil {
  const cores = Array(Math.max(2, strands)).map(index => new Wire({ ...core }));
  return new Coil({ type: WireType.FUSED_CLAPTON, cores, outers: [{ ...outer }] });
}

/**
 * Alien Clapton
 */

export function alienClaptonCoil(
  core: Wire = normalWire(),
  strands: number = 2,
  outer: Wire = normalWireOuter(),
): Coil {
  const cores = Array(Math.max(2, strands)).map(index => new Wire({ ...core }));
  return new Coil({ type: WireType.ALIEN_CLAPTON, cores, outers: [{ ...outer }] });
}

/**
 * Tiger
 */

export function tigerCoil(
  pitch: number = 0.0,
  wires: Wire[] = [normalWire(), ribbonWire()],
): Coil {
  const cores = wires.map(wire => new Wire({ ...wire }));
  const totalWidth = wires.map(wire => (wire.kind === WireKind.ROUND ? wire.mm : wire.width))
    .reduce((previousValue, currentValue) => previousValue + currentValue);
  if (pitch < totalWidth) {
    // eslint-disable-next-line no-param-reassign
    pitch = totalWidth * 2;
  }
  return new Coil({ type: WireType.TIGER, cores, pitch });
}

/**
 * Staple
 */

export function stapleCoil(
  core: Wire = ribbonWire(),
  strands: number = 5,
  outer: Wire = normalWireOuter(),
): Coil {
  const cores = Array(Math.max(2, strands)).map(index => new Wire({ ...core }));
  return new Coil({ type: WireType.STAPLE, cores, outers: [{ ...outer }] });
}


/**
 * Staggered Clapton
 */

export function staggeredClaptonCoil(
  core: Wire = normalWire(),
  strands: number = 1,
  outer: Wire = normalWireOuter(),
): Coil {
  const cores = Array(Math.max(1, strands)).map(index => new Wire({ ...core }));
  return new Coil({
    type: WireType.STAGGERED_CLAPTON,
    cores,
    outers: [{ ...outer, format: WireFormat.STAGGERED }],
  });
}

/**
 * Staggered Fused Clapton
 */

export function staggeredFusedClaptonCoil(
  core: Wire = normalWire(),
  strands: number = 2,
  outer: Wire = normalWireOuter(),
): Coil {
  const cores = Array(Math.max(2, strands)).map(index => staggeredClaptonWire(core, outer));
  return new Coil({
    type: WireType.STAGGERED_FUSED_CLAPTON,
    cores,
    outers: [{ ...outer, format: WireFormat.STAGGERED }],
  });
}

/**
 * Staple Staggered Fused Clapton
 */
export function stapleStaggeredFusedClaptonCoil(
  coreEdge: Wire = normalWire(),
  edgeStrands: number = 2,
  coreInner: Wire = ribbonWire(),
  innerStrands: number = 5,
  outer: Wire = normalWireOuter(),
) {
  const cores = Array(Math.max(2, edgeStrands) - 1).flatMap(index => {
    const edge = staggeredClaptonWire(coreEdge, outer);
    const innerCores = Array(Math.max(1, innerStrands)).map(_ => new Wire({ ...coreInner }));
    innerCores.unshift(edge);
    return innerCores
  });
  cores.push(staggeredClaptonWire(coreEdge, outer));

  return new Coil({
    type: WireType.STAPLE_STAGGERED_FUSED_CLAPTON,
    cores,
    outers: [{ ...outer, format: WireFormat.STAGGERED }],
  });
}

/**
 * Fragmed Staple
 */


export function framedStapleCoil(
  coreEdge: Wire = normalWire(),
  edgeStrands: number = 2,
  coreInner: Wire = ribbonWire(),
  innerStrands: number = 5,
  outer: Wire = normalWireOuter(),
) {
  const cores = Array(Math.max(2, edgeStrands) - 1).flatMap(index => {
    const edge = new Wire({ ...coreEdge });
    const parallelRibbon = parallelWire(coreInner, Math.max(1, innerStrands));
    return [edge, parallelRibbon];
  });
  cores.push(new Wire({ ...coreEdge }));

  return new Coil({
    type: WireType.FRAMED_STAPLE,
    cores,
    outers: [{ ...outer }],
  });
}

/**
 * Juggernaut Clapton
 */


export function juggernautClaptonCoil(
  core: Wire = normalWire(),
  strands: number = 1,
  claptonOuter: Wire = normalWireOuter(),
  outer: Wire = ribbonWire(),
): Coil {
  const cores = Array(Math.max(1, strands)).map(index => claptonWire(core, claptonOuter));
  return new Coil({
    type: WireType.JUGGERNAUT,
    cores,
    outers: [{ ...outer, format: WireFormat.STAGGERED }],
  });
}
