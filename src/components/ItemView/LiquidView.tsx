import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Card, Descriptions, Typography } from 'antd';
import { ItemName, Liquid } from '@/types';
import { FormattedMessage } from '@umijs/preset-react';

import { ItemView, ItemViewProps, ItemViewState } from './ItemView';
import styles from './styles.less';

interface LiquidViewState extends ItemViewState {
  item: Liquid;
}

class LiquidView extends ItemView<Liquid, ItemViewProps<Liquid>, LiquidViewState> {
  what: ItemName = ItemName.LIQUID;

  render() {
    const { item } = this.props;
    const { displayComments } = this.state;

    return (
      <>
        <Card className={styles.card} hoverable>
          <Card.Meta
            title={
              <span onClick={this.onSelectItem}>
                <Typography.Text>{item.name}</Typography.Text>
              </span>
            }
            description={
              <span onClick={this.onSelectItem}>
                <Typography.Text>{item.description}</Typography.Text>
              </span>
            }
          />

          <Descriptions>
            <Descriptions.Item
              label={<FormattedMessage id="liquid.vg/pg" defaultMessage="VG/PG" />}
            >
              {100 - item.targetRatio}/{item.targetRatio}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <FormattedMessage
                  id="liquid.nicotineStrength"
                  defaultMessage="Nicotine strength [mg/ml]"
                />
              }
            >
              {item.targetStrength}mg/ml
            </Descriptions.Item>
            <Descriptions.Item
              label={<FormattedMessage id="liquid.amount" defaultMessage="Amount [ml]" />}
            >
              {item.amount}ml
            </Descriptions.Item>
          </Descriptions>
          <this.Actions />
          {displayComments && displayComments.length > 0 && <this.CommentsList />}
          <this.CommentInput />
        </Card>
      </>
    );
  }
}

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(LiquidView);
