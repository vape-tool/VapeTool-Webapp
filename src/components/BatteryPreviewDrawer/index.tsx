import { Col, Divider, Drawer, Row, Tag } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import useMedia from 'react-media-hook2';
import { UserAuthorities } from '@/types/UserAuthorities';

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const BatteryPreviewDrawer = () => {
  const { setSelectedBattery, selectedBattery, editBattery } = useModel('batteries');

  const { initialState } = useModel('@@initialState');
  const isPro = initialState?.currentUser?.authorities?.includes(UserAuthorities.PRO);

  const onClose = () => setSelectedBattery(undefined);

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
      width={collapsed ? 500 : 600}
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
            title={<FormattedMessage id="battery.properties.brand" defaultMessage="Brand" />}
            content={brand}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.model" defaultMessage="Model" />}
            content={model}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <DescriptionItem
            title={
              <FormattedMessage id="battery.properties.chemistry" defaultMessage="Chemistry" />
            }
            content={chemistry}
          />
        </Col>
        <Col span={8}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.size" defaultMessage="Size" />}
            content={size}
          />
        </Col>
        <Col span={8}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.capacity" defaultMessage="Capacity" />}
            content={capacity}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title={
              <FormattedMessage
                id="battery.properties.stableCurrent"
                defaultMessage="Stable current"
              />
            }
            content={stableCurrent}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={
              <FormattedMessage
                id="battery.properties.maxVapingCurrent"
                defaultMessage="Max. Vaping current"
              />
            }
            content={isPro ? maxVapingCurrent : <Tag color="blue">Pro only</Tag>}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title={
              <FormattedMessage
                id="battery.properties.nominalVoltage"
                defaultMessage="Nominal voltage"
              />
            }
            content={voltage}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={
              <FormattedMessage
                id="battery.properties.minStableResistance"
                defaultMessage="Min. stable resistance"
              />
            }
            content={
              isPro ? (voltage / stableCurrent).toFixed(3) : <Tag color="blue">Pro only</Tag>
            }
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title={<FormattedMessage id="battery.properties.cutOff" defaultMessage="Cut-off" />}
            content={cutOff}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title={
              <FormattedMessage
                id="battery.properties.minVapingResistance"
                defaultMessage="Min. Vaping resistance"
              />
            }
            content={
              isPro ? (voltage / maxVapingCurrent).toFixed(3) : <Tag color="blue">Pro only</Tag>
            }
          />
        </Col>
      </Row>
      <Divider />

      <Row>
        <Col xs={12}>
          <span style={pStyle}>
            <FormattedMessage id="battery.links" defaultMessage="Links" />
          </span>
        </Col>
        {/* {currentUser && currentUser.permission >= UserPermission.ONLINE_MODERATOR && (
          <Col xs={12}>
            <Button type="link" onClick={toggleEditBattery}>
              <FormattedMessage
                id="battery.actions.editAffiliates"
                defaultMessage="Edit Affiliates"
              />
            </Button>
          </Col>
        )} */}
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
              <FormattedMessage id="battery.actions.readReview" defaultMessage="Read review" />
            </a>
          </Col>
        )}

        {!editBattery &&
          affiliate &&
          Array.from(affiliate, ([key, value]) => (
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
                <FormattedMessage
                  id="battery.actions.buyOn"
                  values={{ key }}
                  defaultMessage="Buy on {key}"
                />
              </a>
            </Col>
          ))}
      </Row>
    </Drawer>
  );
};

export default BatteryPreviewDrawer;
