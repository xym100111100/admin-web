import React, { PureComponent } from 'react';
import { Form, Table } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import Img1 from "./img/10.png"
import Img2 from "./img/11.png"
import Img3 from "./img/12.png"


const FormItem = Form.Item;



// 添加与编辑的表单
@connect(({ userrole, pntList, sucuser, loading }) => ({
  userrole,
  sucuser,
  pntList,
  loading: loading.models.pntList || loading.models.sucuser,
}))
@EditForm
export default class CashWithdrawal extends PureComponent {

  render() {
    var styleObj = {
      width: 800,
      height: 800,
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>提现时间</h1>
        <img src={Img3}  />
        <br />
        <h1>提现流程</h1>
        <br />
        <img src={Img1} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>1、点击供应商->账户管理->提现</p>
        <br />
        <img src={Img2}  />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>2、填写相应信息</p>
        <p style={{ fontSize: 16 }}>备注：银行卡5个工作日内到账</p>
      </div>
    );
  }
}
