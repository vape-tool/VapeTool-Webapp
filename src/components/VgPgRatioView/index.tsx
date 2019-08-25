import { Col, InputNumber, Row, Slider, Tooltip, Typography } from 'antd';
import React from 'react';
import { unitFormatter, unitParser } from '@/utils/utils';
import { formatMessage } from 'umi-plugin-react/locale';

const { Text } = Typography;

interface VgPgRatioProps {
  onRatioChange: any;
  ratio: number
}

const VgPgRatioView: React.FC<VgPgRatioProps> = props => {
  const { onRatioChange, ratio } = props;

  const responsivenessRatioVg = {
    xs: { span: 12, order: 1 },
    md: { span: 5, order: 1 },
    xl: { span: 12, order: 1 },
  };
  const responsivenessRatioSlider = {
    xs: { span: 24, order: 3 },
    md: { span: 12, order: 2 },
    xl: { span: 24, order: 3 },
  };
  const responsivenessRatioPg = {
    xs: { span: 12, order: 2 },
    md: { span: 5, order: 3 },
    xl: { span: 12, order: 2 },
  };

  return (
    <Row type="flex" justify="space-between">
      <Col {...responsivenessRatioVg}>
        <Tooltip title={formatMessage({ id: 'liquid.vg' })}>
          <Text>VG</Text>
        </Tooltip>
        <InputNumber
          min={0}
          max={100}
          step={5}
          formatter={unitFormatter(0, '%')}
          parser={unitParser('%')}
          style={{ marginLeft: 8 }}
          value={100 - ratio}
          onChange={onRatioChange}
        />
      </Col>
      <Col {...responsivenessRatioSlider}>
        <Slider
          step={5}
          min={0}
          max={100}
          onChange={onRatioChange}
          value={100 - ratio}
        />
      </Col>
      <Col {...responsivenessRatioPg}>
        <Tooltip title={formatMessage({ id: 'liquid.pg' })}>
          <Text>PG</Text>
        </Tooltip>
        <InputNumber
          min={0}
          max={100}
          step={5}
          style={{ marginLeft: 8 }}
          formatter={unitFormatter(0, '%')}
          parser={unitParser('%')}
          value={ratio}
          onChange={(value: number | undefined) =>
            value && onRatioChange(100 - value)
          }
        />
      </Col>
    </Row>
  )
};

export default VgPgRatioView
