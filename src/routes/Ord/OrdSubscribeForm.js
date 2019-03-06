import React, { Fragment, PureComponent } from 'react';
import { Form, Button, List, Row, Col, Input } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './OrdOrder.less';
import { connect } from 'dva';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ kdisender, kdicompany, ordorder, user, loading }) => ({
    kdisender, user, ordorder, kdicompany,
    loading: loading.models.kdisender || loading.models.user || loading.models.ordorder || loading.models.kdicompany
}))
@EditForm
export default class OrdSubscribeForm extends PureComponent {

    state = {
        receiverInfo: '', //收件人信息
        orderMessages: '', //订单留言
        loading: false,
        hasMore: true,

        kdicompany: [],//快递公司数据集合
        selectCompany: [],//选择的快递公司，用于提交

        sendData: [],//发件人数据集合
        selectSend: [],//选择的发件人,用于提交

    }

    componentDidMount() {
        this.initDetailData();
    }

    /**
     * 提交前事件
     */
    beforeSave = () => {
        const { form } = this.props;
        form.getFieldDecorator('selectCompany');
        form.getFieldDecorator('selectSend');
        form.setFieldsValue({
            selectCompany: this.state.selectCompany,
            selectSend: this.state.selectSend,
        });
    }


    /**
     * 这里只是为了页面不出现警告
     */
    handleInfiniteOnLoad = () => { };

    /**
     * 初始化
     */
    initDetailData = () => {
        const { user, record } = this.props;
        const orgId = user.currentUser.orgId;
        this.setState({
            receiverInfo: record,
            orderMessages: record.orderMessages,
        })
        //获取发件人
        this.props.dispatch({
            type: `kdisender/list`,
            payload: { orgId: orgId },
            callback: data => {
                for (let i = 0; i < data.length; i++) {
                    //设置默认发件人id和默认选中发件人以便后面修改
                    if (data[i].isDefault) {
                        this.setState({
                            selectSend: data[i],
                        })
                    }
                }
                this.setState({
                    sendData: data,
                })
            }
        });
        //获取快递公司
        this.props.dispatch({
            type: `kdicompany/list`,
            payload: { orgId: orgId },
            callback: data => {
                for (let i = 0; i < data.length; i++) {
                    //设置默认快递公司id以便后面修改
                    if (data[i].isDefault) {
                        this.setState({
                            selectCompany: data[i],
                        })
                    }
                }
                this.setState({
                    kdicompany: data,
                })
            }
        });
    }

    


    /**
     * 根据传过来的i设置选择的快递公司或者发件人相关状态
     */
    setDefultId = (item, i) => {
        if (i === 1) {
            this.setState({
                selectCompany: item,
            })
        } else if (i === 2) {
            this.setState({
                selectSend: item,
            })
        }
    }

    render() {
        const data = this.state.kdicompany;
        const data2 = this.state.sendData;
        const { form, record } = this.props;

        return (
            <Fragment>
                <Form layout="vertical">
                    <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                    <Col >
                            <FormItem label="快递单号">
                                {form.getFieldDecorator('expressNumber', {
                                    rules: [{ required: true, message: '请输入快递单号' }, { pattern: /^[0-9]*$/, message: '请输入正确的快递单号' }],
                                    initialValue: record.expressNumber,
                                })(<Input placeholder='请输入快递单号' />)}
                            </FormItem>
                        </Col>
                        <Col md={9} sm={24} >
                            <p>请选择快递公司</p>

                            <div className={styles.ordSendForm}>
                                <InfiniteScroll
                                    loadMore={this.handleInfiniteOnLoad}
                                    initialLoad={false}
                                    pageStart={0}
                                    hasMore={!this.state.loading && this.state.hasMore}
                                    useWindow={false}
                                >
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={data}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={<a >{item.companyName}</a>}

                                                />
                                                {this.state.selectCompany.id === item.id ? (
                                                    <a style={{ float: 'right', marginTop: -15, }} >已选择</a>
                                                ) : (
                                                        <Button size="small" onClick={() => this.setDefultId(item, 1)} >
                                                            选择
                                                    </Button>
                                                    )}
                                            </List.Item>
                                        )}
                                    />
                                </InfiniteScroll>
                            </div>
                        </Col>
                        <Col md={15} sm={24} >
                            <p>请选择发件人</p>
                            <div className={styles.ordSendForm}>
                                <InfiniteScroll
                                    loadMore={this.handleInfiniteOnLoad}
                                    initialLoad={false}
                                    pageStart={0}
                                    hasMore={!this.state.loading && this.state.hasMore}
                                    useWindow={false}
                                >
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={data2}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={<a >{item.senderName + '·' + item.senderMobile}</a>}
                                                />
                                                {this.state.selectSend.id === item.id ? (
                                                    <a style={{ float: 'right', marginTop: -15, }} >已选择</a>
                                                ) : (
                                                        <Button size="small" onClick={() => this.setDefultId(item, 2)} >
                                                            选择
                                                    </Button>
                                                    )}
                                            </List.Item>
                                        )}
                                    />
                                </InfiniteScroll>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        )
    }
}
