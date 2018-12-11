import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import {  Card} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ supaccount,ordorder, user, afcapplywithdrawaccount, loading }) => ({
  supaccount,ordorder, user,afcapplywithdrawaccount,
  loading: loading.models.supaccount  || loading.models.ordorder ||loading.models.user ||  loading.models.afcapplywithdrawaccount 
}))
export default class SupAccount extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'supaccount';
    this.state.balance=0;
    this.state.supplierName='';
    this.state.notSettle=0;
    this.state.alreadySettle=0;
  }

    //初始化
    componentDidMount() {
      const id=this.props.user.currentUser.userId;
      const deliverOrgId=this.props.user.currentUser.orgId;
      //获取单个账户
      this.props.dispatch({
        type: `${this.moduleCode}/getOneAccount`,
        payload: {id:id},
        callback: data => {
          if(data.balance !==null && data.balance !=undefined ){
            this.setState({
              balance:data.balance,
              supplierName:this.props.user.currentUser.nickname,
            })
          }
        }
      });
      //获取供应商订单已经结算和待结算的成本价
      this.props.dispatch({
        type: `${this.moduleCode}/getSettleTotal`,
        payload: {deliverOrgId:deliverOrgId},
        callback: data => {
          this.setState({
            notSettle:data.notSettle,
            alreadySettle:data.alreadySettle,
          })
        }
      });
    }


  render() {
    const { supaccount: { supaccount }, loading } = this.props;


    return (
      <Fragment>
        <PageHeaderLayout>
          <Card bordered={false}>
            <p>
              <span style={{color: 'rgba(0, 0, 0, 0.85)',fontSize:'20px',marginRight:8 }}>
              {this.state.supplierName} 
              </span>
              您的余额为:
              <span style={{color: 'rgba(0, 0, 0, 0.85)',fontSize:'20px',marginRight:8 }}>{this.state.balance}元</span>
              您订单待结算金额为:
              <span style={{color: 'rgba(0, 0, 0, 0.85)',fontSize:'20px',marginRight:8 }}>{this.state.notSettle}元</span>
              您订单已结算金额为:
              <span style={{color: 'rgba(0, 0, 0, 0.85)',fontSize:'20px',marginRight:8 }}>{this.state.alreadySettle}元</span>
            </p>
          </Card>
        </PageHeaderLayout>,

      </Fragment>
    );
  }
}
