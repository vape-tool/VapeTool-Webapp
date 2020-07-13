import React from 'react';
import { connect, useModel } from 'umi';
import { List } from 'antd';
import { id } from '@vapetool/types';
import { ConnectProps, ConnectState } from '@/models/connect';
import BatteryView from '@/components/BatteryView';
import BatteryPreviewDrawer from '@/components/BatteryPreviewDrawer';
import styles from '@/components/ItemView/styles.less';
import { Battery } from '@/types';

interface BatteriesComponentProps extends ConnectProps {
  batteries: Battery[];
}

const Batteries: React.FC<BatteriesComponentProps> = () => {
  const { setSelectedBattery, batteries } = useModel('batteries');

  const onBatteryClick = (battery: Battery) => setSelectedBattery(battery);

  return (
    <div>
      <List<Battery>
        className={styles.coverCardList}
        grid={{ gutter: 24, xxl: 4, xl: 3, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={batteries || []}
        renderItem={(battery) => (
          <BatteryView
            key={id(battery)}
            battery={battery}
            height={300}
            onBatteryClick={onBatteryClick}
          />
        )}
      />
      <BatteryPreviewDrawer />
    </div>
  );
};

export default connect(({ batteries: { batteries } }: ConnectState) => ({ batteries }))(Batteries);
