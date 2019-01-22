import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Col, Row, Card, Calendar, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DeliveryProcess from './DeliveryProcess'
import CashWithdrawal from './CashWithdrawal'

import {
  ChartCard,
  MiniBar,
  Field,
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

  onPanelChange(value, mode) {

  }
  componentDidMount() {
    this.setState({
      currentUserName: this.props.user.currentUser.nickname,
    })
    this.unshipments();
    console.log(this.state)
  }

  unshipments = () => {
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
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col span={8}>
              <ChartCard
                bordered={false}
                title="常见问题"
                contentHeight={60}
              >
                <a onClick={() => this.deliveryProcess()}>发货流程</a>
                <br />
                <a onClick={() => this.cashWithdrawal()}>提现时间及流程</a>
              </ChartCard>
            </Col>

            <Col span={8}>
              <ChartCard
                bordered={false}
                title="未发货的订单"
                action={
                  <div>
                    <a href="#/sup/sup-order">前去发货
                    </a>
                  </div>
                }
                contentHeight={120}
              >
                <div style={{ fontSize: 30, textAlign: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: 50 }}>
                    {this.state.unshipmentsNumber}
                  </span>
                  个订单等待发货
              </div>
              </ChartCard>
            </Col>

            <Col span={8}>
              <ChartCard
                bordered={false}
                contentHeight={300}
              >
                <Calendar fullscreen={false} onPanelChange={this.onPanelChange()} />
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
