import SimpleMng from 'components/Rebue/SimpleMng';

import React from 'react';
import { connect } from 'dva';
import { Row, Col, message, Form, DatePicker, Card, Select, Radio } from 'antd';
// 引入 ECharts 主模块,报错需要使用命令来安装echarts
import echarts from 'echarts/lib/echarts';

// 引入柱状图(其他图例按照以下方法引入就行)
import 'echarts/lib/chart/bar';
// 引入线状图
import 'echarts/lib/chart/line';

const { MonthPicker, WeekPicker, RangePicker } = DatePicker;

// 引入提示框和标题组件和图例
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
// 引入时间处理插件
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RepRevenue.less';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
@Form.create()
@connect(({ reprevenue, slrshop, user, loading }) => ({
    reprevenue,
    user,
    slrshop,
    loading: loading.models.reprevenue
}))
export default class RepRevenue extends SimpleMng {
    constructor(props) {
        super(props);
        const { user: { currentUser: { orgId } } } = props;
        // 查询报表的model名称
        this.moduleCode = 'reprevenue';
        this.state.selectRevenuePattern = 1;// 1:是日报2：周报3：月报4：年报
        this.state.isOpen = false;
        this.state.currentShop = {};
        this.state.shopData = [];
        this.state.revenueDate = [];
        this.state.revenueData = [];
        this.state.baseRevenueDate = [moment(), moment()];
        this.state.baseWeekRevenueDate = moment();
    }

    componentDidMount() {
        this.initRevenueData();
        this.getOrgShop();
    }


    componentDidUpdate() {
        this.initRevenueData();
    }


    /**
     * 获取组织下的店铺,成功后再获取第一个店铺的营收日报
     */
    getOrgShop() {
        this.props.dispatch({
            type: 'slrshop/shopList',
            payload: {},
            callback: (data) => {
                if (data.length > 0) {
                    this.setState({
                        currentShop: data[0],
                        shopData: data
                    }, () => {
                        this.onDayOk([new moment().subtract(10, 'days'), new moment()]);
                    })

                }
            },
        });
    }



