import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Card, Typography, Descriptions, Button, Dropdown, Menu } from 'antd';
import { ItemName, Coil } from '@/types';
import { getCoilUrl } from '@/services/storage';
import { WireType } from '@vapetool/types/dist/wire';
import { DownOutlined } from '@ant-design/icons';
import { ItemView, ItemViewProps, ItemViewState } from './ItemView';
import styles from './styles.less';

interface CoilViewState extends ItemViewState {
  coilImageUrl: string;
  modalVisible: any;
}

enum Tuple {
  Single = 1,
  Dual = 2,
  Triple = 3,
  Quad = 4,
}

class CoilView extends ItemView<Coil, ItemViewProps<Coil>, CoilViewState> {
  private dropdownMenu: any;

  private isOwner: boolean = false;

  what: ItemName = ItemName.COIL;

  componentDidMount(): void {
    super.componentDidMount();
    this.fetchCoilImage();
    this.state = {
      ...this.state,
      modalVisible: false,
    };
    this.isOwner = this.props.user?.uid === this.props.item.author.uid;

    this.dropdownMenu = (
      <Menu>
        <Menu.Item key="1" disabled={!this.isOwner}>
          Edit
        </Menu.Item>
        <Menu.Item key="2" disabled={!this.isOwner}>
          Remove
        </Menu.Item>
      </Menu>
    );
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
          <div
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
            }}
          >
            <Dropdown overlay={this.dropdownMenu}>
              <Button>
                More <DownOutlined />
              </Button>
            </Dropdown>
          </div>
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
            <Descriptions.Item label="Setup">
              {Tuple[item.setup]} Coil({item.setup})
            </Descriptions.Item>
            <Descriptions.Item label="Wraps">{item.wraps}</Descriptions.Item>
            <Descriptions.Item label="Wire type">{WireType[item.type]}</Descriptions.Item>
            <Descriptions.Item label="Resistance[Ω]">{item.resistance}</Descriptions.Item>
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
