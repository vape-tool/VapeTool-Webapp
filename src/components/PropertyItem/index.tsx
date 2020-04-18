import React, { useState } from 'react';
import { Button, InputNumber, Tag } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './styles.less';

interface PropertyItemProps {
  property: string;
  value: React.ReactNode;
  unit: string;
  proOnly?: boolean;
  editable?: boolean;
  isPro: boolean;
  onChangeValue?: (newValue?: number) => void;
}

const PropertyItem = (props: PropertyItemProps) => {
  const { property, value, unit, proOnly, isPro, editable, onChangeValue } = props;
  const displayProOnlyTag = proOnly && !isPro;

  const [editValue, setEditValue] = useState();
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    if (editable) {
      if (!isEditing) {
        const number = Number(value);
        setEditValue(Number.isFinite(number) ? number : 0);
        setIsEditing(true);
      }
    }
  };

  const onConfirm = () => {
    setIsEditing(false);

    if (onChangeValue !== undefined) {
      onChangeValue(editValue);
    }
  };

  return (
    <div className={styles.property}>
      <div className={styles.label}>
        <FormattedMessage id={`coilCalculator.properties.${property}`} />:
      </div>
      <div
        className={`${styles.value} ${displayProOnlyTag ? styles.proOnly : ''} ${
          isEditing ? styles.isEditing : ''
        }`}
      >
        {displayProOnlyTag && <Tag color="blue">Pro only</Tag>}
        {!displayProOnlyTag && value === undefined && (
          <FormattedMessage id="coilCalculator.calculationRequired" />
        )}
        {!displayProOnlyTag && value !== undefined && (
          <>
            {isEditing && (
              <InputNumber
                min={0.0}
                step={0.1}
                precision={2}
                value={editValue}
                onChange={setEditValue}
              />
            )}

            {!isEditing && (
              <span
                className={`${styles.number} ${editable ? styles.editable : ''}`}
                onClick={enableEditing}
              >
                {Number(value).toFixed(2)}
              </span>
            )}

            <span className={styles.unit}>[{unit}]</span>

            {isEditing && (
              <Button className={styles.confirmBtn} onClick={onConfirm}>
                Confirm
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyItem;
