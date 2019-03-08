import mockjs from 'mockjs';
import { dumaiindexList, dumaiindexGetById, dumaiindexAdd, dumaiindexModify, dumaiindexDel } from './mock/dumaiindex';
import { supaccountList, supaccountGetById, supaccountAdd, supaccountModify, supaccountDel } from './mock/supaccount';
import { pfmsysList, pfmsysGetById, pfmsysAdd, pfmsysModify, pfmsysDel } from './mock/pfmsys';
import {  
  studentList, 
  studentGetById, 
  studentAdd, 
  studentModify, 
  studentDel 
  } from './mock/student';
  import {  
    pntListList, 
    pntListGetById, 
    pntListAdd, 
    pntListModify, 
    pntListDel,
    pntListByAccountId 
    } from './mock/pntList';
import {
  kdilogisticList,
  kdilogisticGetById,
  kdilogisticAdd,
  kdilogisticModify,
  kdilogisticDel,
} from './mock/kdilogistic';
import { kdicompanyList, kdicompanyGetById, kdicompanyAdd, kdicompanyModify, kdicompanyDel } from './mock/kdicompany';
import {
  rnarealnameList,
  rnarealnameGetById,
  rnarealnameAdd,
  rnarealnameModify,
  rnarealnameDel,
} from './mock/rnarealname';
import {order, ordorderList, ordorderGetById, ordorderAdd, ordorderModify, ordorderDel } from './mock/ordorder';
import { kdieorderList, kdieorderGetById, kdieorderAdd, kdieorderModify, kdieorderDel } from './mock/kdieorder';
import { detail } from './mock/ordDetail';
import {
  kdiSenderList,
  kdisenderGetById,
  kdisenderAdd,
  kdisenderModify,
  kdisenderDel,
  modifyDefaultSender,
  addKdiSender,
  getDefaultSender,
} from './mock/kdisender';
import {
  getMenuData,
  pfmmenuList,
  pfmmenuGetById,
  pfmmenuAdd,
  pfmmenuModify,
  pfmmenuSort,
  pfmmenuDel,
  pfmmenuEnable,
} from './mock/pfmmenu';
import {
  pfmfuncList,
  pfmfuncGetById,
  pfmfuncAdd,
  pfmfuncModify,
  pfmfuncSort,
  pfmfuncDel,
  pfmfuncEnable,
} from './mock/pfmfunc';
import {
  suporderList,
  suporderGetById,
  suporderAdd,
  suporderModify,
} from './mock/suporder';
import {
  pfmactiGetById,
  pfmactiAdd,
  pfmactiModify,
  pfmactiSort,
  pfmactiDel,
  pfmactiAuth,
  pfmactiEnable,
} from './mock/pfmacti';
import { pfmactimenuList, pfmactimenuModify, pfmactimenuListAll } from './mock/pfmactimenu';
import { pfmactiurnList, pfmactiurnModify, pfmactiurnListAll } from './mock/pfmactiurn';
import {
  ListAll,
  pfmroleList,
  pfmroleGetById,
  pfmroleAdd,
  pfmroleModify,
  pfmroleSort,
  pfmroleDel,
  pfmroleEnable,
} from './mock/pfmrole';
import { pfmroleactiList, pfmroleactiModify, pfmroleactiListAll } from './mock/pfmroleacti';
import { pfmuserroleListUserRoles, pfmuserroleListRoleUsers } from './mock/pfmuserrole';
import { getRule, postRule } from './mock/rule';
import { format, delay } from 'roadhog-api-doc';
import { S_IRWXG } from 'constants';
import {
  sucUserList,
  sucuserGetById,
  sucUserAdd,
  sucUserModify,
  sucuserEnable,
  removeLoginPassWord,
  removePayPassWord,
  unbindWeChat,
  unbindQQ,
  charge,
} from './mock/sucuser';
import {
  sucUserOrgList,
  sucUserOrgListAdded,
  sucUserOrgListUnadded,
  sucUserOrgListAddedAndUnadded,
  sucUserOrgGetById,
  sucUserOrgAdd,
  sucUserOrgModify,
} from './mock/sucuserorg';
import {
  prmPartnerList,
  prmPartnerGetById,
  prmPartnerAdd,
  prmPartnerModify,
  prmPartnerDel,
} from './mock/prmpartner'
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { from } from 'rxjs/observable/from';
import { chargeForPerson, chargeForPlatForm,tradeList } from './mock/afcflow';

// 根据环境变量判断是否禁用代理（禁用代理将直接请求真实的服务）
const noProxy = process.env.NO_PROXY === 'true';

