import { WireType } from '@vapetool/types';
/* eslint global-require: 0 react/no-array-index-key: 0 */

const types: { name: string; src: any; proOnly?: boolean }[] = [
  {
    name: WireType[WireType.NORMAL],
    src: require('@/assets/coil_type_normal.webp'),
  },
  {
    name: WireType[WireType.PARALLEL],
    src: require('@/assets/coil_type_parallel.webp'),
  },
  {
    name: WireType[WireType.TWISTED],
    src: require('@/assets/coil_type_twisted.webp'),
  },
  {
    name: WireType[WireType.CLAPTON],
    src: require('@/assets/coil_type_clapton.webp'),
  },
  {
    name: WireType[WireType.RIBBON],
    src: require('@/assets/coil_type_ribbon.webp'),
  },
  {
    name: WireType[WireType.FUSED_CLAPTON],
    src: require('@/assets/coil_type_fused_clapton.webp'),
  },
  {
    name: WireType[WireType.ALIEN_CLAPTON],
    src: require('@/assets/coil_type_alien_clapton.webp'),
    proOnly: true,
  },
  {
    name: WireType[WireType.TIGER],
    src: require('@/assets/coil_type_tiger.webp'),
    proOnly: true,
  },
  {
    name: WireType[WireType.STAPLE],
    src: require('@/assets/coil_type_staple.webp'),
    proOnly: true,
  },
  {
    name: WireType[WireType.STAGGERED_CLAPTON],
    src: require('@/assets/coil_type_staggered_clapton.webp'),
    proOnly: true,
  },
  {
    name: WireType[WireType.STAGGERED_FUSED_CLAPTON],
    src: require('@/assets/coil_type_staggered_fused_clapton.webp'),
    proOnly: true,
  },
  {
    name: WireType[WireType.STAPLE_STAGGERED_FUSED_CLAPTON],
    src: require('@/assets/coil_type_staple_staggered_fused_clapton.webp'),
    proOnly: true,
  },
  {
    name: WireType[WireType.FRAMED_STAPLE],
    src: require('@/assets/coil_type_juggernaut.webp'),
    proOnly: true,
  },
  {
    name: WireType[WireType.CUSTOM],
    src: require('@/assets/coil_type_custom.webp'),
    proOnly: true,
  },
];

export default types;
