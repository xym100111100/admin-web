import { parse } from 'url';

// mock menuData
const menuData = [];

menuData.push({
  id: 1536131597087,
  code: '00',
  sysId: 'damai-admin',
  icon: 'profile',
  isEnabled: true,
  remark: '快递相关业务',
  name: '快递业务',
  path: 'kdi',
});
menuData.push({
  id: 1536131597088,
  code: '0000',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '快递下单相关业务',
  name: '快递下单',
  path: 'kdi-eorder',
  title: '快递下单',
});

menuData.push({
  id: 1536131597089,
  code: '0001',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '快递单相关业务',
  name: '快递单管理',
  path: 'kdi-mng',
  title: '快递管理',
});
menuData.push({
  id: 1536131597090,
  code: '0002',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '快递配置相关业务',
  name: '快递配置',
  path: 'kdi-cfg',
});
menuData.push({
  id: 1536131597092,
  code: '000200',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '快递面单相关业务',
  name: '快递面单配置',
  path: 'kdi-eorder-cfg',
  title: '快递面单配置',
});
menuData.push({
  id: 1536131597093,
  code: '000201',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '快递公司相关业务',
  name: '快递公司配置',
  path: 'kdi-company-cfg',
  title: '快递公司配置',
});
menuData.push({
  id: 1536131597094,
  code: '000202',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '发件人相关业务',
  name: '发件人配置',
  path: 'kdi-sender-cfg',
  title: '发件人配置',
});
menuData.push({
  id: 1536131597095,
  code: '01',
  sysId: 'damai-admin',
  icon: 'idcard',
  isEnabled: true,
  remark: '实名认证相关业务',
  name: '实名认证',
  path: 'rna',
});
menuData.push({
  id: 1536131597096,
  code: '0100',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '认证用户相关业务',
  name: '认证用户信息',
  path: 'rna-realname',
  title: '认证用户信息',
});

