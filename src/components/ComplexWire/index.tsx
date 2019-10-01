import * as React from 'react';
import { Button, Card, InputNumber, Select, Typography } from 'antd';
import { Coil, isComplex, Wire, wireGenerator, WireStyle, WireType } from '@vapetool/types';
// @ts-ignore
import Image from 'react-image-webp';
import SingleWire from '@/components/SingleWire';
import { Dispatch } from '@/models/connect';
import { Path } from '@/models/coil';

const { Option } = Select;

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint global-require: 0 react/no-array-index-key: 0 */

export interface WireComponentProps {
  complexWire: Coil | Wire;
  dispatch: Dispatch;
  path: Path[];
}

const types: { name: string; src: any }[] = [
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
  },
  {
    name: WireType[WireType.TIGER],
    src: require('@/assets/coil_type_tiger.webp'),
  },
  {
    name: WireType[WireType.STAPLE],
    src: require('@/assets/coil_type_staple.webp'),
  },
  {
    name: WireType[WireType.STAGGERED_CLAPTON],
    src: require('@/assets/coil_type_staggered_clapton.webp'),
  },
  {
    name: WireType[WireType.STAGGERED_FUSED_CLAPTON],
    src: require('@/assets/coil_type_staggered_fused_clapton.webp'),
  },
  {
    name: WireType[WireType.STAPLE_STAGGERED_FUSED_CLAPTON],
    src: require('@/assets/coil_type_staple_staggered_fused_clapton.webp'),
  },
  {
    name: WireType[WireType.FRAMED_STAPLE],
    src: require('@/assets/coil_type_juggernaut.webp'),
  },
  {
    name: WireType[WireType.CUSTOM],
    src: require('@/assets/coil_type_custom.webp'),
  },
];
const ComplexWire: React.FC<WireComponentProps> = props => {
  const { complexWire, dispatch, path } = props;

  const handleTypeChange = ({ key, label }: any): void =>
    key &&
    dispatch &&
    dispatch({
      type: 'coil/setType',
      payload: {
        type: WireType[key],
        paths: path,
      },
    });
  const onPitchChange = (value: number | undefined): void =>
    value &&
    dispatch &&
    dispatch({
      type: 'coil/setInnerDiameter',
      payload: value,
    });
  const onAddWireClick = () => {
    dispatch({
      type: 'coil/addWire',
      payload: { paths: path, wire: wireGenerator.normalWire() },
    });
  };

  const imageSize = 35;

  return (
    <Card type={path.length === 0 ? undefined : 'inner'}>
      <Select
        size="large"
        labelInValue
        defaultValue={{ key: WireType[WireType.NORMAL] }}
        style={{ width: 220 }}
        onChange={handleTypeChange}
      >
        {types.map(type => (
          <Option key={type.name} value={type.name}>
            <div>
              <Image style={{ width: imageSize }} webp={type.src} />
              {type.name}
            </div>
          </Option>
        ))}
      </Select>
      {complexWire.pitch > 0 && (
        <div>
          <Typography.Title level={4}>Pitch</Typography.Title>
          <InputNumber
            min={0.0}
            step={0.1}
            defaultValue={complexWire.pitch}
            value={complexWire.pitch}
            onChange={onPitchChange}
          />
        </div>
      )}

      {complexWire.cores.map((wire: Wire, index: number) => {
        const childPath = path.slice();
        childPath.push({ style: WireStyle.CORE, index });
        return isComplex(wire) ? (
          <ComplexWire key={index} path={childPath} dispatch={dispatch} complexWire={wire} />
        ) : (
          <SingleWire key={index} path={childPath} wire={wire} dispatch={dispatch} />
        );
      })}

      <Button style={{ width: '100%', maxWidth: 400 }} onClick={onAddWireClick}>
        +
      </Button>

      {complexWire.outers.map((wire: Wire, index: number) => {
        const childPath = path.slice();
        childPath.push({ style: WireStyle.OUTER, index });

        return isComplex(wire) ? (
          <ComplexWire key={index} path={childPath} complexWire={wire} dispatch={dispatch} />
        ) : (
          <SingleWire key={index} path={childPath} wire={wire} dispatch={dispatch} />
        );
      })}
    </Card>
  );
};

export default ComplexWire;