const currentUser = {
  userId: '1',
  nickname: '超级管理员',
  face: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  notifyCount: 12,
  orgId: '517928358546243584',
  menus: getMenuData('damai-admin'),
};

// 配置mock代理的请求
const proxy = {
  //pnt
  'GET /pnt-svr/pnt/account': pntListList,
  'GET /pnt-svr/pnt/account/getbyid': pntListGetById,
  'GET /pnt-svr/pnt/listByAccountId': pntListByAccountId,
  'POST /pnt-svr/pnt/account': pntListAdd,
  'PUT /pnt-svr/pnt/account': pntListModify,
  'DELETE /pnt-svr/pnt/account': pntListDel,
  //student
  'GET /hlw-svr/hlw/student': studentList,
  'GET /hlw-svr/hlw/student/getbyid': studentGetById,
  'POST /hlw-svr/hlw/student': studentAdd,
  'PUT /hlw-svr/hlw/student': studentModify,
  'DELETE /hlw-svr/hlw/student': studentDel,
  //kdisender
  'GET /kdi-svr/kdi/sender': kdiSenderList,
  'GET /kdi-svr/kdi/sender/alllist': kdiSenderList,
  'GET /kdi-svr/kdi/sender/listSenderByOrgId': kdiSenderList,
  'GET /kdi-svr/kdi/sender/default': getDefaultSender,
  'GET /kdi-svr/kdi/sender/getbyid': kdisenderGetById,
  'POST /kdi-svr/kdi/sender': kdisenderAdd,
  'PUT /kdi-svr/kdi/sender': kdisenderModify,
  'PUT /kdi-svr/kdi/sender/default': modifyDefaultSender,
  'POST /kdi-svr/kdi/sender/add': addKdiSender,
  'DELETE /kdi-svr/kdi/sender': kdisenderDel,
  //kdilogitic
  'GET /kdi-svr/kdi/logistic': kdilogisticList,
  'GET /kdi-svr/kdi/logistic/getbyid': kdilogisticGetById,
  'POST /kdi-svr/kdi/logistic': kdilogisticAdd,
  'PUT /kdi-svr/kdi/logistic': kdilogisticModify,
  'DELETE /kdi-svr/kdi/logistic': kdilogisticDel,
  //kdilogitic
  'GET /kdi-svr/kdi/company': kdicompanyList,
  'GET /kdi-svr/kdi/company/getbyid': kdicompanyGetById,
  'POST /kdi-svr/kdi/company': kdicompanyAdd,
  'PUT /kdi-svr/kdi/company': kdicompanyModify,
  'DELETE /kdi-svr/kdi/company': kdicompanyDel,
  //rnarealname
  'GET /rna-svr/rna/realname': rnarealnameList,
  'GET /rna-svr/rna/realname/getbyid': rnarealnameGetById,
  'POST /rna-svr/rna/realname': rnarealnameAdd,
  'PUT /rna-svr/rna/realname': rnarealnameModify,
  'DELETE /rna-svr/rna/realname': rnarealnameDel,
  //rnarealname
  'GET /ord-svr/ord/mng': ordorderList,
  'GET /ord-svr/ord/mng/getbyid': ordorderGetById,
  'POST /ord-svr/ord/mng': ordorderAdd,
  'PUT /ord-svr/ord/mng': ordorderModify,
  'DELETE /ord-svr/ord/mng': ordorderDel,
  'GET /ord-svr/ord/order': order,
  'GET /ord-svr/ord/orderdetail/info': detail,
  //kdieorder
  'GET /kdi-svr/kdi/eorder': kdieorderList,
  'GET /kdi-svr/kdi/eorder/getbyid': kdieorderGetById,
  'POST /kdi-svr/kdi/eorder': kdieorderAdd,
  'PUT /kdi-svr/kdi/eorder': kdieorderModify,
  'DELETE /kdi-svr/kdi/eorder': kdieorderDel,
  // dumaiindex
  'GET /dumai-svr/dumai/index': dumaiindexList,
  'GET /dumai-svr/dumai/index/getbyid': dumaiindexGetById,
  'POST /dumai-svr/dumai/index': dumaiindexAdd,
  'PUT /dumai-svr/dumai/index': dumaiindexModify,
  'DELETE /dumai-svr/dumai/index': dumaiindexDel,
  // supaccount
  'GET /sup-svr/sup/account': supaccountList,
  'GET /sup-svr/sup/account/getbyid': supaccountGetById,
  'POST /sup-svr/sup/account': supaccountAdd,
  'PUT /sup-svr/sup/account': supaccountModify,
  'DELETE /sup-svr/sup/account': supaccountDel,
  // pfmsys
  'GET /pfm-svr/pfm/sys': pfmsysList,
  'GET /pfm-svr/pfm/sys/getbyid': pfmsysGetById,
  'POST /pfm-svr/pfm/sys': pfmsysAdd,
  'PUT /pfm-svr/pfm/sys': pfmsysModify,
  'DELETE /pfm-svr/pfm/sys': pfmsysDel,
  // pfmmenu
  'GET /pfm-svr/pfm/menu': pfmmenuList,
  'GET /pfm-svr/pfm/menu/getbyid': pfmmenuGetById,
  'POST /pfm-svr/pfm/menu': pfmmenuAdd,
  'PUT /pfm-svr/pfm/menu': pfmmenuModify,
  'PUT /pfm-svr/pfm/menu/sort': pfmmenuSort,
  'DELETE /pfm-svr/pfm/menu': pfmmenuDel,
  'PUT /pfm-svr/pfm/menu/enable': pfmmenuEnable,
  // suporder
  'GET /sup-svr/sup/order': suporderList,
  'GET /sup-svr/sup/order/getbyid': suporderGetById,
  'POST /sup-svr/sup/order': suporderAdd,
  'PUT /sup-svr/sup/order': suporderModify,
  // pfmfunc
  'GET /pfm-svr/pfm/func': pfmfuncList,
  'GET /pfm-svr/pfm/func/getbyid': pfmfuncGetById,
  'POST /pfm-svr/pfm/func': pfmfuncAdd,
  'PUT /pfm-svr/pfm/func': pfmfuncModify,
  'PUT /pfm-svr/pfm/func/sort': pfmfuncSort,
  'DELETE /pfm-svr/pfm/func': pfmfuncDel,
  'PUT /pfm-svr/pfm/func/enable': pfmfuncEnable,
  // pfmacti
  'GET /pfm-svr/pfm/acti/getbyid': pfmactiGetById,
  'POST /pfm-svr/pfm/acti': pfmactiAdd,
  'PUT /pfm-svr/pfm/acti': pfmactiModify,
  'PUT /pfm-svr/pfm/acti/sort': pfmactiSort,
  'DELETE /pfm-svr/pfm/acti': pfmactiDel,
  'PUT /pfm-svr/pfm/acti/auth': pfmactiAuth,
  'PUT /pfm-svr/pfm/acti/enable': pfmactiEnable,
  // pfmactimenu
  'GET /pfm-svr/pfm/actimenu': pfmactimenuList,
  'PUT /pfm-svr/pfm/actimenu': pfmactimenuModify,
  'GET /pfm-svr/pfm/actimenu/ListAll': pfmactimenuListAll,
  // pfmactiurn
  'GET /pfm-svr/pfm/actiurn': pfmactiurnList,
  'PUT /pfm-svr/pfm/actiurn': pfmactiurnModify,
  'GET /pfm-svr/pfm/actiurn/ListAll': pfmactiurnListAll,
  // pfmrole
  'GET /pfm-svr/pfm/role': pfmroleList,
  'GET /pfm-svr/pfm/role/ListAll': ListAll,
  'GET /pfm-svr/pfm/role/getbyid': pfmroleGetById,
  'POST /pfm-svr/pfm/role': pfmroleAdd,
  'PUT /pfm-svr/pfm/role': pfmroleModify,
  'PUT /pfm-svr/pfm/role/sort': pfmroleSort,
  'DELETE /pfm-svr/pfm/role': pfmroleDel,
  'PUT /pfm-svr/pfm/role/enable': pfmroleEnable,
  // pfmroleacti
  'GET /pfm-svr/pfm/roleacti': pfmroleactiList,
  'PUT /pfm-svr/pfm/roleacti': pfmroleactiModify,
  'GET /pfm-svr/pfm/roleacti/ListAll': pfmroleactiListAll,
  // pfmuserrole
  'GET /pfm-svr/pfm/userrole': pfmuserroleListUserRoles,
  'GET /pfm-svr/pfm/roleuser': pfmuserroleListRoleUsers,
  // sucuser
  'GET /suc-svr/suc/user': sucUserList,
  'GET /suc-svr/suc/user/getbyid': sucuserGetById,
  'POST /suc-svr/suc/user': sucUserAdd,
  'PUT /suc-svr/suc/user': sucUserModify,
  'PUT /suc-svr/suc/user/enable': sucuserEnable,
  'PUT /suc-svr/suc/user/del/loginpassword': removeLoginPassWord,
  'PUT /suc-svr/suc/user/del/paypassword': removePayPassWord,
  'PUT /suc-svr/suc/user/unbindwechat': unbindWeChat,
  'PUT /suc-svr/suc/user/unbindqq': unbindQQ,
  // sucorg
  'GET /suc-svr/suc/org': sucUserOrgList,
  'GET /suc-svr/suc/org/getbyid': sucUserOrgGetById,
  'POST /suc-svr/suc/org': sucUserOrgAdd,
  'PUT /suc-svr/suc/org': sucUserOrgModify,
  // sucuserorg
  'GET /suc/userorg/listaddedusers': sucUserOrgListAdded,
  'GET /suc/userorg/listunaddedusers': sucUserOrgListUnadded,
  'GET /suc/userorg/listaddedandunaddedusers': sucUserOrgListAddedAndUnadded,
  // prmpartner
  'GET /prm-svr/prm/partner': prmPartnerList,
  'GET /prm-svr/prm/partnergetbyid': prmPartnerGetById,
  'POST /prm-svr/prm/partner': prmPartnerAdd,
  'PUT /prm-svr/prm/partner': prmPartnerModify,
  'DELETE /prm-svr/prm/partner': prmPartnerDel,
  //afccharge
  'GET /afc-svr/afc/tradeList': tradeList,
  // pfm
  'POST /pfm-svr/user/login/by/user/name': (req, res) => {
    const { loginPswd, userName, type } = req.body;
    if (loginPswd === '25d55ad283aa400af464c76d713c07ad' && userName === 'admin') {
      res.send({
        result: 1,
        msg: '登录成功',
        ...currentUser,
      });
      return;
    }
    res.send({
      result: -1,
      msg: '账号或密码不正确',
    });
  },
  // 支持值为 Object 和 Array
  'GET /pfm-svr/user/currentuser': currentUser,
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

/**
 * 添加联调的微服务
 *
 * @param {String} key 微服务的名称
 * @param {String} value 微服务启动的地址
 */
function addProxy(key, value) {
  // 先删除旧的
  for (const prop in proxy) {
    if (prop.includes(` /${key}/`)) {
      delete proxy[prop];
    }
  }

  // 再添加新的
  proxy[`GET /${key}/(.*)`] = value;
  proxy[`POST /${key}/(.*)`] = value;
  proxy[`PUT /${key}/(.*)`] = value;
  proxy[`DELETE /${key}/(.*)`] = value;
}

// 禁用代理的时候，配置直接请求服务的映射
if (noProxy) {
  // addProxy('kdi-svr', 'http://127.0.0.1:20080/');
  // addProxy('ord-svr', 'http://127.0.0.1:20180/'); 
  addProxy('shp-svr', 'http://192.168.1.222:20090/'); 

  //addProxy('hlw-svr', 'http://127.0.0.1:9009/');

  // addProxy('suc-svr', 'http://127.0.0.1:9100/');
  // addProxy('pnt-svr', 'http://127.0.0.1:9010/');

  // addProxy('pfm-svr', 'http://192.168.1.201/pfm-svr/');
  // addProxy('pfm-svr', 'http://192.168.1.37:20182/');
  /*
   addProxy('suc-svr', 'http://127.0.0.1:9100/');
  addProxy('rna-svr', 'http://127.0.0.1:20088/');

  addProxy('onl-svr', 'http://127.0.0.1:9100/');
  addProxy('ise-svr', 'http://127.0.0.1:20180/');*/
  /* addProxy('ord-svr', 'http://127.0.0.1:20180/');  */
  //  addProxy('afc-svr', 'http://127.0.0.1:9400/'); 
 /*  addProxy('prm-svr', 'http://192.168.1.37:20110/'); */

  // addProxy('pfm-svr', 'http://127.0.0.1:8080/pfm-svr');
  // addProxy('suc-svr', 'http://192.168.1.201/suc-svr/');

  // addProxy('pfm-svr', 'http://192.168.1.201/pfm-svr/');
  addProxy('suc-svr', 'http://192.168.1.224:9100/');
  // addProxy('afc-svr', 'http://192.168.1.201/afc-svr/');

  // addProxy('rna-svr', 'https://www.duamai.com/rna-svr/');
  // addProxy('kdi-svr', 'https://www.duamai.com/kdi-svr/');
  // addProxy('ise-svr', 'https://www.duamai.com/ise-svr/');
}

// 响应请求不延迟
export default delay(proxy);
// 响应请求延迟1秒
// export default delay(proxy, 1000);
