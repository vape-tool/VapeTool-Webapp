import React from 'react';
import { InputNumber, Col } from 'antd';
import { formatMessage, FormattedMessage } from 'umi';
import FormItem from 'antd/lib/form/FormItem';
import VgPgRatioView from '@/components/VgPgRatioView';
import { MixableType } from '@vapetool/types';

export default function InputElements(props: any) {
  return (
    <>
      <FormItem
        name={`amount-${props.side}`}
        label={<FormattedMessage id="liquid.amount" defaultMessage="Amount [ml]" />}
        rules={[
          {
            required: true,
            message: 'Please input value!',
          },
        ]}
      >
        <InputNumber
          value={props.mixData.amount}
          size="large"
          step={1}
          min={0.5}
          precision={2}
          style={{ width: '100%', maxWidth: 200 }}
          onChange={amount => {
            props.onValueChange({
              ...props.mixData,
              amount,
            });
          }}
          placeholder={formatMessage({
            id: 'liquid.amount',
            defaultMessage: 'Amount [ml]',
          })}
        />
      </FormItem>

      {props.mixData.type !== MixableType.PREMIX && (
        <FormItem
          name={`strength-${props.side}`}
          label={<FormattedMessage id="mixer.strength" defaultMessage="Strength [mg/ml]" />}
          rules={[
            {
              required: props.mixData.type !== MixableType.PREMIX,
              message: 'Please input value!',
            },
          ]}
        >
          <InputNumber
            value={props.mixData.strength}
            size="large"
            step={0.5}
            min={0}
            precision={2}
            style={{ width: '100%', maxWidth: 200 }}
            onChange={strength => {
              props.onValueChange({
                ...props.mixData,
                strength,
              });
            }}
            placeholder={formatMessage({
              id: 'mixer.strength',
              defaultMessage: 'Strength [mg/ml]',
            })}
          />
        </FormItem>
      )}
      <Col style={{ textAlign: 'center' }}>
        <VgPgRatioView
          onRatioChange={newValue => {
            props.onValueChange({
              ...props.mixData,
              ratio: 100 - newValue,
            });
          }}
          ratio={props.mixData.ratio}
        />
      </Col>
      {props.mixData.type === MixableType.LIQUID && (
        <FormItem
          name={`flavorPercentage-${props.side}`}
          label={<FormattedMessage id="mixer.flavorPercentage" defaultMessage="Flavor [%]" />}
        >
          <InputNumber
            value={props.mixData.flavorsPercentage}
            size="large"
            step={0.1}
            min={0}
            precision={2}
            style={{ width: '100%', maxWidth: 200 }}
            onChange={newValue => {
              props.onValueChange({
                ...props.mixData,
                flavorPercentage: newValue,
              });
            }}
            placeholder={formatMessage({
              id: 'mixer.flavorPercentage',
              defaultMessage: 'Flavor [%]',
            })}
          />
        </FormItem>
      )}
      <FormItem
        name={`thinner-${props.side}`}
        label={<FormattedMessage id="liquid.thinner" defaultMessage="Thinner [%]" />}
      >
        <InputNumber
          value={props.mixData.thinner}
          size="large"
          step={0.1}
          min={0}
          precision={2}
          style={{ width: '100%', maxWidth: 200 }}
          onChange={newValue => {
            props.onValueChange({
              ...props.mixData,
              thinner: newValue,
            });
          }}
          placeholder={formatMessage({
            id: 'liquid.thinner',
            defaultMessage: 'Thinner [%]',
          })}
        />
      </FormItem>
    </>
  );
}
