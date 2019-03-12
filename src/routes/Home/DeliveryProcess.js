import React, { PureComponent } from 'react';
import { Form, } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import Img1 from "./img/1首页.jpg"
import Img2 from "./img/2展开选择.jpg"
import Img3 from "./img/3点击快递公司.jpg"
import Img4 from "./img/4开始添加快递公司.jpg"
import Img5 from "./img/5添加快递公司.jpg"
import Img6 from "./img/6输入快递公司.jpg"
import Img7 from "./img/7输入快递公司成功.jpg"
import Img8 from "./img/8点击发件人.jpg"
import Img9 from "./img/9添加发件人.jpg"
import Img91 from "./img/91添加发件人成功.jpg"
import Img92 from "./img/92点击订单.jpg"
import Img93 from "./img/93修改发件人和快递公司.jpg"
import Img94 from "./img/94点击返回.jpg"
import Img95 from "./img/95第一种情况.jpg"
import Img96 from "./img/96第二种情况.jpg"
import Img97 from "./img/97第三种情况.jpg"
import Img98 from "./img/98第四种情况.jpg"


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

    return (
      <div style={{ textAlign: 'center',height:500 }}>
        <p style={{ fontWeight: 'bold', fontSize: 20,marginTop:5 }}>1、登录系统后台</p>
        <img width={'100%'} src={Img1}  />

        <br />
        <p style={{ fontWeight: 'bold', fontSize: 20 ,marginTop:10}}>2、点击左上角添加发件人和快递公司</p>
        <img width={'100%'} src={Img2}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 20,marginTop:10 }}>3、添加快递公司</p>
        <img width={'100%'} src={Img6}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 20 ,marginTop:10}}>4、添加快递公司成功</p>

        <img width={'100%'} src={Img7}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 20,marginTop:10 }}>5、添加发件人</p>

        <img width={'100%'} src={Img8}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 20 ,marginTop:10}}>6、输入发件人信息</p>

        <img width={'100%'} src={Img9}  />
        <br /> 
        <p style={{ fontWeight: 'bold', fontSize: 20 ,marginTop:10}}>7、输入发件成功</p>

        <img width={'100%'} src={Img91}  />
        <br /> 
        <p style={{ fontWeight: 'bold', fontSize: 20,marginTop:10 }}>9、查询订单</p>

        <img width={'100%'} src={Img92}  />
        <br /> 
        <p style={{ fontWeight: 'bold', fontSize: 20,marginTop:10 }}>9、发货成功</p>

        <img width={'100%'} src={Img93}  />
        <br /> 
        <p style={{ fontWeight: 'bold', fontSize: 20,marginTop:10 }}>9、发货成功</p>

        <img width={'100%'} src={Img94}  />
        <br /> 
        <p style={{ fontWeight: 'bold', fontSize: 20 ,marginTop:10}}>9、发货成功</p>

        <img width={'100%'} src={Img95}  />
        <br /> 
        <p style={{ fontWeight: 'bold', fontSize: 20 ,marginTop:10}}>9、发货成功</p>

        <img width={'100%'} src={Img96}  />
        <br /> 
        <p style={{ fontWeight: 'bold', fontSize: 20,marginTop:10 }}>9、发货成功</p>

        <img width={'100%'} src={Img97}  />
        <br /> 
        <p style={{ fontWeight: 'bold', fontSize: 20,marginTop:10 }}>9、发货成功</p>
        <img width={'100%'} src={Img98}  />

        <br /> 
      </div>
    );
  }
}
