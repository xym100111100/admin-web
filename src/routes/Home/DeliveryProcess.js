import React, { PureComponent } from 'react';
import { Form, } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import Img1 from "./img/1.png"
import Img2 from "./img/2.png"
import Img3 from "./img/3.png"
import Img4 from "./img/4.png"
import Img5 from "./img/5.png"
import Img6 from "./img/6.png"
import Img7 from "./img/7.png"
import Img8 from "./img/8.png"
import Img9 from "./img/9.png"

const FormItem = Form.Item;



// 添加与编辑的表单
@connect(({ userrole, pntList, sucuser, loading }) => ({
  userrole,
  sucuser,
  pntList,
  loading: loading.models.pntList || loading.models.sucuser,
}))
@EditForm
export default class DeliveryProcess extends PureComponent {


  render() {
    var styleObj = {
      width: 1000,
      height: 600,

    }
    return (
      <div style={{ textAlign: 'center' }}>
        <img src={Img1} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>1、登录系统后台</p>
        <br />
        <img src={Img2} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>2、进入快递公司配置</p>
        <br />
        <img src={Img3} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>3、添加快递公司</p>
        <br />
        <img src={Img4} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>4、进入发件人配置</p>
        <br />
        <img src={Img5} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>5、添加发件人</p>
        <br />
        <img src={Img6} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>6、进入订单管理页面</p>
        <br />
        <img src={Img7} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>7、选择发件人和快递公司</p>
        <br />
        <img src={Img8} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>8、选择要发货</p>
        <br />
        <img src={Img9} style={styleObj} />
        <p style={{ fontWeight: 'bold', fontSize: 20 }}>9、发货成功</p>
        <br />
      </div>
    );
  }
}
