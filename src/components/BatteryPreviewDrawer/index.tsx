import { Button, Col, Divider, Drawer, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import { UserPermission } from '@vapetool/types';
import { Dispatch } from 'redux';
import useMedia from 'react-media-hook2';
import { ConnectState } from '@/models/connect';
import { Battery } from '@/types/battery';
import AffiliateEditTable from '@/components/AffiliateEditTable';
import { CurrentUser } from '@/models/user';

interface BatteryPreviewDrawerProps {
  dispatch: Dispatch;
  selectedBattery?: Battery;
  editBattery?: boolean;
  user?: CurrentUser;
}

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const BatteryPreviewDrawer: React.FC<BatteryPreviewDrawerProps> = (
  props: BatteryPreviewDrawerProps,
) => {
  const { dispatch, selectedBattery, editBattery, user } = props;
  console.log(`selected ${selectedBattery ? selectedBattery.id : 'undefined'}`);
  const onClose = () => {
    dispatch({
      type: 'batteries/selectBattery',
      battery: undefined,
    });
  };
  const DescriptionItem = ({ title, content }: { title: any; content: any }) => (
    <div
      style={{
        fontSize: 14,
        lineHeight: '22px',
        marginBottom: 7,
        color: 'rgba(0,0,0,0.65)',
      }}
    >
      <p
        style={{
          marginRight: 8,
          display: 'inline-block',
          color: 'rgba(0,0,0,0.85)',
        }}
      >
        {title}:
      </p>
      {content}
    </div>
  );
  const toggleEditBattery = () =>
    dispatch({
      type: 'batteries/toggleEditBattery',
    });

  const [collapsed, setCollapsed] = useState(false);
  useMedia({ query: { maxWidth: 500 }, onChange: setCollapsed });

  if (!selectedBattery) {
    return <div></div>;
  }
  const {
    brand,
    model,
    chemistry,
    size,
    capacity,
    maxVapingCurrent,
    stableCurrent,
    cutOff,
    reviewUrl,
    voltage,
    url,
    affiliate,
  } = selectedBattery;


  return (
    <Drawer
      width={collapsed ? 400 : 500}
      title={`${brand} ${model}`}
      placement="right"
      closable
      onClose={onClose}
      visible={selectedBattery !== undefined}
    >
      <Row>
        <Col span={24}>
          <img src={url} alt={model} style={{ width: '100%' }}/>
        </Col>
      </Row>
      <br/>

      <Row>
        <Col span={12}>
          <DescriptionItem title="Brand" content={brand}/>
        </Col>
        <Col span={12}>
          <DescriptionItem title="Model" content={model}/>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <DescriptionItem title="Chemistry" content={chemistry}/>
        </Col>
        <Col span={8}>
          <DescriptionItem title="Size" content={size}/>
        </Col>
        <Col span={8}>
          <DescriptionItem title="Capacity" content={capacity}/>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Stable current" content={stableCurrent}/>
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Min. stable resistance"
            content={(voltage / stableCurrent).toFixed(3)}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Max vaping current" content={maxVapingCurrent}/>
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Min. vaping resistance"
            content={(voltage / maxVapingCurrent).toFixed(3)}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem title="Nominal voltage" content={voltage}/>
        </Col>
        <Col span={12}>
          <DescriptionItem title="Cut-off" content={cutOff}/>
        </Col>
      </Row>
      <Divider/>

      <Row>
        <Col xs={12}>
          <span style={pStyle}>Links</span>
        </Col>
        {user && user.permission >= UserPermission.ONLINE_MODERATOR && (
          <Col xs={12}>
            <Button type="link" onClick={toggleEditBattery}>
              Edit affiliates
            </Button>
          </Col>
        )}
      </Row>

      <Row type="flex" gutter={32}>
        {reviewUrl && (
          <Col xs="auto">
            <a
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                display: 'inherit',
              }}
              href={reviewUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Read review
            </a>
          </Col>
        )}

        {!editBattery &&
        affiliate &&
        Array.from(affiliate, ([key, value]) => {
          console.log(`${key} ${value}`);
          return (
            <Col xs="auto">
              <a
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  display: 'inherit',
                }}
                rel="noopener noreferrer"
                target="_blank"
                href={value}
              >
                Buy on {key}
              </a>
            </Col>
          );
        })}
      </Row>
      {editBattery && <AffiliateEditTable/>}
    </Drawer>
  );
};

export default connect(({ batteries, user }: ConnectState) => ({
  selectedBattery: batteries.selectedBattery,
  editBattery: batteries.editBattery,
  user: user.currentUser,
}))(BatteryPreviewDrawer);
