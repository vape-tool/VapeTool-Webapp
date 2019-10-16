import React from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { ConverterModelState } from '@/models/converter';
import AwgTab from '@/pages/converters/AwgTab';
import InchTab from '@/pages/converters/InchTab';
import TempTab from '@/pages/converters/TempTab';

export interface ConverterComponentProps {
  converter: ConverterModelState;
  dispatch: Dispatch;
}

const tabList = [
  {
    key: 'awg',
    tab: 'AWG',
  },
  {
    key: 'inch',
    tab: 'Inch',
  },
  {
    key: 'temp',
    tab: 'Temperature',
  },
];

const Converters: React.FC<ConverterComponentProps> = props => {
  const { converter, dispatch } = props;

  const onTabChange = (key: string) =>
    dispatch({
      type: 'converter/setTab',
      payload: key,
    });

  const contentList = {
    awg: <AwgTab />,
    inch: <InchTab />,
    temp: <TempTab />,
  };

  return (
    <PageHeaderWrapper>
      <Card
        style={{ width: '100%' }}
        tabList={tabList}
        activeTabKey={converter.currentTab}
        onTabChange={key => {
          onTabChange(key);
        }}
      >
        {contentList[converter.currentTab]}
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ converter }: ConnectState) => ({
  converter,
}))(Converters);
