import React, { useEffect, useState } from 'react';
import { Icon, Input, Tag } from 'antd';
import styles from './styles.less';

interface UserCardProps {
  isCurrentUser: boolean;
  userTags: Array<{ key: string; label: string }>;
}

const UserTags: React.FC<UserCardProps> = ({ isCurrentUser, userTags }) => {
  const [tags, setTags] = useState([] as { key: string; label: string }[]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  let input: Input | null | undefined;

  const showInput = () => {
    setInputVisible(true);
  };

  // focus input if it just appeared
  useEffect(() => {
    if (input && inputVisible) {
      input.focus();
    }
  }, [inputVisible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let newTags = [...tags];
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }

    setTags(newTags);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className={styles.tags}>
      <span className={styles.tagsTitle}>Labels:</span>
      {userTags.concat(tags).map(item => (
        <Tag key={item.key}>{item.label}</Tag>
      ))}

      {isCurrentUser && inputVisible && (
        <Input
          ref={ref => {
            input = ref;
          }}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}

      {isCurrentUser && !inputVisible && (
        <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
          <Icon type="plus" />
        </Tag>
      )}
    </div>
  );
};

export default UserTags;
