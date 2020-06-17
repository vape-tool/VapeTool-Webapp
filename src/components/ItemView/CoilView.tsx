import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Card, Typography, Descriptions, Button, Dropdown, Menu, Modal } from 'antd';
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

const menu = (
  <Menu>
    <Menu.Item key="1">Edit</Menu.Item>
    <Menu.Item key="2">Remove</Menu.Item>
  </Menu>
);

class CoilView extends ItemView<Coil, ItemViewProps<Coil>, CoilViewState> {
  what: ItemName = ItemName.COIL;

  componentDidMount(): void {
    super.componentDidMount();
    this.fetchCoilImage();
    this.state = {
      ...this.state,
      modalVisible: false,
    };
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

    const handleClose = () => {
      this.setState({ modalVisible: false });
    };
    const handleOpen = () => {
      this.setState({
        modalVisible: true,
      });
    };

    return (
      <>
        <Modal
          title="More coil info"
          visible={this.state.modalVisible}
          onOk={handleClose}
          cancelButtonProps={{ hidden: true }}
        >
          <Descriptions>
            <Descriptions.Item label="Setup">
              {Tuple[item.setup]} Coil({item.setup})
            </Descriptions.Item>
            <Descriptions.Item label="Wraps">{item.wraps}</Descriptions.Item>
            <Descriptions.Item label="Wire type">{WireType[item.type]}</Descriptions.Item>
            <Descriptions.Item label="Resistance [Ω]">{item.resistance}</Descriptions.Item>
            <Descriptions.Item label="Legs length [mm]">{item.legsLength}mm</Descriptions.Item>
            <Descriptions.Item label="Inner diameter [mm]">
              {item.innerDiameter}mm
            </Descriptions.Item>
          </Descriptions>
        </Modal>
        <Card
          className={styles.card}
          hoverable
          onClick={handleOpen}
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
            <Dropdown overlay={menu}>
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
