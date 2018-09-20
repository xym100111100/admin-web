import mockjs from 'mockjs';
import { pfmsysList, pfmsysGetById, pfmsysAdd, pfmsysModify, pfmsysDel } from './mock/pfmsys';
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
import { ordorderList, ordorderGetById, ordorderAdd, ordorderModify, ordorderDel } from './mock/ordorder';
import { kdieorderList, kdieorderGetById, kdieorderAdd, kdieorderModify, kdieorderDel } from './mock/kdieorder';
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
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

const currentUser = {
  userId: '1',
  nickname: '超级管理员',
  face: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  notifyCount: 12,
  orgId: '253274870',
  menus: getMenuData('damai-admin'),
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
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
  //kdieorder
  'GET /kdi-svr/kdi/eorder': kdieorderList,
  'GET /kdi-svr/kdi/eorder/getbyid': kdieorderGetById,
  'POST /kdi-svr/kdi/eorder': kdieorderAdd,
  'PUT /kdi-svr/kdi/eorder': kdieorderModify,
  'DELETE /kdi-svr/kdi/eorder': kdieorderDel,
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
 * @param {string} key 微服务的名称
 * @param {string} value 微服务启动的地址
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

if (noProxy) {
  // addProxy('pfm-svr', 'http://127.0.0.1:20182/');
  // addProxy('suc-svr', 'http://127.0.0.1:9100/');
  // addProxy('pfm-svr', 'http://127.0.0.1:8080/pfm-svr');
  // addProxy('suc-svr', 'http://127.0.0.1:8080/suc-svr/');
  addProxy('pfm-svr', 'http://192.168.1.201/pfm-svr');
  addProxy('suc-svr', 'http://192.168.1.201/suc-svr/');
  // addProxy('rna-svr', 'http://127.0.0.1:20088/');
  addProxy('kdi-svr', 'http://127.0.0.1:20080/');
  // addProxy('onl-svr', 'http://127.0.0.1:9100/');
  // addProxy('ise-svr', 'http://127.0.0.1:20180/');
  addProxy('ord-svr', 'http://127.0.0.1:20180/');
}

// 响应请求不延迟
export default delay(proxy);
// 响应请求延迟1秒
// export default delay(proxy, 1000);
