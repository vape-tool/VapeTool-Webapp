import * as React from 'react';
import { Button, Card, InputNumber, Select, Tag } from 'antd';
import { Coil, isComplex, Wire, wireGenerator, WireStyle, WireType } from '@vapetool/types';
import { FormattedMessage } from 'umi-plugin-react/locale';
import SingleWire from '@/components/SingleWire';
import { Path } from '@/models/coil';
import ImageWebp from '../ImageWebp';
import types from './coilTypes';

const { Option } = Select;

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint global-require: 0 react/no-array-index-key: 0 */

export interface WireComponentProps {
  complexWire: Coil | Wire;
  path: Path[];
  isPro: boolean;
  onSetWireType: (type: number, path: Path[]) => void;
  onSetInnerDiameter: (diameter: number) => void;
  onAddWire: (path: Path[], wire: Wire) => void;
  onSetWire: (path: Path[], wire: Wire) => void;
  onDeleteWire: (path: Path[]) => void;
}

const ComplexWire: React.FC<WireComponentProps> = ({
  complexWire,
  path,
  isPro,
  onSetWireType,
  onSetInnerDiameter,
  onAddWire,
  onSetWire,
  onDeleteWire,
}) => {
  const handleTypeChange = (key: string) => key && onSetWireType(WireType[key], path);
  const onPitchChange = (value: string | number | undefined) =>
    value && Number.isFinite(value) && onSetInnerDiameter(Number(value));
  const onAddWireClick = () => onAddWire(path, wireGenerator.normalWire());

  const imageSize = 35;

  return (
    <Card type={path.length === 0 ? undefined : 'inner'}>
      <Select
        size="large"
        value={WireType[complexWire.type]}
        style={{ width: 400 }}
        onChange={handleTypeChange}
      >
        {types.map(type => (
          <Option
            key={type.name}
            value={type.name}
            disabled={type.proOnly && !isPro}
            title={type.proOnly && !isPro ? 'Pro users only' : ''}
          >
            <div>
              <ImageWebp style={{ width: imageSize, paddingRight: 10 }} webp={type.src} />
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
        <div style={{ margin: 10 }}>
          <label>
            <FormattedMessage id="coilCalculator.inputs.pitch" />
            <InputNumber
              min={0.0}
              step={0.1}
              defaultValue={complexWire.pitch}
              value={complexWire.pitch}
              onChange={onPitchChange}
            />
          </label>
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
            onSetWireType={onSetWireType}
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
            onSetWireType={onSetWireType}
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
