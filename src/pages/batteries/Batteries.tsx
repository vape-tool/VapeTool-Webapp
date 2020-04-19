import React, { useEffect } from 'react';
import { connect } from 'dva';
import { List } from 'antd';
import { id } from '@vapetool/types';
import { ConnectProps, ConnectState } from '@/models/connect';
import BatteryView from '@/components/BatteryView';
import BatteryPreviewDrawer from '@/components/BatteryPreviewDrawer';
import styles from '@/components/ItemView/styles.less';
import { Battery } from '@/types';
import { subscribeBatteries } from '@/services/batteries';
import { dispatchSelectBattery } from '@/models/batteries';

interface BatteriesComponentProps extends ConnectProps {
  batteries: Battery[];
}

const Batteries: React.FC<BatteriesComponentProps> = (props: BatteriesComponentProps) => {
  const { batteries, dispatch } = props;

  const onBatteryClick = (battery: Battery) => dispatchSelectBattery(dispatch, battery);

  useEffect(() => subscribeBatteries(dispatch), []);

  return (
    <div>
      <List<Battery>
        className={styles.coverCardList}
        grid={{ gutter: 24, xxl: 4, xl: 3, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={batteries || []}
        renderItem={battery => (
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
