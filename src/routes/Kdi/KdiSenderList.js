import React, { PureComponent } from 'react';
import { List, Avatar, Radio, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'dva';

const RadioGroup = Radio.Group;

@connect(({ kdisender, loading }) => ({ kdisender, loading: loading.models.kdisender }))
export default class KdiSenderList extends PureComponent {
    constructor() {
        super();
    };

    state = {
        value: 1,
        data: [],
        loading: false,
        hasMore: true,
    }

    componentDidMount() {
        this.props.dispatch({
            type: `kdisender/alllist`,
            payload: {},
            callback: data => {
                data.forEach((item,index) => {
                    item.senderaddr = [item.senderProvince,item.senderCity,item.senderExpArea]
                });
                console.info(data);
                this.state.data = data;
                this.setState(this.state);
            },
        });
    }

    handleInfiniteOnLoad = () => {
        let data = this.state.data;
        console.info('3333');
        this.setState({
            loading: true,
        });
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.getData((res) => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
            });
        });
    }

    onChange = (e) => {
        console.info(e.target.value);
        this.setState({
            value: e.target.value,
        });
        this.selectRow(e.target.value);
        console.info(this.state.value)
    };

    selectRow = (record) => {
        const payload = record;
        console.info(payload);
        // const selectedRowKeys = [...this.state.selectedRowKeys];
        // selectedRowKeys.splice(0, selectedRowKeys.length);
        // selectedRowKeys.push(record.key);
        // console.info(selectedRowKeys);
        // this.setState({ selectedRowKeys });
        console.info(this.props);
        // 刷新寄件人信息
        this.props.dispatch({
            type: `kdisender/selectSender`,
            payload,
        });
    }

    render() {

        return (
            <div>
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.data}
                        renderItem={item => (
                            <RadioGroup name="radiogroup" onChange={this.onChange} value={this.state.value}>
                                <List.Item>

                                    <div style={{ marginRight: 10, marginLeft: 10 }}>
                                        <Radio value={item}>
                                        </Radio>
                                    </div>
                                    <div style={{ width: 400 }}>
                                        <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={item.senderName + ' ' + item.senderMobile}
                                            description={item.senderaddr[0] + item.senderaddr[1] + item.senderaddr[2] + item.senderAddress}
                                        />
                                    </div>
                                </List.Item>
                            </RadioGroup>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div>
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
        )
    }
}