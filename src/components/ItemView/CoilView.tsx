import React, { useEffect, useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import { Card, Typography, Descriptions } from 'antd';
import { CurrentUser } from '@/app';
import { ItemName, Coil } from '@/types';
import { getCoilUrl } from '@/services/storage';
import { WireType } from '@vapetool/types/dist/wire';
import { Actions } from './ItemView';
import styles from './styles.less';

enum SetupsName {
  Single = 1,
  Dual = 2,
  Triple = 3,
  Quad = 4,
  Penta = 5,
  Hexa = 6,
  Hepta = 7,
  Octa = 8,
}

function useCoilImage(itemUid: string) {
  const [coilImageCoil, setCoilImageCoil] = useState<string | undefined>(undefined);
  useEffect(() => {
    getCoilUrl(itemUid).then((coilImageUrl: string | undefined) => {
      if (coilImageUrl) {
        setCoilImageCoil(coilImageUrl);
      }
    });
  }, [itemUid]);
  return coilImageCoil;
}

export default function CoilView({
  item,
  displayCommentsLength,
  currentUser,
}: {
  item: Coil;
  displayCommentsLength: number;
  currentUser: CurrentUser;
}) {
  const coilImageUrl = useCoilImage(item.uid);
  const { setSelectedItem, unselectItem } = useModel('preview');
  const onSelectItem = () => setSelectedItem(item);

  return (
    <Card
      className={styles.card}
      cover={
        !coilImageUrl ?? (
          <img
            onClick={() => setSelectedItem(item)}
            style={{ objectFit: 'cover', maxHeight: 714 }}
            alt={item.description}
            src={coilImageUrl}
          />
        )
      }
    >
      <Card.Meta
        title={
          <span onClick={onSelectItem}>
            <Typography.Text>{item.name}</Typography.Text>
          </span>
        }
        description={
          <span onClick={onSelectItem}>
            <Typography.Text>{item.description}</Typography.Text>
          </span>
        }
      />

      <Descriptions>
        <Descriptions.Item
          label={<FormattedMessage id="coilCalculator.inputs.setup" defaultMessage="Setup" />}
        >
          {SetupsName[item.setup]} Coil({item.setup})
        </Descriptions.Item>
        <Descriptions.Item
          label={<FormattedMessage id="coilCalculator.inputs.wraps" defaultMessage="Wraps" />}
        >
          {item.wraps}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <FormattedMessage id="coilCalculator.inputs.coilType" defaultMessage="Coil Type" />
          }
        >
          {WireType[item.type]}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <FormattedMessage id="coilCalculator.inputs.resistance" defaultMessage="Resistance" />
          }
        >
          {Math.round(item.resistance * 1000) / 1000}
        </Descriptions.Item>
      </Descriptions>
      <Actions
        what={ItemName.COIL}
        item={item}
        user={currentUser}
        displayCommentsLength={displayCommentsLength}
        unselectItem={unselectItem}
      />
    </Card>
  );
}
