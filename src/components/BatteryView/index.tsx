import { Card, Col, List, Typography } from 'antd';
import React from 'react';
import styles from '@/pages/account/center/components/UserPhotos/index.less';
import { Battery } from '@/types/battery';

interface BatteryViewProps {
  battery: Battery;
}

const BatteryView: React.FC<BatteryViewProps> = ({ battery }) => (
  <List.Item>
    <Card
      className={styles.card}
      hoverable
      cover={<img alt={battery.model} src={battery.url}/>}
    >
      <Card.Meta
        title={`${battery.brand} ${battery.model}`}
        description={<Col>
          <Typography.Text>{battery.size}</Typography.Text>
          <Typography.Text>{battery.capacity}</Typography.Text>
          <Typography.Text>{battery.stableCurrent}</Typography.Text>
          <Typography.Text>{battery.maxVapeCurrent}</Typography.Text>
        </Col>}
      />
    </Card>
  </List.Item>
);


export default BatteryView;
