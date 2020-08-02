import * as React from 'react';
import { Button, Card, Col, Row, Select, Typography } from 'antd';
import { FormattedMessage } from 'umi';

import { Material, Materials, Wire, WireKind, WireStyle } from '@vapetool/types';
import { getResistancePerMeter } from '@/utils/math';
import { Path } from '@/models/coil';
import WireDiameter from '@/components/WireDiameter';
import RoundIcon from '@/assets/RoundIcon';
import DiameterIcon from '@/assets/DiameterIcon';
import CoreIcon from '@/assets/CoreIcon';
import OuterIcon from '@/assets/OuterIcon';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface WireComponentProps {
  wire: Wire;
  path: Path[];
  onSetWire: (path: Path[], wire: Wire) => void;
  onDeleteWire: (path: Path[]) => void;
}

const materials: Material[] = [
  Materials.KANTHAL_A1_AMP,
  Materials.KANTHAL_A_AE_AF,
  Materials.KANTHAL_D,
  Materials.NICHROME_N20,
  Materials.NICHROME_N40,
  Materials.NICHROME_N60,
  Materials.NICHROME_N70,
  Materials.NICHROME_N80,
  Materials.NICHROME_N90,
  Materials.NICKEL_NI200,
  Materials.NICKEL_DH,
  Materials.TITANIUM_TI,
  Materials.TITANIUM_TI_R504,
  Materials.SS_304_V2A,
  Materials.SS_316_V4A,
  Materials.SS_316L,
  Materials.SS_317L,
  Materials.SS_321,
  Materials.SS_430,
  Materials.NIFE,
  Materials.NIFE30_STEALTHVAPE,
  Materials.NIFE30_RESISTHERM,
  Materials.NIFE48_52_ALLOY52,
  Materials.NIFE70_ALLOY120,
  Materials.TUNGSTEN,
  Materials.INVAR_NILO_PERNIFER_36,
  Materials.SILVER,
  Materials.ALUCHROME,
].sort((a, b) => Number(a.id) - Number(b.id));

const SingleWire: React.FC<WireComponentProps> = (props) => {
  const { wire, path, onSetWire, onDeleteWire } = props;

  const handleMaterialChange = (materialId: string): void => {
    const material = materials.find(({ id }) => id === materialId);
    if (material !== undefined) {
      wire.material = material;
      onSetWire(path, wire);
    }
  };
  const onDeleteClick = () => onDeleteWire(path);
  // dispatchDeleteWire(dispatch, path);
  const onChangeKindClick = () => {
    wire.kind = wire.kind === WireKind.ROUND ? WireKind.RIBBON : WireKind.ROUND;
    onSetWire(path, wire);
  };

  return (
    <Card
      type="inner"
      title={
        <Row>
          {wire.style === WireStyle.CORE ? <CoreIcon /> : <OuterIcon />}
          {WireStyle[wire.style]}
        </Row>
      }
      extra={
        <Row gutter={8}>
          <Col>
            {wire.kind === WireKind.ROUND ? (
              <RoundIcon onClick={onChangeKindClick} />
            ) : (
              <MinusOutlined onClick={onChangeKindClick} />
            )}
          </Col>
          <Col>
            <CloseOutlined onClick={onDeleteClick} />
          </Col>
        </Row>
      }
      style={{ width: '100%', maxWidth: 400 }}
    >
      <Select
        defaultValue={wire.material.id}
        style={{ width: '100%', maxWidth: 220 }}
        onChange={handleMaterialChange}
      >
        {materials.map((material) => (
          <Option key={material.name} value={material.id}>
            {material.name}
          </Option>
        ))}
      </Select>
      <Button>{getResistancePerMeter(wire).toFixed(2)} [Ω/m]</Button>

      <label>
        <DiameterIcon style={{ color: 'primary', marginRight: 4 }} />
        <FormattedMessage id="coilCalculator.inputs.diameterOfWire" />
      </label>
      <WireDiameter path={path} wire={wire} onSetWire={onSetWire} onDeleteWire={onDeleteWire} />

      <br />
      <Typography.Text disabled={!wire.totalLength}>
        {wire.totalLength
          ? `Wire length: ${wire.totalLength.toFixed(1)}cm`
          : 'Wire length: calculation required'}
      </Typography.Text>
    </Card>
  );
};

export default SingleWire;