    /**
     *  初始化营收数据
     */
    initRevenueData() {
        const { revenueDate, revenueData } = this.state;
        let myChart = echarts.init(this.refs.revenueDom);
        // 指定图表的配置项和数据
        let option = {
            tooltip: {
            },
            xAxis: {
                type: 'category',
                data: revenueDate,
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: revenueData,
                type: 'line',
                itemStyle: {
                    normal: {
                        label: {
                            show: true, // 开启显示
                            position: 'top', // 在上方显示
                            textStyle: {
                                // 数值样式
                                color: 'black',
                                fontSize: 14,
                            },
                        },
                    },
                },
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    setSelectRevenuePattern = (value) => {
        if (value === 2) {
            this.setState({
                baseWeekRevenueDate: new moment(),
                selectRevenuePattern: value
            }, () => {
                this.handleChangeOfWeek(new moment());
            })

        } else {
            if (value === 1) {
                this.setState({
                    baseRevenueDate: [new moment().subtract(10, 'days'), new moment()],
                    selectRevenuePattern: value
                }, () => {
                    this.onDayOk([new moment().subtract(10, 'days'), new moment()])
                })
            } else if (value === 3) {
                this.setState({
                    baseRevenueDate: [new moment().subtract(10, 'month'), new moment()],
                    selectRevenuePattern: value
                }, () => {
                    this.onMonthOk([new moment().subtract(10, 'month'), new moment()])
                })
            } else if (value === 4) {
                this.setState({
                    baseRevenueDate: [new moment(), new moment()],  // 这里不减是因为前面的年是没有数据的
                    selectRevenuePattern: value
                }, () => {
                    this.onYearOk([new moment(), new moment()])  // 这里不减是因为前面的年是没有数据的
                })
            }



        }

    }



    // -------------------这里是控制年报的方法------------------------------------

    handleChangeOfYear = value => {
        if (value[0].format('YYYY') > value[1].format('YYYY')) {
            message.error('开始年份不能大于结束年');
            return;
        }
        this.setState({
            baseRevenueDate: value,
        });
    };

    onYearOk = (value) => {
        const { currentShop } = this.state;
        if (value[0].format('YYYY') > value[1].format('YYYY')) {
            message.error('开始年份不能大于结束年');
            return;
        }
        if (value[0].format('YYYY') < 2019 || value[1].format('YYYY') < 2019) {
            message.error('不能选择查询2019年之前的数据');
            return;
        }
        this.setState({
            isOpen: false,
        })

        this.props.dispatch({
            type: 'reprevenue/listRevenueOfYear',
            payload: {
                shopId: currentShop.id,
                revenueStartTime: value[0].format('YYYY-MM-DD'),
                revenueEndTime: value[1].format('YYYY-MM-DD')
            },
            callback: (result) => {
                const revenueDate = [];
                const revenueData = [];
                result.map((item) => {
                    revenueDate.push(item.revenueTime.substr(0, 4))
                    revenueData.push(item.total);
                })
                this.setState({
                    revenueDate,
                    revenueData
                })
            },
        });


    }



    // -------------------这里是控制月报的方法------------------------------------

    handleChangeOfMonth = value => {
        this.setState({
            baseRevenueDate: value
        });
    };

    onMonthOk = (value) => {
        const { currentShop } = this.state;
        if (value[0].format('YYYY') < 2019 || value[1].format('YYYY') < 2019) {
            message.error('不能选择查询2019年之前的数据');
            return;
        }
        this.setState({
            isOpen: false,
        });
        this.props.dispatch({
            type: 'reprevenue/listRevenueOfMonth',
            payload: {
                shopId: currentShop.id,
                revenueStartTime: value[0].format('YYYY-MM-DD'),
                revenueEndTime: value[1].format('YYYY-MM-DD')
            },
            callback: (result) => {
                const revenueDate = [];
                const revenueData = [];
                result.map((item) => {
                    revenueDate.push(item.revenueTime.substr(0, 7))
                    revenueData.push(item.total);
                })
                this.setState({
                    revenueDate,
                    revenueData
                })
            },
        });
    }

    // -------------------这里是控制周报的方法------------------------------------

    handleChangeOfWeek = value => {
        const { currentShop } = this.state;
        console.log(value.format('YYYY-MM-DD'))
        if (value.format('YYYY') < 2019) {
            message.error('不能选择查询2019年之前的数据');
            return;
        }
        this.setState({
            baseWeekRevenueDate: value
        });

        this.props.dispatch({
            type: 'reprevenue/listRevenueOfWeek',
            payload: {
                shopId: currentShop.id,
                revenueTime: value.format('YYYY-MM-DD'),
            },
            callback: (result) => {
                const revenueDate = [];
                const revenueData = [];
                result.map((item) => {
                    revenueDate.push(item.revenueTime)
                    revenueData.push(item.total);
                })
                this.setState({
                    revenueDate,
                    revenueData
                })
            },
        });


    };

    // -------------------这里是控制日报的方法------------------------------------

    handleChangeOfDay = value => {
        this.setState({
            baseRevenueDate: value
        });
    };


    onDayOk = (value) => {
        const { currentShop } = this.state;
        if (value[0].format('YYYY') < 2019 || value[1].format('YYYY') < 2019) {
            message.error('不能选择查询2019年之前的数据');
            return;
        }
        this.setState({
            baseRevenueDate: value
        });
        this.props.dispatch({
            type: 'reprevenue/listRevenueOfDay',
            payload: {
                shopId: currentShop.id,
                revenueStartTime: value[0].format('YYYY-MM-DD'),
                revenueEndTime: value[1].format('YYYY-MM-DD')
            },
            callback: (result) => {
                const revenueDate = [];
                const revenueData = [];
                result.map((item) => {
                    revenueDate.push(item.revenueTime.substr(5))
                    revenueData.push(item.total);
                })
                this.setState({
                    revenueDate,
                    revenueData
                })
            },
        });
    }


    /**
     * 渲染搜索表单
     */
    renderSearchForm() {
        const { getFieldDecorator } = this.props.form;
        const { shopData, currentShop, selectRevenuePattern } = this.state;

        const listItems = shopData.map(items => {
            return (
                <Option value={items.id} key={items.id.toString()}>
                    {items.shopName}
                </Option>
            );

        });

        return (
            <Form layout="inline" hideRequiredMark>
                <Row gutter={{ md: 6, lg: 24, xl: 0 }} style={{ marginBottom: '20px' }}   >
                    <Col md={12} sm={24}>

                        <Select
                            placeholder="没有店铺"
                            style={{ width: '236px' }}
                            onChange={this.selectShop}
                            value={currentShop.id}
                        >
                            {listItems}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                    <Col md={12} sm={24}>
                        <FormItem   >
                            <RadioGroup value={selectRevenuePattern} style={{ width: 360 }} >
                                <RadioButton
                                    onClick={() => this.setSelectRevenuePattern(4)}
                                    value={4}>
                                    年报
                                     </RadioButton>
                                <RadioButton
                                    onClick={() => this.setSelectRevenuePattern(3)}
                                    value={3}>
                                    月报
                                      </RadioButton>
                                <RadioButton
                                    onClick={() => this.setSelectRevenuePattern(2)}
                                    value={2}>
                                    周报
                                     </RadioButton>
                                <RadioButton
                                    onClick={() => this.setSelectRevenuePattern(1)}
                                    value={1}>
                                    日报
                                     </RadioButton>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                {this.revenuePattern()}
            </Form>
        );
    }

    /**
     * 选择店铺
     */
    selectShop = (value) => {
        const { shopData } = this.state;
        shopData.map((item) => {
            if (item.id === value) {
                this.setState({
                    currentShop: item,
                    selectRevenuePattern: 1
                }, () => {
                    this.onDayOk([new moment().subtract(10, 'days'), new moment()]);
                })
            }
        })


    }

    revenuePattern = () => {
        const { baseRevenueDate, baseWeekRevenueDate, isOpen } = this.state;

        if (this.state.selectRevenuePattern === 3) {
            return (
                <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                    <Col push={7} md={12} sm={24}>
                        <RangePicker
                            placeholder={"选择月份"}
                            value={baseRevenueDate}
                            allowClear={false}
                            mode={['month', 'month']}
                            onPanelChange={this.handleChangeOfMonth}
                            format="YYYY-MM"
                            showTime={{ format: 'YYYY-MM' }}
                            onOk={this.onMonthOk}
                            open={isOpen}
                            onFocus={() => this.setState({ isOpen: true })}
                            onBlur={() => this.setState({ isOpen: false })}
                        />
                    </Col>
                </Row>
            )
        } else if (this.state.selectRevenuePattern === 4) {
            return (
                <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                    <Col push={7} md={12} sm={24}>
                        <RangePicker
                            placeholder="请选择年份"
                            mode={['year', 'year']}
                            onPanelChange={this.handleChangeOfYear}
                            value={baseRevenueDate}
                            format="YYYY"
                            allowClear={false}
                            open={isOpen}
                            onFocus={() => this.setState({ isOpen: true })}
                            onBlur={() => this.setState({ isOpen: false })}
                            onOk={this.onYearOk}
                            showTime={{ format: 'YYYY' }}
                        />
                    </Col>
                </Row>
            )
        } else if (this.state.selectRevenuePattern === 1) {
            return (
                <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                    <Col push={7} md={12} sm={24}>
                        <RangePicker
                            placeholder={'选择天'}
                            value={baseRevenueDate}
                            allowClear={false}
                            format="YYYY-MM-DD"
                            showTime={{ format: 'YYYY-MM-DD' }}
                            onOk={this.onDayOk}
                            onChange={this.handleChangeOfDay}
                        />


                    </Col>
                </Row>
            )

        } else if (this.state.selectRevenuePattern === 2) {
            return (
                <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                    <Col push={10} md={12} sm={24}>
                        <WeekPicker
                            value={baseWeekRevenueDate}
                            placeholder={'选择周'}
                            allowClear={false}
                            onChange={this.handleChangeOfWeek}
                        />
                    </Col>
                </Row>
            )
        }

    }


    render() {
        const { loading } = this.props;

        return (
            <PageHeaderLayout>
                <Card bordered={false}>
                    <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
                    <div style={{ background: 'white' }}>
                        <Row gutter={{ md: 1, lg: 4, xl: 2 }}>
                            <Col md={24} sm={24}>
                                <div style={{ width: 900, height: 500, margin: '0 auto', }} ref="revenueDom" >

                                </div>

                            </Col>
                        </Row>
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
