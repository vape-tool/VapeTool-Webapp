import React from 'react';
import { InputNumber } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import FormItem from 'antd/lib/form/FormItem';
import VgPgRatioView from '@/components/VgPgRatioView';

export default function InputElements(props: any) {
  return (
    <>
      Amount [ml]
      <FormItem>
        <InputNumber
          value={props.mixData.ml}
          size="large"
          step={1}
          min={0.5}
          precision={2}
          style={{ width: '100%', maxWidth: 200 }}
          onChange={newValue => {
            props.onValueChange({
              ...props.mixData,
              ml: newValue,
            });
          }}
          placeholder={formatMessage({
            id: 'misc.units.long.ml',
            defaultMessage: 'Amount [ml]',
          })}
        />
      </FormItem>
      Strength [mg/ml]
      <FormItem>
        <InputNumber
          value={props.mixData.mg_ml}
          size="large"
          step={0.5}
          min={0}
          precision={2}
          style={{ width: '100%', maxWidth: 200 }}
          onChange={newValue => {
            props.onValueChange({
              ...props.mixData,
              mg_ml: newValue,
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
            vgRatio: 100 - newValue,
          });
        }}
        ratio={props.mixData.vgRatio}
      />
      Thinner [%]
      <FormItem>
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
