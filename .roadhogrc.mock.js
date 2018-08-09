import mockjs from 'mockjs';
import { pfmsysList, pfmsysGetById, pfmsysAdd, pfmsysModify, pfmsysDel } from './mock/pfmsys';
import {
  kdilogisticList,
  kdilogisticGetById,
  kdilogisticAdd,
  kdilogisticModify,
  kdilogisticDel,
} from './mock/kdilogistic';
//import {
//rnarealnameList,
//rnarealnameGetById,
//rnarealnameAdd,
//rnarealnameModify,
//rnarealnameDel,
//} from './mock/rnarealname';
import {
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
import { pfmactimenuList, pfmactimenuModify } from './mock/pfmactimenu';
import { pfmactiurnList, pfmactiurnModify } from './mock/pfmactiurn';
import {
  pfmroleList,
  pfmroleGetById,
  pfmroleAdd,
  pfmroleModify,
  pfmroleSort,
  pfmroleDel,
  pfmroleEnable,
} from './mock/pfmrole';
import { pfmroleactiList, pfmroleactiModify } from './mock/pfmroleacti';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
import { S_IRWXG } from 'constants';
import {
  sucUserList,
  sucUserGetById,
  sucUserAdd,
  sucUserModify,
  sucuserEnable,
  removeLoginPassWord,
  removePayPassWord,
  unbindWeChat,
  unbindQQ,
} from './mock/sucuser';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  //kdilogitic
  'GET /kdi-svr/kdi/logistic': kdilogisticList,
  'GET /kdi-svr/kdi/logistic/getbyid': kdilogisticGetById,
  'POST /kdi-svr/kdi/logistic': kdilogisticAdd,
  'PUT /kdi-svr/kdi/logistic': kdilogisticModify,
  'DELETE /kdi-svr/kdi/logistic': kdilogisticDel,
  //rnarealname
  //'GET /rna-svr/rna/realname': rnarealnameList,
  //'GET /rna-svr/rna/realname/getbyid': rnarealnameGetById,
  // 'POST /rna-svr/rna/realname': rnarealnameAdd,
  // 'PUT /rna-svr/rna/realname': rnarealnameModify,
  // 'DELETE /rna-svr/rna/realname': rnarealnameDel,
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
  // pfmactiurn
  'GET /pfm-svr/pfm/actiurn': pfmactiurnList,
  'PUT /pfm-svr/pfm/actiurn': pfmactiurnModify,
  // pfmrole
  'GET /pfm-svr/pfm/role': pfmroleList,
  'GET /pfm-svr/pfm/role/getbyid': pfmroleGetById,
  'POST /pfm-svr/pfm/role': pfmroleAdd,
  'PUT /pfm-svr/pfm/role': pfmroleModify,
  'PUT /pfm-svr/pfm/role/sort': pfmroleSort,
  'DELETE /pfm-svr/pfm/role': pfmroleDel,
  'PUT /pfm-svr/pfm/role/enable': pfmroleEnable,
  // pfmroleacti
  'GET /pfm-svr/pfm/roleacti': pfmroleactiList,
  'PUT /pfm-svr/pfm/roleacti': pfmroleactiModify,
  // sucuser
  'GET /suc-svr/suc/user': sucUserList,
  'GET /suc-svr/suc/user/getbyid': sucUserGetById,
  'POST /suc-svr/suc/user': sucUserAdd,
  'PUT /suc-svr/suc/user': sucUserModify,
  'PUT /suc-svr/suc/user/enable': sucuserEnable,
  'PUT /suc-svr/suc/user/del/loginpassword': removeLoginPassWord,
  'PUT /suc-svr/suc/user/del/paypassword': removePayPassWord,
  'PUT /suc-svr/suc/user/unbindwechat': unbindWeChat,
  'PUT /suc-svr/suc/user/unbindqq': unbindQQ,
  // pfmsuc
  'POST /suc-svr/user/login/by/user/name': (req, res) => {
    const { loginPswd, userName, type } = req.body;
    if (loginPswd === '21218cca77804d2ba1922c33e0151105' && userName === 'admin') {
      res.send({
        result: 1,
        msg: '登录成功',
      });
      return;
    }
    res.send({
      result: -1,
      msg: '账号或密码不正确',
    });
  },
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
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

// 响应请求延迟1秒
// export default (noProxy ? {} : delay(proxy, 1000));
// 响应请求不延迟
export default (noProxy
  ? {
      'GET /pfm-svr/(.*)': 'http://127.0.0.1:20182/',
      'POST /pfm-svr/(.*)': 'http://127.0.0.1:20182/',
      'PUT /pfm-svr/(.*)': 'http://127.0.0.1:20182/',
      'DELETE /pfm-svr/(.*)': 'http://127.0.0.1:20182/',
      'GET /rna-svr/(.*)': 'http://127.0.0.1:20088/',
      'POST /rna-svr/(.*)': 'http://127.0.0.1:20088/',
      'PUT /rna-svr/(.*)': 'http://127.0.0.1:20088/',
      'DELETE /rna-svr/(.*)': 'http://127.0.0.1:20088/',
      'GET /suc-svr/(.*)': 'http://127.0.0.1:9100/',
      'POST /suc-svr/(.*)': 'http://127.0.0.1:9100/',
      'PUT /suc-svr/(.*)': 'http://127.0.0.1:9100/',
      'DELETE /suc-svr/(.*)': 'http://127.0.0.1:9100/',
    }
  : delay(proxy));
//  : delay(proxy, 1000));
