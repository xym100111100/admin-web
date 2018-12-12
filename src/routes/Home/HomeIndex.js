import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Col, Row, Card, Calendar } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';



@connect(({ homeindex, user, loading }) => ({ homeindex, user, loading: loading.models.homeindex || loading.models.user }))
export default class HomeIndex extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'homeindex';
    this.state.currentUserName='';
  }

  onPanelChange(value, mode) {

  } 
  componentDidMount() {
    this.setState({
      currentUserName:this.props.user.currentUser.nickname,
    })
  }

  render() {
    const { homeindex: { homeindex }, loading } = this.props;

    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
              <Col style={{textAlign:'center'}} md={24} sm={24}>
                  <h2>{this.state.currentUserName} 欢迎您登录大卖后台</h2>
              </Col>
              <Col md={24} sm={24}>
                <Calendar onPanelChange={this.onPanelChange} />
              </Col>
            </Row>

          </Card>
        </PageHeaderLayout>

      </Fragment>
    );
  }
}
