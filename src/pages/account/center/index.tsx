import { Card, Col, Divider, Icon, Input, Row, Tag } from 'antd';
import React, { PureComponent } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RouteChildrenProps } from 'react-router';
import { connect } from 'dva';
import { User as FirebaseUser } from 'firebase/app';
import { Redirect } from 'umi';
import UserPhotos from './components/UserPhotos';
import Articles from './components/Articles';
import Applications from './components/Applications';
import { TagType } from './data.d';
import styles from './Center.less';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

const operationTabList = [
  {
    key: 'photos',
    tab: <span>Photos</span>,
  },
  {
    key: 'posts',
    tab: <span>Posts</span>,
  },
  {
    key: 'coils',
    tab: <span>Coils</span>,
  },
  {
    key: 'liquids',
    tab: <span>Liquids</span>,
  },
];

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
  firebaseUser: FirebaseUser;
  currentUserLoading: boolean;
}

interface CenterState {
  newTags: TagType[];
  tabKey: 'photos' | 'posts' | 'coils' | 'liquids';
  inputVisible: boolean;
  inputValue: string;
}

@connect(({ loading, user }: ConnectState) => ({
  currentUser: user.currentUser,
  firebaseUser: user.firebaseUser,
  currentUserLoading: loading.effects['user/fetchCurrentUser'],
  photosLoading: loading.effects['user/fetchCurrentUserPhotos'],
}))
class Center extends PureComponent<CenterProps, CenterState> {
  // static getDerivedStateFromProps(
  //   props: accountCenterProps,
  //   state: accountCenterState,
  // ) {
  //   const { match, location } = props;
  //   const { tabKey } = state;
  //   const path = match && match.path;

  //   const urlTabKey = location.pathname.replace(`${path}/`, '');
  //   if (urlTabKey && urlTabKey !== '/' && tabKey !== urlTabKey) {
  //     return {
  //       tabKey: urlTabKey,
  //     };
  //   }

  //   return null;
  // }

  state: CenterState = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
    tabKey: 'photos',
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrentUser',
    });
    dispatch({
      type: 'user/fetchCurrentUserPhotos',
    });
  }

  onTabChange = (key: string) => {
    // If you need to sync state to url
    // const { match } = this.props;
    // router.push(`${match.url}/${key}`);
    this.setState({
      tabKey: key as CenterState['tabKey'],
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input && this.input.focus());
  };

  saveInputRef = (input: Input | null) => {
    this.input = input;
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  renderChildrenByTabKey = (tabKey: CenterState['tabKey']) => {
    if (tabKey === 'photos') {
      return <UserPhotos />;
    }
    if (tabKey === 'posts') {
      return <Applications />;
    }
    if (tabKey === 'coils') {
      return <Articles />;
    }
    if (tabKey === 'liquids') {
      return <Articles />;
    }
    return null;
  };

  render() {
    const { newTags, inputVisible, inputValue, tabKey } = this.state;
    const { firebaseUser, currentUser, currentUserLoading } = this.props;
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);

    console.log(firebaseUser);
    if (!firebaseUser) {
      console.log('firebaseUser is null so redirect');
      return <Redirect to="/user/login" />;
    }
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.name}</div>
                    <div>{currentUser.signature}</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <i className={styles.title} />
                      {currentUser.title}
                    </p>
                    <p>
                      <i className={styles.group} />
                      {currentUser.group}
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                    {currentUser.tags &&
                      currentUser.tags
                        .concat(newTags)
                        .map(item => <Tag key={item.key}>{item.label}</Tag>)}
                    {inputVisible && (
                      <Input
                        ref={ref => this.saveInputRef(ref)}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" />
                      </Tag>
                    )}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                </div>
              ) : null}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
