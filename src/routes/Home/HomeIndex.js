import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Col, Row, Card, Calendar, Form } from 'antd';


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
    if(roles !==undefined && roles.length !==undefined ){
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].indexPath !== '' && roles[i].indexPath !== undefined) {
          window.location.href = roles[i].indexPath;
          break;
        }
      }
    }

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
