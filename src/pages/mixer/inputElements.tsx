import React from 'react';
import { InputNumber } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import FormItem from 'antd/lib/form/FormItem';
import VgPgRatioView from '@/components/VgPgRatioView';

export default function InputElements(props: any) {
  return (
    <>
      <FormItem label={<FormattedMessage id="misc.properties.ml" defaultMessage="Amount [ml]" />}>
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
            id: 'misc.units.long.ml',
            defaultMessage: 'Amount [ml]',
          })}
        />
      </FormItem>
      <FormItem
        label={<FormattedMessage id="misc.properties.strength" defaultMessage="Strength [mg/ml]" />}
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
            id: 'misc.units.long.nicotine',
            defaultMessage: 'Strength [mg/ml]',
          })}
        />
      </FormItem>
      <VgPgRatioView
        onRatioChange={newValue => {
          props.onValueChange({
            ...props.mixData,
            ratio: 100 - newValue,
          });
        }}
        ratio={props.mixData.ratio}
      />
      <FormItem
        label={<FormattedMessage id="misc.properties.thinner" defaultMessage="Thinner [%]" />}
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
            id: 'misc.units.long.thinner',
            defaultMessage: 'Thinner [%]',
          })}
        />
      </FormItem>
    </>
  );
}
