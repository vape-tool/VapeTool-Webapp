import * as React from 'react';
import { WireKind } from '@vapetool/types';
import { Button, InputNumber, notification, Row, Typography } from 'antd';
import { WireComponentProps } from '@/components/SingleWire';
import { awgToMm, mmToAwg } from '@/utils/math';
import { dispatchSetWire } from '@/models/coil';

const WireDiameter: React.FC<WireComponentProps> = props => {
  const { wire, dispatch, path } = props;
  const awg = Math.round(mmToAwg(wire.mm));

  const onAwgMinusClick = () => {
    if (awg > 2) {
      wire.mm = awgToMm(awg - 1);
      dispatchSetWire(dispatch, path, wire);
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
      dispatchSetWire(dispatch, path, wire);
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
    dispatchSetWire(dispatch, path, wire);
  };

  const onWidthChange = (value: number | undefined) => {
    if (value === undefined) return;
    wire.width = value;
    dispatchSetWire(dispatch, path, wire);
  };

  const onHeightChange = (value: number | undefined) => {
    if (value === undefined) return;
    wire.height = value;
    dispatchSetWire(dispatch, path, wire);
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
      <InputNumber min={0.0} step={0.1} value={wire.mm} precision={1} onChange={onMmChange} />
    </Row>
  ) : (
    <Row justify="start" align="bottom">
      <div>
        <label>
          Width [mm]
          <InputNumber
            min={0.0}
            step={0.1}
            value={wire.width}
            precision={1}
            onChange={onWidthChange}
          />
        </label>
      </div>
      <Typography.Text style={{ margin: 8 }}>x</Typography.Text>
      <div>
        <label>
          Height [mm]
          <InputNumber
            min={0.0}
            step={0.1}
            value={wire.height}
            precision={1}
            onChange={onHeightChange}
          />
        </label>
      </div>
    </Row>
  );
};
export default WireDiameter;
