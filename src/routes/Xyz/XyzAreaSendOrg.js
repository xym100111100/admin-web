import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Card, Input, DatePicker, Divider, Checkbox, Col, Row, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import XyzAreaSendOrgForm from './XyzAreaSendOrgForm';
import styles from './XyzAreaSendOrg.less';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import moment from 'moment';
const { RangePicker } = DatePicker;

@connect(({ xyzareasendorg, user, sucorg, loading }) => ({ xyzareasendorg, user, sucorg, loading: loading.models.sucorg || loading.models.xyzareasendorg || loading.models.user }))
@Form.create()
export default class XyzAreaSendOrg extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'xyzareasendorg';
    this.state.areaData = {}
    this.state.areaId = 0
    this.state.logisticStatus = [1, 2, 3]
    this.state.page = {
      pageNum: 1,
      pageSize: 5,

    };
     // 默认获取当前时间和前六天的发单量
     const today = moment();
     const orderTimeEnd = today.format('YYYY-MM-DD 23:59:59');
     const orderTimeStart = today
       .clone()
       .add(-20, 'd')
       .format('YYYY-MM-DD 00:00:00');
    this.state.orderTimeEnd=orderTimeEnd;
    this.state.orderTimeStart=orderTimeStart;
  }



  //初始化
  componentDidMount() {
    this.getSendOrgs();
  }

  /**
   * 获取发货组织
   */
  getSendOrgs = () => {
    const { form } = this.props;

    let payload = {};
    payload.orgId = this.props.user.currentUser.orgId;
    payload.logisticStatus = this.state.logisticStatus;
    payload.orderTimeStart = this.state.orderTimeStart;
    payload.orderTimeEnd = this.state.orderTimeEnd;
    payload.pageNum=this.state.page.pageNum;
    payload.pageSize=this.state.page.pageSize;
    //获取表单值
    form.validateFields((err, fieldsValue) => {
      payload.orgName=fieldsValue.orgName;
    })
    this.props.dispatch({
      type: `${this.moduleCode}/listAreaSendOrgs`,
      payload: payload,
      callback: (data) => {
        this.setState({
          areaId: data.areaId,
          areaData: data,
          page:{
            pageNum:data.pageNum,
            pageSize:data.pageSize
          }
        })
      },
    });
  }

  /**
   * 添加发货组织
   */
  addSendOrg = (fields) => {
    let payload = {};
    payload.areaId = this.state.areaId;
    payload.sendOrgId = fields.sendOrg;

    this.props.dispatch({
      type: `${this.moduleCode}/add`,
      payload: payload,
      callback: (data) => {
        this.setState({ editForm: undefined });
        this.getSendOrgs()
      },
    });
  }

  /**
   *设置状态
   */
  onChange=(checkedValues)=> {
    let logisticStatus=[];
    Object.assign(logisticStatus, checkedValues);
    for (let i = 0; i < logisticStatus.length; i++) {
      if(logisticStatus[i] === '已揽收')logisticStatus[i]=1;
      if(logisticStatus[i] === '在途中')logisticStatus[i]=2;
      if(logisticStatus[i] === '已签收')logisticStatus[i]=3;
      if(logisticStatus[i] === '问题件')logisticStatus[i]=4;
      if(logisticStatus[i] === '无轨迹')logisticStatus[i]=0;
    }
    this.setState({
      logisticStatus
    },()=>{
      this.getSendOrgs()
    })
  }

  /**
   * 点击选择到一个日期时
   */
  handelRangePickerCalendarChange = dates => {
    if (dates.length == 1) {
      this.selectedFirstDate = dates[0];
    } else {
      this.selectedFirstDate = undefined;
    }
  };

  /**
   * 设置禁止选择的日期
   */
  disabledDate = current => {
    if (this.selectedFirstDate) {
      const diff = current.diff(this.selectedFirstDate, 'd');
      // 相差不能超过30天
      if (diff > 30 || diff < -30) {
        return true;
      }
    }

    // 不能选择今天之后
    return current.isAfter(moment().endOf('day'));
  };

  /**
   * 根据改变的日期查询发单量
   */
  handelRangePickerChange = dates => {
    const orderTimeStart = dates[0].format('YYYY-MM-DD 00:00:00');
    const orderTimeEnd = dates[1].format('YYYY-MM-DD 23:59:59');
    this.setState({
      orderTimeStart,
      orderTimeEnd
    },()=>{
      this.getSendOrgs()
    })
  };

    //改变页数查询
    handleTableChange = pagination => {
      const pager = { ...this.state.pagination };
      pager.current = pagination.current;
      this.setState({
        page: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
        },
      },()=>{
        this.getSendOrgs();
      });

    }

  renderSearchForm = () => {
    const { getFieldDecorator } = this.props.form;
    const plainOptions = ['已揽收', '在途中', '已签收', '问题件', '无轨迹'];
    const today = moment();
    const orderTimeEnd = today.format('YYYY-MM-DD');
    const orderTimeStart = today
      .clone()
      .add(-20, 'd')
      .format('YYYY-MM-DD');

    const dateFormat = 'YYYY-MM-DD';

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
        <Col md={5} sm={24}>
          <FormItem label="">
            {getFieldDecorator('orgName')(<Input placeholder="组织名称" />)}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <RangePicker
            defaultValue={[ moment(orderTimeStart, dateFormat),moment(orderTimeEnd, dateFormat)]}
            allowClear={false}
            disabledDate={this.disabledDate}
            onCalendarChange={this.handelRangePickerCalendarChange}
            onChange={this.handelRangePickerChange}
            placeholder={['统计开始日期', '统计结束日期']}
          />
        </Col>
        <Col md={8} sm={24} >
          <div  >
            <CheckboxGroup options={plainOptions} defaultValue={['已揽收', '在途中', '已签收']} onChange={this.onChange} />
          </div>
        </Col>
        <Col md={4} sm={24} >
        </Col>
        <Col style={{ textAlign: 'right' }} md={24} sm={24}>
          <p style={{ fontSize: 18 }} >{this.state.areaData.areaName}总发单量：{this.state.areaData.allCount}</p>
        </Col>
      </Row>

    )
  }




  render() {
    const { xyzareasendorg:{ xyzareasendorg },  loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;

    let ps;
    if (this.state.areaData.pageSize === undefined ) {
      ps = 5;
    } else {
      ps = this.state.areaData.pageSize;
    }
    let tl;
    if (this.state.areaData.total ===undefined) {
      tl = 1;
    } else {
      tl = Number(this.state.areaData.total);
    }


    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };

    const columns = [
      {
        title: '发货组织名称',
        dataIndex: 'orgName',
      },
      {
        title: '发单量',
        dataIndex: 'count',
      },
    ];



    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.showAddForm({ editForm: 'sendOrg', editFormTitle: '添加发货组织' })}
                >
                  添加
                </Button>
                <Divider type="vertical" />
                <Button type="primary" icon="submit" onClick={() => this.getSendOrgs()}>
                  查询
              </Button>
              </div>
              {this.renderSearchForm()}
              <Table
               rowKey="id"
               pagination={false}
               loading={loading}
               dataSource={this.state.areaData.sendOrg}
               columns={columns}
               pagination={paginationProps}
               onChange={this.handleTableChange}
               />
            </div>
          </Card>
        </PageHeaderLayout>,
        {editForm === 'sendOrg' && (
          <XyzAreaSendOrgForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={(fields) => this.addSendOrg(fields)}
          />
        )}
      </Fragment>
    );
  }
}
