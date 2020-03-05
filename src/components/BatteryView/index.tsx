import { Card, List, Typography } from 'antd';
import React from 'react';
import { connect } from 'dva';
import styles from '@/components/ItemView/styles.less';
import { ConnectProps, ConnectState } from '@/models/connect';
import { Battery } from '@/types';
import { dispatchSelectBattery } from '@/models/batteries';

interface BatteryViewProps extends ConnectProps {
  battery: Battery;
  height: number;
  width: number;
}

const BatteryView: React.FC<BatteryViewProps> = ({ battery, height, width, dispatch }) => {
  const onCardClick = () => dispatchSelectBattery(dispatch, battery);

  return (
    <List.Item style={{ height, width }}>
      <Card
        className={styles.card}
        hoverable
        cover={
          <img
            style={{ objectFit: 'cover', height: Math.round(height / 1.5), width }}
            alt={battery.model}
            src={battery.url}
          />
        }
        onClick={onCardClick}
      >
        <Card.Meta
          title={`${battery.brand} ${battery.model}`}
          description={
            <ul>
              <li>
                <Typography.Text>
                  {battery.chemistry} {battery.size}
                </Typography.Text>
              </li>
              <li>
                <Typography.Text>
                  {battery.capacity}mAh
                  {battery.stableCurrent}A
                </Typography.Text>
              </li>
            </ul>
          }
        />
      </Card>
    </List.Item>
  );
};

export default connect(({ batteries }: ConnectState) => ({ batteries }))(BatteryView);