menuData.push({
  id: 1536131597097,
  code: '02',
  sysId: 'damai-admin',
  icon: 'cloud-upload',
  isEnabled: true,
  remark: '商品相关业务',
  name: '商品上线',
  path: 'onl',
});
menuData.push({
  id: 1536131597098,
  code: '0200',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '商品上线相关业务',
  name: '商品上线',
  path: 'onl-mng',
  title: '商品上线',
});
menuData.push({
  id: 1536131597099,
  code: '03',
  sysId: 'damai-admin',
  icon: 'user',
  isEnabled: true,
  remark: '用户相关业务',
  name: '用户管理',
  path: 'suc',
});
menuData.push({
  id: 1536131597100,
  code: '0300',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '用户信息相关业务',
  name: '用户信息',
  path: 'user-mng',
  title: '用户信息',
});
menuData.push({
  id: 1536131597101,
  code: '0301',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '组织相关业务',
  name: '组织信息',
  path: 'org-mng',
  title: '组织信息',
});
menuData.push({
  id: 1536131597102,
  code: '04',
  sysId: 'damai-admin',
  icon: 'table',
  isEnabled: true,
  remark: '报表相关业务',
  name: '报表管理',
  path: 'rep',
});
menuData.push({
  id: 15361315971103,
  code: '0401',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '报表相关业务',
  name: '物流报表',
  path: 'rep-logistic',
  title: '物流报表',
});
menuData.push({
  id: 1536131597104,
  code: '05',
  sysId: 'damai-admin',
  icon: 'setting',
  isEnabled: true,
  remark: '系统相关业务',
  name: '系统配置',
  path: 'pfm',
});
menuData.push({
  id: 1536131597105,
  code: '0500',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '系统相关业务',
  name: '系统',
  path: 'sys-mng',
  title: '系统',
});
menuData.push({
  id: 1536131597106,
  code: '0501',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '菜单相关业务',
  name: '菜单',
  path: 'menu-mng',
  title: '菜单',
});
menuData.push({
  id: 1536131597107,
  code: '0502',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '功能相关业务',
  name: '功能',
  path: 'func-mng',
  title: '功能',
});
menuData.push({
  id: 1536131597108,
  code: '0503',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '角色相关业务',
  name: '角色',
  path: 'role-mng',
  title: '角色',
});
menuData.push({
  id: 1536131597109,
  code: '0504',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '脚本相关业务',
  name: '脚本',
  path: 'script-mng',
});
menuData.push({
  id: 1536131597110,
  code: '06',
  sysId: 'damai-admin',
  icon: 'dashboard',
  isEnabled: true,
  remark: 'dashboard相关业务',
  name: 'dashboard',
  path: 'dashboard',
});
menuData.push({
  id: 1536131597111,
  code: '0600',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '分析页相关业务',
  name: '分析页',
  path: 'analysis',
  title: '分析页',
});
menuData.push({
  id: 1536131597112,
  code: '0601',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '监控页相关业务',
  name: '监控页',
  path: 'monitor',
  title: '监控页',
});
menuData.push({
  id: 1536131597113,
  code: '0602',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '工作台相关业务',
  name: '工作台',
  path: 'workplace',
  title: '工作台',
});
menuData.push({
  id: 1536131597114,
  code: '07',
  sysId: 'damai-admin',
  icon: 'form',
  isEnabled: true,
  remark: '表单相关业务',
  name: '表单页',
  path: 'form',
});
menuData.push({
  id: 1536131597115,
  code: '0700',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '基础表单相关业务',
  name: '基础表单',
  path: 'basic-form',
  title: '基础表单',
});
menuData.push({
  id: 1536131597116,
  code: '0701',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '快递下单相关业务',
  name: '分步表单',
  path: 'step-form',
  title: '分步表单',
});
menuData.push({
  id: 1536131597117,
  code: '0702',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '高级表单相关业务',
  name: '高级表单',
  authority: 'admin',
  path: 'advanced-form',
  title: '高级表单',
});
menuData.push({
  id: 1536131597118,
  code: '08',
  sysId: 'damai-admin',
  icon: 'table',
  isEnabled: true,
  remark: '列表页相关业务',
  name: '列表页',
  path: 'list',
});
menuData.push({
  id: 1536131597119,
  code: '0800',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '查询表格相关业务',
  name: '查询表格',
  path: 'table-list',
  title: '查询表格',
});
menuData.push({
  id: 1536131597120,
  code: '0801',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '标准列表相关业务',
  name: '标准列表',
  path: 'basic-list',
  title: '标准列表',
});
menuData.push({
  id: 1536131597121,
  code: '0802',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '卡片列表相关业务',
  name: '卡片列表',
  path: 'card-list',
  title: '卡片列表',
});
menuData.push({
  id: 1536131597122,
  code: '0803',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '搜索列表相关业务',
  name: '搜索列表',
  path: 'search',
  title: '搜索列表',
});
menuData.push({
  id: 1536131597123,
  code: '080300',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '搜索列表（文章）相关业务',
  name: '搜索列表（文章）',
  path: 'articles',
  title: '搜索列表（文章）',
});
menuData.push({
  id: 1536131597124,
  code: '080301',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '搜索列表（项目）相关业务',
  name: '搜索列表（项目）',
  path: 'projects',
  title: '搜索列表（项目）',
});
menuData.push({
  id: 1536131597125,
  code: '080302',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '搜索列表（应用）相关业务',
  name: '搜索列表（应用）',
  path: 'applications',
  title: '搜索列表（应用）',
});
menuData.push({
  id: 1536131597126,
  code: '09',
  sysId: 'damai-admin',
  icon: 'profile',
  isEnabled: true,
  remark: '详情页相关业务',
  name: '详情页',
  path: 'profile',
});
menuData.push({
  id: 1536131597127,
  code: '0900',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '基础详情页相关业务',
  name: '基础详情页',
  path: 'basic',
  title: '基础详情页',
});
menuData.push({
  id: 1536131597128,
  code: '0901',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '高级详情页相关业务',
  name: '高级详情页',
  path: 'advanced',
  authority: 'admin',
  title: '高级详情页',
});
menuData.push({
  id: 1536131597129,
  code: '10',
  sysId: 'damai-admin',
  icon: 'check-circle-o',
  isEnabled: true,
  remark: '结果页相关业务',
  name: '结果页',
  path: 'result',
});
menuData.push({
  id: 1536131597130,
  code: '1000',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '成功相关业务',
  name: '成功',
  path: 'success',
  title: '成功',
});
menuData.push({
  id: 1536131597131,
  code: '1001',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '失败相关业务',
  name: '失败',
  path: 'fail',
  title: '失败',
});
menuData.push({
  id: 1536131597132,
  code: '11',
  sysId: 'damai-admin',
  icon: 'warning',
  isEnabled: true,
  remark: '异常页相关业务',
  name: '异常页',
  path: 'exception',
});
menuData.push({
  id: 1536131597133,
  code: '1100',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '403相关业务',
  name: '403',
  path: '403',
  title: '403',
});
menuData.push({
  id: 1536131597134,
  code: '1101',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '404相关业务',
  name: '404',
  path: '404',
  title: '404',
});
menuData.push({
  id: 1536131597135,
  code: '1102',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '500相关业务',
  name: '500',
  path: '500',
  title: '500',
});
menuData.push({
  id: 1536131597136,
  code: '1103',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '触发异常相关业务',
  name: '触发异常',
  path: 'trigger',
  hideInMenu: true,
  title: '触发异常',
});
menuData.push({
  id: 1536131597137,
  code: '12',
  sysId: 'damai-admin',
  icon: 'user',
  isEnabled: true,
  remark: '账户相关业务',
  name: '账户',
  path: 'user',
  authority: 'guest',
});
menuData.push({
  id: 1536131597138,
  code: '1200',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '登录相关业务',
  name: '登录',
  path: 'login',
  title: '登录',
});
menuData.push({
  id: 1536131597139,
  code: '1201',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '注册相关业务',
  name: '注册',
  path: 'register',
  title: '注册',
});
menuData.push({
  id: 1536131597140,
  code: '1202',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '注册结果相关业务',
  name: '注册结果',
  path: 'register-result',
  title: '注册结果',
});
menuData.push({
  id: 1536131597141,
  code: '13',
  sysId: 'damai-admin',
  icon: 'user',
  isEnabled: true,
  remark: '订单相关业务',
  name: '订单管理',
  path: 'ord',
});
menuData.push({
  id: 1536131597142,
  code: '1300',
  sysId: 'damai-admin',
  isEnabled: true,
  remark: '订单管理',
  name: '订单管理',
  path: 'ord-order',
  title: '订单管理',
});

