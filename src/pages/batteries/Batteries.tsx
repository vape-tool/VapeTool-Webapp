import React from 'react';
import { List } from 'antd';
import { connect } from 'dva';
import { id } from '@vapetool/types';
import { ConnectProps, ConnectState } from '@/models/connect';
import { Battery } from '@/types/battery';
import styles from '@/pages/account/center/components/UserPhotos/index.less';
import { BatteriesModelState } from '@/models/batteries';
import BatteryView from '@/components/BatteryView';

interface BatteriesComponentProps extends ConnectProps {
  batteries: BatteriesModelState;
}

const Batteries: React.FC<BatteriesComponentProps> = props => {
  const {
    batteries: { batteries },
  } = props;

  return (
    <div>
      <List<Battery>
        className={styles.coverCardList}
        grid={{ gutter: 24, xxl: 4, xl: 3, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={batteries || []}
        renderItem={battery => <BatteryView key={id(battery)} battery={battery}/>}
      />
    </div>
  );
};

export default connect(({ batteries }: ConnectState) => ({
  batteries,
}))(Batteries);
