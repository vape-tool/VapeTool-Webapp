import { Button, Col, Divider, Drawer, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import { UserPermission } from '@vapetool/types';
import { Dispatch } from 'redux';
import useMedia from 'react-media-hook2';
import { ConnectState } from '@/models/connect';
import { Battery } from '@/types';
import AffiliateEditTable from '@/components/AffiliateEditTable';
import { CurrentUser } from '@/models/user';
import { dispatchSelectBattery, dispatchToggleEditBattery } from '@/models/batteries';
import { FormattedMessage } from 'umi-plugin-react/locale';

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
  const onClose = () => dispatchSelectBattery(dispatch, undefined);
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
  const toggleEditBattery = () => dispatchToggleEditBattery(dispatch);

  const [collapsed, setCollapsed] = useState(false);
  useMedia({ query: { maxWidth: 500 }, onChange: setCollapsed });

  if (!selectedBattery) {
    return <div />;
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
          <img src={url} alt={model} style={{ width: '100%' }} />
        </Col>
      </Row>
      <br />

      <Row>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.brand" />}
            content={brand}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.model" />}
            content={model}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.chemistry" />}
            content={chemistry}
          />
        </Col>
        <Col span={8}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.size" />}
            content={size}
          />
        </Col>
        <Col span={8}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.capacity" />}
            content={capacity}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.stableCurrent" />}
            content={stableCurrent}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.minStableResistance" />}
            content={(voltage / stableCurrent).toFixed(3)}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.maxVapingCurrent" />}
            content={maxVapingCurrent}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.minVapingResistance" />}
            content={(voltage / maxVapingCurrent).toFixed(3)}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.nominalVoltage" />}
            content={voltage}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.cutOff" />}
            content={cutOff}
          />
        </Col>
      </Row>
      <Divider />

      <Row>
        <Col xs={12}>
          <span style={pStyle}>
            <FormattedMessage id="battery.links" />
          </span>
        </Col>
        {user && user.permission >= UserPermission.ONLINE_MODERATOR && (
          <Col xs={12}>
            <Button type="link" onClick={toggleEditBattery}>
              <FormattedMessage id="battery.actions.editAffiliates" />
            </Button>
          </Col>
        )}
      </Row>

      <Row gutter={32}>
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
              <FormattedMessage id="battery.actions.readReview" />
            </a>
          </Col>
        )}

        {!editBattery &&
          affiliate &&
          Array.from(affiliate, ([key, value]) => {
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
                  <FormattedMessage id="battery.actions.buyOn" values={{ key }} />
                </a>
              </Col>
            );
          })}
      </Row>
      {editBattery && <AffiliateEditTable />}
    </Drawer>
  );
};

export default connect(({ batteries, user }: ConnectState) => ({
  selectedBattery: batteries.selectedBattery,
  editBattery: batteries.editBattery,
  user: user.currentUser,
}))(BatteryPreviewDrawer);