export function getMenuData() {
  return menuData.sort((item1, item2) => {
    const code1 = item1.code;
    const code2 = item2.code;
    const length = code1.length > code2.length ? code1.length : code2.length;
    const val1 = item1.code.padEnd(length, '0') - 0;
    const val2 = item2.code.padEnd(length, '0') - 0;
    return val1 === val2 ? code1.length - code2.length : val1 - val2;
  });
}

export function pfmmenuList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const list = [];
  for (const item of menuData) {
    if (item.sysId === params.sysId) list.push(item);
  }
  res.json(list);
}

export function pfmmenuGetById(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  const eo = menuData.find(item => item.id === params.id - 0);
  if (eo) {
    return res.json({
      result: 1,
      msg: '获取成功',
      record: eo,
    });
  } else {
    return res.json({
      result: -1,
      msg: '获取失败，找不到要获取的记录',
    });
  }
}

export function pfmmenuAdd(req, res, u, b) {
  const body = (b && b.body) || req.body;
  if (Math.random() >= 0.495) {
    menuData.push(body);
    menuData.sort((item1, item2) => item1.code > item2.code);
    return res.json({
      result: 1,
      msg: '添加成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '添加失败，系统名称已存在',
    });
  }
}

export function pfmmenuModify(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const replacedIndex = menuData.findIndex(item => item.id === body.id);
  if (replacedIndex !== -1) {
    menuData.splice(replacedIndex, 1, body);
    return res.json({
      result: 1,
      msg: '修改成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '修改失败，找不到要修改的记录',
    });
  }
}

