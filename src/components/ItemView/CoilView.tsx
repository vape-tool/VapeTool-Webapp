import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Card, Typography, Descriptions } from 'antd';
import { ItemName, Coil } from '@/types';
import { getCoilUrl } from '@/services/storage';
import { WireType } from '@vapetool/types/dist/wire';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ItemView, ItemViewProps, ItemViewState } from './ItemView';
import styles from './styles.less';

interface CoilViewState extends ItemViewState {
  coilImageUrl: string;
}

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

class CoilView extends ItemView<Coil, ItemViewProps<Coil>, CoilViewState> {
  what: ItemName = ItemName.COIL;

  componentDidMount(): void {
    super.componentDidMount();
    this.fetchCoilImage();
  }

  fetchCoilImage = async () => {
    const coilImageUrl = await getCoilUrl(this.props.item.uid);
    if (coilImageUrl) {
      this.setState({ coilImageUrl });
    }
  };

  render() {
    const { item } = this.props;
    const { displayComments, coilImageUrl } = this.state;

    return (
      <>
        <Card
          className={styles.card}
          cover={
            !coilImageUrl ?? (
              <img
                onClick={this.onSelectItem}
                style={{ objectFit: 'cover', maxHeight: 714 }}
                alt={item.description}
                src={coilImageUrl}
              />
            )
          }
        >
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
                <FormattedMessage
                  id="coilCalculator.inputs.resistance"
                  defaultMessage="Resistance"
                />
              }
            >
              {Math.round(item.resistance * 1000) / 1000}
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

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(CoilView);
