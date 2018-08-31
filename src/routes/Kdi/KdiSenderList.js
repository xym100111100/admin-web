import React, { PureComponent } from 'react';
import { List, Avatar, Radio, Spin, Button, Card, Tooltip, Icon } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'dva';
const RadioGroup = Radio.Group;
import styles from './KdiSenderList.less';

@connect(({ kdisender, user, loading }) => ({ kdisender, user, loading: loading.models.kdisender }))
export default class KdiSenderList extends PureComponent {
  constructor() {
    super();
  }

  state = {
    value: 1,
    data: [],
    loading: false,
    hasMore: true,
  };

  componentDidMount() {
    this.handleReload();
  }

  handleReload() {
    const { user } = this.props;
    // let orgId = user.currentUser.orgId;
    let orgId = '253274870';
    this.props.dispatch({
      type: `kdisender/listSenderByOrgId`,
      payload: { orgId: orgId },
      callback: data => {
        data.forEach((item, index) => {
          item.senderaddr = [item.senderProvince, item.senderCity, item.senderExpArea];
        });
        this.state.data = data;
        this.setState(this.state);
      },
    });
  }

  setDefaulSender = item => {
    const payload = item;
    this.props.dispatch({
      type: 'kdisender/setDefaultSender',
      payload,
      callback: () => {
        this.handleReload();
      },
    });
    // this.handleReload();
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
    this.selectRow(e.target.value);
  };

  selectRow = record => {
    const payload = record;
    // 刷新寄件人信息
    this.props.dispatch({
      type: `kdisender/selectSender`,
      payload,
    });
  };

  /**
   * 这里只是为了页面不出现警告
   */
  handleInfiniteOnLoad = () => {};

  render() {
    const tips = this.state.data.length > 0 ? `` : `请设置常用联系人➔`;
    return (
      <Card
        title={'选择常用寄件人'}
        extra={
          <Tooltip>
            <div style={{ color: 'red', marginTop: '-6px' }}>
              {tips}
              <Tooltip title="常用寄件人配置">
                {' '}
                <a href="#/kdi/kdi-cfg/kdi-sender-cfg">
                  {<Icon type="setting" style={{ fontSize: 28, color: '#A8A8A8', marginTop: '0px' }} />}
                </a>
              </Tooltip>
            </div>
          </Tooltip>
        }
      >
        <div className={styles.senderList}>
          <InfiniteScroll
            loadMore={this.handleInfiniteOnLoad}
            initialLoad={false}
            pageStart={0}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}
          >
            <List
              itemLayout="horizontal"
              dataSource={this.state.data}
              renderItem={item => (
                <RadioGroup name="radiogroup" onChange={this.onChange} value={this.state.value}>
                  <List.Item className={styles.hover} onClick={() => this.selectRow(item)}>
                    <div style={{ width: 370, marginLeft: 20 }}>
                      <a>
                        <List.Item.Meta
                          title={item.senderName + ' ' + item.senderMobile}
                          description={
                            item.senderaddr[0] + item.senderaddr[1] + item.senderaddr[2] + item.senderAddress
                          }
                        />
                      </a>
                    </div>
                    <div>
                      {item.isDefault ? (
                        <label size="small" style={{ marginLeft: -105, fontWeight: 'bold' }}>
                          &nbsp;默 认
                        </label>
                      ) : (
                        <Button size="small" style={{ marginLeft: -110 }} onClick={() => this.setDefaulSender(item)}>
                          设为默认
                        </Button>
                      )}
                    </div>
                  </List.Item>
                </RadioGroup>
              )}
            >
              {this.state.loading &&
                this.state.hasMore && (
                  <div>
                    <Spin />
                  </div>
                )}
            </List>
          </InfiniteScroll>
        </div>
      </Card>
    );
  }
}