export function pfmmenuSort(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { dragCode, dropCode } = body;
  const dragParentCode = dragCode.substring(0, dragCode.length - 2);
  const dropParentCode = dropCode.substring(0, dropCode.length - 2);
  menuData.forEach(item => {
    let itemCode = item.code;
    // 如果是drag节点及其子节点，code=dropCode+1
    if (itemCode.indexOf(dragCode) === 0) {
      // 如果drag节点小于drop节点，code=dropCode+1
      if (dragCode < dropCode) {
        itemCode = codePlus1(itemCode, dragCode, dropCode);
      } else {
        // 如果drag节点大于drop节点，code=dropCode
        itemCode = codeEqual(itemCode, dragCode, dropCode);
      }
      // 如果是drop节点及其子节点，如果drag节点大于drop节点，code=dropCode+1
    } else if (itemCode.indexOf(dropCode) === 0 && dragCode > dropCode) {
      itemCode = codePlus1BySelf(itemCode, dropCode);
    }

    // 如果是与drag节点同级的节点及其子节点，如果大于drag节点，code=dragCode-1
    if (itemCode.indexOf(dragParentCode) === 0 && itemCode.indexOf(dragCode) !== 0 && itemCode > dragCode) {
      itemCode = codeSub1BySelf(itemCode, dragCode);
    }
    // 如果是与drop节点同级的节点及其子节点，如果大于drop节点，code=dropCode+1
    if (itemCode.indexOf(dropParentCode) === 0 && itemCode.indexOf(dropCode) !== 0 && itemCode > dropCode) {
      itemCode = codePlus1BySelf(itemCode, dropCode);
    }

    item.code = itemCode;
  });

  menuData.sort((item1, item2) => item1.code > item2.code);
  return res.json({
    result: 1,
    msg: '改变排序成功',
  });
}

function codePlus1(itemCode, selfCode, referenceCode) {
  const prefix = referenceCode.substr(0, referenceCode.length - 2);
  const suffix = itemCode.substr(selfCode.length);
  let middle = referenceCode.substr(referenceCode.length - 2) - 0 + 1;
  middle = middle < 10 ? `0${middle}` : `${middle}`;
  return prefix + middle + suffix;
}

function codePlus1BySelf(itemCode, referenceCode) {
  const prefix = referenceCode.substr(0, referenceCode.length - 2);
  const suffix = itemCode.substr(referenceCode.length);
  let middle = referenceCode.substr(referenceCode.length - 2) - 0 + 1;
  middle = middle < 10 ? `0${middle}` : `${middle}`;
  return prefix + middle + suffix;
}

function codeEqual(itemCode, selfCode, referenceCode) {
  const suffix = itemCode.substr(selfCode.length);
  return referenceCode + suffix;
}

// 自减1
function codeSub1BySelf(itemCode, referenceCode) {
  const prefix = referenceCode.substr(0, referenceCode.length - 2);
  const suffix = itemCode.substr(referenceCode.length);
  let middle = itemCode.substr(referenceCode.length - 2, 2) - 1;
  middle = middle < 10 ? `0${middle}` : `${middle}`;
  return prefix + middle + suffix;
}

export function pfmmenuDel(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const removedIndex = menuData.findIndex(item => item.id === params.id - 0);
  const { code } = menuData[removedIndex];
  for (let i = menuData.length - 1; i >= 0; i--) {
    const tempCode = menuData[i].code;
    if (tempCode.indexOf(`${code}`) === 0) {
      menuData.splice(i, 1);
    }
  }
  if (removedIndex >= 0) {
    menuData.sort((item1, item2) => item1.code > item2.code);
    return res.json({
      result: 1,
      msg: '删除成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '删除失败，找不到要删除的记录',
    });
  }
}

export function pfmmenuEnable(req, res, u, b) {
  const body = (b && b.body) || req.body;
  let success;
  let code;
  for (const item of menuData) {
    if (item.id === body.id) {
      item.isEnabled = body.isEnabled;
      success = true;
      code = item.code;
      if (body.isEnabled) {
        for (const item2 of menuData) {
          if (code.indexOf(item2.code) === 0) {
            item2.isEnabled = true;
          }
        }
        break;
      }
    } else if (code && !body.isEnabled && item.code.substring(0, code.length) === code) {
      item.isEnabled = false;
    }
  }
  if (success) {
    return res.json({
      result: 1,
      msg: '设置启用/禁用成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '启用/禁用菜单失败，找不到要启用/禁用的记录',
    });
  }
}
