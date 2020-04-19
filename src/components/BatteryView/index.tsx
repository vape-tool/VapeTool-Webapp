import { Card, List, Typography } from 'antd';
import React from 'react';
import styles from '@/components/ItemView/styles.less';
import { Battery } from '@/types';
import { FormattedMessage } from 'umi-plugin-react/locale';

interface BatteryViewProps {
  onBatteryClick: (battery: Battery) => void;
  battery: Battery;
  height: number;
  width?: number;
}

const BatteryView: React.FC<BatteryViewProps> = ({ battery, height, width, onBatteryClick }) => {
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
        onClick={() => onBatteryClick(battery)}
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
                  {battery.capacity}{' '}
                  <FormattedMessage id="misc.units.milliAmpHours" defaultMessage="mAh" />
                  {battery.stableCurrent}{' '}
                  <FormattedMessage id="misc.units.short.amp" defaultMessage="A" />
                </Typography.Text>
              </li>
            </ul>
          }
        />
      </Card>
    </List.Item>
  );
};

export default BatteryView;
