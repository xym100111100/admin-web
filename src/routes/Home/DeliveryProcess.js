import React, { PureComponent } from 'react';
import { Form, } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import Img1 from "./img/1进入首页.jpg"
import Img2 from "./img/2添加快递公司.jpg"
import Img3 from "./img/3输入快递公司信息.jpg"
import Img4 from "./img/4添加快递公司成功.jpg"
import Img5 from "./img/5添加发件人.jpg"
import Img6 from "./img/6输入发件人信息.jpg"
import Img7 from "./img/7添加发件人成功.jpg"
import Img8 from "./img/8批量订阅选择.jpg"
import Img9 from "./img/9输入批量订阅物流编号.jpg"
import Img91 from "./img/91批量发货选择.jpg"
import Img92 from "./img/92批量发货确定.jpg"
import Img93 from "./img/93选择详情发货.jpg"
import Img94 from "./img/94选择发件人或者快递公司.jpg"
import Img95 from "./img/95选择发件人或快递公司后返回.jpg"
import Img96 from "./img/96第一种订阅.jpg"
import Img97 from "./img/97第二种订阅.jpg"
import Img98 from "./img/98第三种订阅.jpg"
import Img99 from "./img/99第四种订阅.jpg"
import Img991 from "./img/991添加有账号密码的快递公司.jpg"
import Img992 from "./img/992成功添加有账号密码的快递公司.jpg"
import Img993 from "./img/993第一种发货.jpg"
import Img994 from "./img/994第二种发货.jpg"
import Img995 from "./img/995第三种发货.jpg"
import Img996 from "./img/996第四种发货.jpg"
import Img997 from "./img/997重复发货.png"
import Img998 from "./img/998重复发货界面.png"



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
      <div style={{ height:500 }}>
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>1:进入首页，请注意是否有更新通知，然后点击左上角展开菜单</p>
        <img width={'100%'} src={Img1}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>2:添加快递公司</p>
        <img width={'100%'} src={Img2}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>3:输入快递公司信息</p>
        <p>温馨提示:如何您未已快递公司对接只需要选择快递公司名称即可，其他输入框留空或清空。</p>
        
        <img width={'100%'} src={Img3}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>4:添加快递公司成功</p>
        <img width={'100%'} src={Img4}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>5:添加发件人</p>
        <img width={'100%'} src={Img5}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>6:输入发件人信息</p>
        <img width={'100%'} src={Img6}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>7:添加发件人成功</p>
        <img width={'100%'} src={Img7}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>8:批量录入并发货</p>
        <p>也就是现实中已经发货，有了快递单号，需要在本系统中填写物流单号发货，且一个订单值需要发一个快递包裹，如需要发多个包裹请看12以下方式发货方式</p>
        <br/>
        <img width={'100%'} src={Img8}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>9:录入物快递单号后提交即发货成功</p>
        <img width={'100%'} src={Img9}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>10:批量打印并发货选择</p>
        <p>也就是现实中没有快递单号，需要在本系统中打印出快递单号，需要和快递公司对接，有快递公司帐号和密码，且一个订单值需要发一个快递包裹，如需要发多个包裹请看12以下方式发货方式</p>
        <br/>
        <img width={'100%'} src={Img91}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>11:确定快递公司和发件人后即批量发货成功</p>
        <img width={'100%'} src={Img92}  />
        <br />
        <p style={{marginTop:25}} >这里是分割线</p>
        <p  >以上发货是在一个订单只需要发一个快递包裹且发货备注等就是商品名称和规格，不需要手动修改，否则请以下面的发货方式</p>

        <p  >---------------------------------------------------------------------------------------------------</p>

        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>12:选择详情发货</p>
        <img width={'100%'} src={Img93}  />
        <p>温馨提示:如何您未已快递公司对接只需要选择快递公司名称即可，其他输入框留空或清空。</p>
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>13:选择发件人或者快递公司</p>
        <p>这里的快递公司和发件人均选择默认的，需要修改请点击箭头之处修改</p>
        <img width={'100%'} src={Img94}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>14:选择发件人或者快递公司后返回</p>
        <p>点击1  2  3 均能选择且返回上一步，请不要点击右下角的返回，会关闭窗口。</p>

        <img width={'100%'} src={Img95}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>15:第一种订阅</p>
        <p>1显示为拆分订单，就是相同的商品已经合并成一个商品，数量会累加，2为选择的所有商品发一个包裹时，3只能也只允许输入一个快递 单号（不能有多余的换行和空格）</p>
        <img width={'100%'} src={Img96}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>16:第二种订阅</p>
        <p>1显示为拆分订单，就是相同的商品已经合并成一个商品，数量累加，2为选择的商品发n个包裹（选择多少个商品就发多少个） 3有多少个包裹就需要输入多少个快递单号，以换行区分每一个单号（不能有多余的换行和空格）</p>
        <img width={'100%'} src={Img97}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>17:第三种订阅</p>
        <p>1显示为合并订单，也就是相同商品已经被拆分为单个商品，数量是下单的时候是多少就是多少，2为选择的所有商品发一个包裹时。3只能也只允许输入一个快递 单号（不能有多余的换行和空格）</p>
        <img width={'100%'} src={Img98}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>18:第四种订阅</p>
        <p>1显示为合并订单，也就是相同商品已经被拆分为单个商品，数量是下单的时候是多少就是多少，2为选择的商品发n个包裹（选择多少个商品就发多少个） 3有多少个包裹就需要输入多少个快递单号，以换行区分每一个单号（不能有多余的换行和空格）</p>
        <img width={'100%'} src={Img99}  />
        <br />
        <p style={{marginTop:25}} >这里是分割线</p>
        <p  >以上发货是没有和快递公司对接的时候订阅物流的发货，如果需要打印快递单出来请以下面的发货方式</p>

        <p  >---------------------------------------------------------------------------------------------------</p>
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>19:添加有帐号密码的快递公司</p>
        <p>1  2  3都需要填写完</p>
        <img width={'100%'} src={Img991}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>20:成功添加有帐号密码的快递公司</p>
        <img width={'100%'} src={Img992}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>21:第一种发货</p>
        <p> 默认，1显示为拆分订单，就是相同的商品已经合并成一个商品，数量会累加，2为选择的所有商品发一个包裹时，3的发货 备注有效，可以修改。</p>
        <img width={'100%'} src={Img993}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>22:第二种发货</p>
        <p>1显示为拆分订单，就是相同的商品已经合并成一个商品，数量累加，2为选择的商品发n个包裹（选择多少个商品就发多少个） 3的发货备注无效，打印出来的订单备注为商品的名称和规格。</p>
        <img width={'100%'} src={Img994}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>23:第三种发货</p>
        <p>1显示为合并订单，也就是相同商品已经被拆分为单个商品，数量是下单的时候是多少就是多少，2为选择的所有商品发一个包裹时，3的发货 备注有效，可以修改。</p>
        <img width={'100%'} src={Img995}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>24:第四种发货</p>
        <p>1显示为合并订单，也就是相同商品已经被拆分为单个商品，数量是下单的时候是多少就是多少，2为选择的商品发n个包裹（选择多少个商品就发多少个） 3的发货备注无效，打印出来的订单备注为商品的名称和规格。</p>
        <img width={'100%'} src={Img996}  />
        <br />
        <p style={{marginTop:25}} >这里是分割线</p>
        <p  >如果一个订单只有一个商品还需要发多个包裹的，请看下面的操作</p>

        <p  >---------------------------------------------------------------------------------------------------</p>
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>25:重复发货界面</p>
        <p>搜索已发货的订单，添加新快递单</p>
        <img width={'100%'} src={Img997}  />
        <br />
        <p style={{ fontWeight: 'bold', fontSize: 15,marginTop:10 }}>24:选择和填写各个信息即可，和前面发货一样</p>
        <img width={'100%'} src={Img998}  />
        <br />
      </div>
    );
  }
}
