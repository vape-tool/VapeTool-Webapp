import * as React from 'react';
import { Button, Card, InputNumber, Select, Tag, Typography } from 'antd';
import { Coil, isComplex, Wire, wireGenerator, WireStyle, WireType } from '@vapetool/types';
// @ts-ignore
import SingleWire from '@/components/SingleWire';
import { Path } from '@/models/coil';
import ImageWebp from '../ImageWebp';

const { Option } = Select;

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint global-require: 0 react/no-array-index-key: 0 */

export interface WireComponentProps {
  complexWire: Coil | Wire;
  path: Path[];
  isPro: boolean;
  onSetWireType: (type: string, path: Path[]) => void;
  onSetInnerDiameter: (diameter: number) => void;
  onAddWire: (path: Path[], wire: Wire) => void;
  onSetWire: (path: Path[], wire: Wire) => void;
  onDeleteWire: (path: Path[]) => void;
}

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

const ComplexWire: React.FC<WireComponentProps> = props => {
  const {
    complexWire,
    path,
    isPro,
    onSetWireType,
    onSetInnerDiameter,
    onAddWire,
    onSetWire,
    onDeleteWire,
  } = props;

  const handleTypeChange = ({ key }: any) => key && onSetWireType(WireType[key], path);
  const onPitchChange = (value: number | undefined) => value && onSetInnerDiameter(value);
  const onAddWireClick = () => onAddWire(path, wireGenerator.normalWire());

  const imageSize = 35;

  return (
    <Card type={path.length === 0 ? undefined : 'inner'}>
      <Select
        size="large"
        defaultValue={WireType[WireType.NORMAL]}
        style={{ width: 400 }}
        onChange={handleTypeChange}
      >
        {types.map(type => (
          <Option
            key={type.name}
            value={type.name.replace(/_/g, ' ')}
            disabled={type.proOnly && !isPro}
            title={type.proOnly && !isPro ? 'Pro users only' : ''}
          >
            <div>
              <ImageWebp style={{ width: imageSize, paddingRight: 10 }} webp={type.src}/>
              {type.name.replace(/_/g, ' ')}
              {type.proOnly && !isPro && (
                <Tag color="blue" style={{ marginLeft: 16 }}>
                  Pro
                </Tag>
              )}
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
          <ComplexWire
            key={index}
            path={childPath}
            complexWire={wire}
            isPro={isPro}
            onSetWireType={handleTypeChange}
            onSetInnerDiameter={onPitchChange}
            onAddWire={onAddWireClick}
            onSetWire={onSetWire}
            onDeleteWire={onDeleteWire}
          />
        ) : (
          <SingleWire
            key={index}
            path={childPath}
            wire={wire}
            onSetWire={onSetWire}
            onDeleteWire={onDeleteWire}
          />
        );
      })}

      <Button style={{ width: '100%', maxWidth: 400 }} onClick={onAddWireClick}>
        +
      </Button>

      {complexWire.outers.map((wire: Wire, index: number) => {
        const childPath = path.slice();
        childPath.push({ style: WireStyle.OUTER, index });

        return isComplex(wire) ? (
          <ComplexWire
            key={index}
            path={childPath}
            complexWire={wire}
            isPro={isPro}
            onSetWireType={handleTypeChange}
            onSetInnerDiameter={onPitchChange}
            onAddWire={onAddWireClick}
            onSetWire={onSetWire}
            onDeleteWire={onDeleteWire}
          />
        ) : (
          <SingleWire
            key={index}
            path={childPath}
            wire={wire}
            onSetWire={onSetWire}
            onDeleteWire={onDeleteWire}
          />
        );
      })}
    </Card>
  );
};

export default ComplexWire;
