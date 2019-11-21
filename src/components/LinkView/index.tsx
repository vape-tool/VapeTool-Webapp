import { Card, Icon, Input, List, Menu, Modal, Typography } from 'antd';
import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Link, UserPermission } from '@vapetool/types';
import Dropdown from 'antd/es/dropdown';
import Microlink from '@microlink/react'
import FirebaseImage from '@/components/StorageAvatar';
import { Comment } from '@/types/comment';
import { database, DataSnapshot, Reference } from '@/utils/firebase';
import { ConnectState } from '@/models/connect';
import CommentView from '@/components/CommentView';
import styles from './index.less';
import { CurrentUser } from '@/models/user';

interface LinkViewProps {
  link: Link;
  dispatch: Dispatch;
  displayCommentsLength: number;
  user?: CurrentUser;
}

interface LinkViewState {
  // src?: string;
  likesCount?: number;
  likedByMe?: boolean;
  commentsCount?: number;
  comment: string;
  displayComments?: Comment[];
}

class LinkView extends React.Component<LinkViewProps, LinkViewState> {
  state: LinkViewState = {
    // src: undefined,
    likesCount: undefined,
    likedByMe: undefined,
    commentsCount: undefined,
    comment: '',
    displayComments: undefined,
  };

  private inputRef?: any = undefined;

  private likesRef?: Reference = undefined;

  private commentsRef?: Reference = undefined;

  componentDidMount(): void {
    const { link } = this.props;
    // getLinkUrl(link.uid).then(src => this.setState({ src }));

    this.likesRef = database.ref('link-likes').child(link.uid);
    this.commentsRef = database.ref('link-comments').child(link.uid);

    this.listenLinkLikes();
    this.listenLinkComments();
  }

  componentWillUnmount(): void {
    if (this.likesRef) {
      this.likesRef.off();
    }
    if (this.commentsRef) {
      this.commentsRef.off();
    }
  }

  onChangeCommentText = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ comment: e.target.value });
  };

  linkComment = () => {
    this.props.dispatch({
      type: 'cloud/commentLink',
      payload: { comment: this.state.comment, linkId: this.props.link.uid },
    });
  };

  onReplyComment = (comment: Comment) => {
    this.setState({ comment: `@${comment.author.displayName.trim().replace(' ', '_')} ` });
  };

  selectItem = () =>
    this.props.dispatch({
      type: 'cloud/selectItem',
      item: this.props.link,
    });

  render() {
    const LikeIconText = ({
                            type,
                            text,
                            onClick,
                          }: {
      type: string;
      text: string;
      onClick: any;
    }) => (
      <span>
        <Icon
          onClick={onClick}
          type={type}
          theme={this.state.likedByMe ? 'filled' : 'outlined'}
          className={this.state.likedByMe ? styles.liked : ''}
          style={{ marginRight: 8 }}
        />
        {text}
      </span>
    );
    const CommentIconText = (
      {
        type,
        text,
        onClick,
      }: {
        type: string;
        text: string;
        onClick: any;
      }) => (
      <span>
        <Icon onClick={onClick} type={type} style={{ marginRight: 8 }}/>
        {text}
      </span>
    );
    const { link, dispatch, user } = this.props;
    const { likesCount, commentsCount, comment, displayComments } = this.state;

    const optionsMenu = (
      <Menu>
        <Menu.Item key="report" onClick={this.onReportClick}>
          <Icon type="flag"/>
          Report
        </Menu.Item>
        <Menu.Item key="delete" onClick={() => this.onDeleteClick(link.uid, dispatch)}
                   disabled={!user
                   || (user.uid !== link.author.uid
                     && user.permission < UserPermission.ONLINE_MODERATOR)}>
          <Icon type="delete"/>
          Delete
        </Menu.Item>
      </Menu>
    );
    return (
      <Card
        style={{ maxWidth: 614, margin: 'auto' }}
        className={styles.card}
        hoverable
        onClick={this.selectItem}
      >
        <Card.Meta
          avatar={<FirebaseImage type="user" id={link.author.uid}/>}
          title={<Typography.Text>{link.title}</Typography.Text>}
          description={<Typography.Text>{link.url}</Typography.Text>}
        />
        <br/>
        <Microlink url={link.url} lazy/>
        <List.Item
          style={{ maxWidth: 614 }}
          actions={[
            <LikeIconText
              onClick={this.onLikeClick}
              type="like-o"
              text={`${likesCount || 0}`}
              key="list-vertical-like-o"
            />,
            <CommentIconText
              onClick={this.onCommentClick}
              type="message"
              text={`${commentsCount || 0}`}
              key="list-vertical-message"
            />,
            <span>{moment(link.creationTime).fromNow()}</span>,
            <Dropdown overlay={optionsMenu}>
              <Icon type="more"/>
            </Dropdown>,
          ]}>
        </List.Item>

        {displayComments && displayComments.length > 0 && (
          <List<Comment>
            size="small"
            rowKey={item => item.uid}
            dataSource={displayComments}
            renderItem={item => (
              <CommentView
                comment={item}
                link={link}
                dispatch={dispatch}
                onReply={this.onReplyComment}
              />
            )}
          />
        )}
        <Input
          ref={ref => {
            this.inputRef = ref;
          }}
          onPressEnter={this.linkComment}
          value={comment}
          onChange={this.onChangeCommentText}
          placeholder="Add a comment..."
          suffix={<a onClick={this.linkComment}>Post</a>}
        />
      </Card>
    );
  }

  private listenLinkLikes = () =>
    this.likesRef &&
    this.likesRef.on('value', (snapshot: DataSnapshot) => {
      this.setState({ likesCount: snapshot.numChildren() });
      let likedByMe = false;
      snapshot.forEach(snap => {
        if (this.props.user !== undefined && snap.key === this.props.user.uid) {
          likedByMe = true;
        }
      });

      this.setState({ likedByMe });
    });

  private onLikeClick = () =>
    this.props.dispatch({
      type: 'cloud/likeLink',
      linkId: this.props.link.uid,
    });

  private onReportClick = () =>
    this.props.dispatch({
      type: 'cloud/reportLink',
      linkId: this.props.link.uid,
    });

  private listenLinkComments = () =>
    this.commentsRef &&
    this.commentsRef.on('value', (snapshot: DataSnapshot) => {
      const comments: Comment[] = [];
      snapshot.forEach(snap => {
        comments.push({ ...snap.val(), uid: snap.key });
      });
      this.setState({
        commentsCount: snapshot.numChildren(),
        displayComments: comments.slice(
          Math.max(comments.length - this.props.displayCommentsLength, 0),
        ),
      });
    });

  private onCommentClick = () => this.inputRef.focus();

  private onDeleteClick = (linkUid: string, dispatch: Dispatch) => {
    Modal.confirm({
      title: 'Are you sure delete this link?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'cloud/deleteLink',
          linkId: linkUid,
        });
      },
    });
  };
}

export default connect(({ user }: ConnectState) => ({ user: user.currentUser }))(LinkView);
