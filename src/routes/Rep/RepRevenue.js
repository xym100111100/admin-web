import SimpleMng from 'components/Rebue/SimpleMng';

import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, DatePicker, Card, Select, Radio } from 'antd';
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
        this.state.dateValue = moment();
        this.state.isopen = false;
        this.state.currentShop = {};
        this.state.shopData = [];
        this.state.revenueDate = [];
        this.state.revenueData = [];
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
                console.log(data)
                if (data.length > 0) {
                    this.setState({
                        currentShop: data[0],
                        shopData: data
                    }, () => {
                        this.handleChangeOfDay(new moment());
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
        this.setState({
            dateValue: new moment()
        })
        this.setState({
            selectRevenuePattern: value
        })
    }

    // -------------------这里是控制年报的方法------------------------------------

    handleChangeOfYear = value => {
        console.log(value.format('YYYY-MM-DD'))
        this.setState({
            dateValue: value,
            isopen: false   // 注意这里的区别，是因为ant里面的问题，这个类型为年的组件还没完善。
        });
    };

    // -------------------这里是控制月报的方法------------------------------------

    handleChangeOfMonth = value => {
        console.log(value.format('YYYY-MM-DD'))
        this.setState({
            dateValue: value
        });
    };

    // -------------------这里是控制周报的方法------------------------------------

    handleChangeOfWeek = value => {
        console.log(value.format('YYYY-MM-DD'))
        this.setState({
            dateValue: value
        });
    };

    // -------------------这里是控制日报的方法------------------------------------

    handleChangeOfDay = value => {
        const { currentShop } = this.state;
        console.log(value.format('YYYY-MM-DD'))
        console.log(currentShop)
        this.setState({
            dateValue: value
        });

        this.props.dispatch({
            type: 'reprevenue/listRevenueOfDay',
            payload: {
                shopId: '583124897568522240',
                revenueTime: value.format('YYYY-MM-DD')
            },
            callback: (result) => {
                console.log(result)
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
    };

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
        console.log(value)
        shopData.map((item) => {
            if (item.id === value) {
                this.setState({
                    currentShop: item,
                    selectRevenuePattern: 1
                }, () => {
                    this.handleChangeOfDay(new moment());
                })
            }
        })


    }

    revenuePattern = () => {
        const { dateValue, isopen } = this.state;

        if (this.state.selectRevenuePattern === 3) {
            return (
                <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                    <Col push={10} md={12} sm={24}>
                        <MonthPicker
                            placeholder={"选择月份"}
                            value={dateValue}
                            allowClear={false}
                            onChange={this.handleChangeOfMonth}
                        />
                    </Col>
                </Row>
            )
        } else if (this.state.selectRevenuePattern === 4) {
            return (
                <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                    <Col push={10} md={12} sm={24}>
                        <DatePicker
                            placeholder="请选择年份"
                            mode="year"
                            onPanelChange={this.handleChangeOfYear}
                            value={dateValue}
                            format="YYYY"
                            allowClear={false}
                            open={isopen}
                            onFocus={() => { this.setState({ isopen: true }) }}

                        />
                    </Col>
                </Row>
            )
        } else if (this.state.selectRevenuePattern === 1) {
            return (
                <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                    <Col push={10} md={12} sm={24}>
                        <DatePicker
                            placeholder={'选择天'}
                            value={dateValue}
                            allowClear={false}
                            onChange={this.handleChangeOfDay} />

                    </Col>
                </Row>
            )

        } else if (this.state.selectRevenuePattern === 2) {
            return (
                <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                    <Col push={10} md={12} sm={24}>
                        <WeekPicker
                            value={dateValue}
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
                                <div style={{ width: 700, height: 500, margin: '0 auto', }} ref="revenueDom" >

                                </div>

                            </Col>
                        </Row>
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
