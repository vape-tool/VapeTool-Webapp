import * as React from 'react';
import { WireKind } from '@vapetool/types';
import { Button, InputNumber, notification, Row, Typography } from 'antd';
import { WireComponentProps } from '@/components/SingleWire';
import { awgToMm, mmToAwg } from '@/utils/math';
import { unitFormatter, unitParser } from '@/utils/utils';

const WireDiameter: React.FC<WireComponentProps> = props => {
  const { wire, path, onSetWire } = props;
  const awg = Math.round(mmToAwg(wire.mm));

  const onAwgMinusClick = () => {
    if (awg > 2) {
      wire.mm = awgToMm(awg - 1);
      onSetWire(path, wire);
    } else {
      notification.info({
        message: 'Can not decrease AWG',
        description: '2 is the minimal value',
      });
    }
  };

  const onAwgPlusClick = () => {
    if (awg < 61) {
      wire.mm = awgToMm(awg + 1);
      onSetWire(path, wire);
    } else {
      notification.info({
        message: 'Can not increase AWG',
        description: '62 is the maximum value',
      });
    }
  };

  const onMmChange = (value: number | undefined) => {
    if (value === undefined) return;
    wire.mm = value;
    onSetWire(path, wire);
  };

  const onWidthChange = (value: number | undefined) => {
    if (value === undefined) return;
    wire.width = value;
    onSetWire(path, wire);
  };

  const onHeightChange = (value: number | undefined) => {
    if (value === undefined) return;
    wire.height = value;
    onSetWire(path, wire);
  };

  return wire.kind === WireKind.ROUND ? (
    <Row>
      <Button onClick={onAwgMinusClick}>-</Button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ margin: 'auto' }}>
          <Typography.Text>{awg}</Typography.Text>
        </div>
        <Typography.Text style={{ margin: 4 }}>AWG</Typography.Text>
      </div>
      <Button onClick={onAwgPlusClick}>+</Button>
      =
      <InputNumber
        min={0.0}
        step={0.1}
        value={wire.mm}
        formatter={unitFormatter(1, 'mm')}
        parser={unitParser(1, 'mm')}
        onChange={onMmChange}
      />
    </Row>
  ) : (
    <Row justify="start" align="bottom">
      <div>
        <div>Width</div>
        <InputNumber
          min={0.0}
          step={0.1}
          value={wire.width}
          formatter={unitFormatter(1, 'mm')}
          parser={unitParser(1, 'mm')}
          onChange={onWidthChange}
        />
      </div>
      <Typography.Text style={{ margin: 8 }}>x</Typography.Text>
      <div>
        <div>Height</div>
        <InputNumber
          min={0.0}
          step={0.1}
          value={wire.height}
          formatter={unitFormatter(1, 'mm')}
          parser={unitParser(1, 'mm')}
          onChange={onHeightChange}
        />
      </div>
    </Row>
  );
};
export default WireDiameter;
