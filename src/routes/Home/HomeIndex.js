import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Col, Row, Card, Calendar, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DeliveryProcess from './DeliveryProcess'
import CashWithdrawal from './CashWithdrawal'

import {
  ChartCard,
} from 'components/Charts';

@Form.create()
@connect(({ homeindex, user, loading, ordorder }) => ({
  homeindex, user, ordorder, loading: loading.models.homeindex || loading.models.user
    || loading.models.ordorder
}))
export default class HomeIndex extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'homeindex';
    this.state.currentUserName = '';
    this.state.unshipmentsNumber = 0;
  }


  componentDidMount() {
    const { roles} = this.props.user;
    for (let i = 0; i < roles.length; i++) {
      if(roles[i].indexPath !=='' && roles[i].indexPath !==undefined){
          window.location.href=roles[i].indexPath;
          break;
      }
    }
    this.setState({
      currentUserName: this.props.user.currentUser.nickname,
    })
    this.unshipments();
  }

  unshipments = () => {
    if (this.props.user.currentUser.orgId !== undefined && this.props.user.currentUser.orgId !== null) {
      this.props.dispatch({
        type: `ordorder/getUnshipmentsByDeliverOrgId`,
        payload: { deliverOrgId: this.props.user.currentUser.orgId },
        callback: data => {
          this.setState({
            unshipmentsNumber: data
          })
        }
      });
    }

  }

  deliveryProcess = () => {
    this.showEditForm({
      editForm: 'deliveryProcess',
      editFormTitle: '发货流程',
    })
  }
  cashWithdrawal = () => {
    this.showEditForm({
      editForm: 'cashWithdrawal',
      editFormTitle: '提现时间及流程',
    })
  }

  render() {
    const { homeindex: { homeindex }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 8,
      style: { marginBottom: 24 },
    };

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
              <Col style={{ textAlign: 'center' }} md={24} sm={24}>
                <h2>{this.state.currentUserName} 欢迎您登录大卖后台</h2>
              </Col>
            </Row>
          </Card>
          <br />
          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="常见问题"
                style={{ height: 362 }}
                contentHeight={170}
              >
              <div  >
                <a style={{ fontSize: 20 }} onClick={() => this.deliveryProcess()}>发货流程说明</a>
                <br />
                <a style={{ fontSize: 20 }} onClick={() => this.cashWithdrawal()}>提现时间及流程说明</a>
                </div>
              </ChartCard>
            </Col>

            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="未发货的订单"
                contentHeight={170}
                style={{ height: 362 }}
              >
                <div  style={{ fontSize: 30, textAlign: 'center' }}>
                  <a href="#/sup/sup-order">
                    <span style={{ fontWeight: 'bold', fontSize: 50 }}>
                      {this.state.unshipmentsNumber}
                    </span>
                    个订单等待发货
                  </a>
                </div>
              </ChartCard>
            </Col>

            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="更新通知 : 2019-03-12"
                style={{ height: 362,}}
              >
              <div >
               <p style={{color:'red'}} >发货流程已经修改，请各用户再仔细浏览一次发货流程说明！！！</p>
               <a></a>
               </div>
              </ChartCard>
            </Col>
          </Row>
        </PageHeaderLayout>
        {editForm === 'deliveryProcess' && (
          <DeliveryProcess
            id={editFormRecord.id}
            visible
            width={1200}
            title={editFormTitle}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
        {editForm === 'cashWithdrawal' && (
          <CashWithdrawal
            id={editFormRecord.id}
            visible
            width={1200}
            title={editFormTitle}
            editFormType={editFormType}
            closeModal={() => this.setState({ editForm: undefined })}
          />
        )}
      </Fragment>
    );
  }
}
