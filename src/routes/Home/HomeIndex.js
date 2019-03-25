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
    const { roles } = this.props.user;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].indexPath !== '' && roles[i].indexPath !== undefined) {
        window.location.href = roles[i].indexPath;
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
        <Card bordered={false}>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
            <Col style={{ textAlign: 'center' }} md={24} sm={24}>
              <h2>{this.state.currentUserName} 供应商欢迎您登录大卖后台</h2>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
            <Col style={{ textAlign: 'center' }} md={24} sm={24}>
              <Calendar />
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}
