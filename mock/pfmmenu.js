import { parse } from 'url';

// mock menuData
const menuData = [];
menuData.push({ id: '1536131597087', sysId: 'damai-admin', code: '00', title: '大卖科技', name: '大卖科技', path: 'home', isEnabled: true, icon: 'home', remark: '大卖首页' });
menuData.push({ id: '1536131597088', sysId: 'damai-admin', code: '0000', title: '首页', name: '首页', path: 'index', isEnabled: true, icon: null, remark: '大卖首页信息'});
menuData.push({ id: '1536131597089', sysId: 'damai-admin', code: '01', title: null, name: '快递业务', path: 'kdi', isEnabled: true, icon: 'profile', remark: '快递相关业务' });
menuData.push({ id: '1536131597090', sysId: 'damai-admin', code: '0100', title: '快递下单', name: '快递下单', path: 'kdi-eorder', isEnabled: true, icon: null, remark: '快递下单相关业务' });
menuData.push({ id: '1536131597091', sysId: 'damai-admin', code: '0101', title: '快递管理', name: '快递单管理', path: 'kdi-mng', isEnabled: true, icon: null, remark: '快递单相关业务' });
menuData.push({ id: '1536131597092', sysId: 'damai-admin', code: '0102', title: null, name: '快递配置', path: 'kdi-cfg', isEnabled: true, icon: null, remark: '快递配置相关业务' });
menuData.push({ id: '1536131597093', sysId: 'damai-admin', code: '010200', title: '快递面单配置', name: '快递面单配置', path: 'kdi-template-cfg', isEnabled: true, icon: null, remark: '快递面单相关业务' });
menuData.push({ id: '1536131597094', sysId: 'damai-admin', code: '010201', title: '快递公司配置', name: '快递公司配置', path: 'kdi-company-cfg', isEnabled: true, icon: null, remark: '快递公司相关业务' });
menuData.push({ id: '1536131597095', sysId: 'damai-admin', code: '010202', title: '发件人配置', name: '发件人配置', path: 'kdi-sender-cfg', isEnabled: true, icon: null, remark: '发件人相关业务' });
menuData.push({ id: '1536131597096', sysId: 'damai-admin', code: '02', title: null, name: '实名认证', path: 'rna', isEnabled: true, icon: 'idcard', remark: '实名认证相关业务' });
menuData.push({ id: '1536131597097', sysId: 'damai-admin', code: '0200', title: '认证用户信息', name: '认证用户信息', path: 'rna-realname', isEnabled: true, icon: null, remark: '认证用户相关业务' });
menuData.push({ id: '1536131597098', sysId: 'damai-admin', code: '03', title: null, name: '上线活动', path: 'onl', isEnabled: true, icon: 'cloud-upload', remark: '商品相关业务' });
menuData.push({ id: '1536131597099', sysId: 'damai-admin', code: '0300', title: '商品上线', name: '商品上线', path: 'onl-mng', isEnabled: true, icon: null, remark: '商品上线相关业务' });
menuData.push({ id: '1536131597100', sysId: 'damai-admin', code: '04', title: null, name: '销售订单', path: 'ord', isEnabled: true, icon: 'file-done', remark: '订单相关业务' });
menuData.push({ id: '1536131597101', sysId: 'damai-admin', code: '0400', title: '订单管理', name: '订单管理', path: 'ord-order', isEnabled: true, icon: null, remark: '订单管理' });
menuData.push({ id: '1536131597102', sysId: 'damai-admin', code: '0401', title: '退货管理', name: '退货管理', path: 'ord-return', isEnabled: true, icon: null, remark: '退货管理' });
menuData.push({ id: '1536131597103', sysId: 'damai-admin', code: '05', title: null, name: '统计报表', path: 'rep', isEnabled: true, icon: 'table', remark: '报表相关业务' });
menuData.push({ id: '1536131597104', sysId: 'damai-admin', code: '0500', title: '物流报表', name: '物流报表', path: 'rep-logistic', isEnabled: true, icon: null, remark: '报表相关业务' });
menuData.push({ id: '1536131597105', sysId: 'damai-admin', code: '06', title: null, name: '用户中心', path: 'suc', isEnabled: true, icon: 'team', remark: '用户相关业务' });
menuData.push({ id: '1536131597106', sysId: 'damai-admin', code: '0600', title: '用户信息', name: '用户信息', path: 'user-mng', isEnabled: true, icon: null, remark: '用户信息相关业务' });
menuData.push({ id: '1536131597107', sysId: 'damai-admin', code: '0601', title: '组织信息', name: '组织信息', path: 'org-mng', isEnabled: true, icon: null, remark: '组织相关业务' });
menuData.push({ id: '1536131597108', sysId: 'damai-admin', code: '07', title: null, name: '系统配置', path: 'pfm', isEnabled: true, icon: 'setting', remark: '系统相关业务' });
menuData.push({ id: '1536131597109', sysId: 'damai-admin', code: '0700', title: '系统', name: '系统', path: 'sys-mng', isEnabled: true, icon: null, remark: '系统相关业务' });
menuData.push({ id: '1536131597110', sysId: 'damai-admin', code: '0701', title: '菜单', name: '菜单', path: 'menu-mng', isEnabled: true, icon: null, remark: '菜单相关业务' });
menuData.push({ id: '1536131597111', sysId: 'damai-admin', code: '0702', title: '功能', name: '功能', path: 'func-mng', isEnabled: true, icon: null, remark: '功能相关业务' });
menuData.push({ id: '1536131597112', sysId: 'damai-admin', code: '0703', title: '角色', name: '角色', path: 'role-mng', isEnabled: true, icon: null, remark: '角色相关业务' });
menuData.push({ id: '1536131597113', sysId: 'damai-admin', code: '0704', title: null, name: '脚本', path: 'script-mng', isEnabled: true, icon: null, remark: '脚本相关业务' });
menuData.push({ id: '1536131597114', sysId: 'damai-admin', code: '08', title: null, name: 'dashboard', path: 'dashboard', isEnabled: true, icon: 'dashboard', remark: 'dashboard相关业务' });
menuData.push({ id: '1536131597115', sysId: 'damai-admin', code: '0800', title: '分析页', name: '分析页', path: 'analysis', isEnabled: true, icon: null, remark: '分析页相关业务' });
menuData.push({ id: '1536131597116', sysId: 'damai-admin', code: '0801', title: '监控页', name: '监控页', path: 'monitor', isEnabled: true, icon: null, remark: '监控页相关业务' });
menuData.push({ id: '1536131597117', sysId: 'damai-admin', code: '0802', title: '工作台', name: '工作台', path: 'workplace', isEnabled: true, icon: null, remark: '工作台相关业务' });
menuData.push({ id: '1536131597118', sysId: 'damai-admin', code: '09', title: null, name: '表单页', path: 'form', isEnabled: true, icon: 'form', remark: '表单相关业务' });
menuData.push({ id: '1536131597119', sysId: 'damai-admin', code: '0900', title: '基础表单', name: '基础表单', path: 'basic-form', isEnabled: true, icon: null, remark: '基础表单相关业务' });
menuData.push({ id: '1536131597120', sysId: 'damai-admin', code: '0901', title: '分步表单', name: '分步表单', path: 'step-form', isEnabled: true, icon: null, remark: '快递下单相关业务' });
menuData.push({ id: '1536131597121', sysId: 'damai-admin', code: '0902', title: '高级表单', name: '高级表单', path: 'advanced-form', isEnabled: true, icon: null, remark: '高级表单相关业务' });
menuData.push({ id: '1536131597122', sysId: 'damai-admin', code: '10', title: null, name: '列表页', path: 'list', isEnabled: true, icon: 'table', remark: '列表页相关业务' });
menuData.push({ id: '1536131597123', sysId: 'damai-admin', code: '1000', title: '查询表格', name: '查询表格', path: 'table-list', isEnabled: true, icon: null, remark: '查询表格相关业务' });
menuData.push({ id: '1536131597124', sysId: 'damai-admin', code: '1001', title: '标准列表', name: '标准列表', path: 'basic-list', isEnabled: true, icon: null, remark: '标准列表相关业务' });
menuData.push({ id: '1536131597125', sysId: 'damai-admin', code: '1002', title: '卡片列表', name: '卡片列表', path: 'card-list', isEnabled: true, icon: null, remark: '卡片列表相关业务' });
menuData.push({ id: '1536131597126', sysId: 'damai-admin', code: '1003', title: '搜索列表', name: '搜索列表', path: 'search', isEnabled: true, icon: null, remark: '搜索列表相关业务' });
menuData.push({ id: '1536131597127', sysId: 'damai-admin', code: '100300', title: '搜索列表（文章）', name: '搜索列表（文章）', path: 'articles', isEnabled: true, icon: null, remark: '搜索列表（文章）相关业务' });
menuData.push({ id: '1536131597128', sysId: 'damai-admin', code: '100301', title: '搜索列表（项目）', name: '搜索列表（项目）', path: 'projects', isEnabled: true, icon: null, remark: '搜索列表（项目）相关业务' });
menuData.push({ id: '1536131597129', sysId: 'damai-admin', code: '100302', title: '搜索列表（应用）', name: '搜索列表（应用）', path: 'applications', isEnabled: true, icon: null, remark: '搜索列表（应用）相关业务' });
menuData.push({ id: '1536131597130', sysId: 'damai-admin', code: '11', title: null, name: '详情页', path: 'profile', isEnabled: true, icon: 'profile', remark: '详情页相关业务' });
menuData.push({ id: '1536131597131', sysId: 'damai-admin', code: '1100', title: '基础详情页', name: '基础详情页', path: 'basic', isEnabled: true, icon: null, remark: '基础详情页相关业务' });
menuData.push({ id: '1536131597132', sysId: 'damai-admin', code: '1101', title: '高级详情页', name: '高级详情页', path: 'advanced', isEnabled: true, icon: null, remark: '高级详情页相关业务' });
menuData.push({ id: '1536131597133', sysId: 'damai-admin', code: '12', title: null, name: '结果页', path: 'result', isEnabled: true, icon: 'check-circle-o', remark: '结果页相关业务' });
menuData.push({ id: '1536131597134', sysId: 'damai-admin', code: '1200', title: '成功', name: '成功', path: 'success', isEnabled: true, icon: null, remark: '成功相关业务' });
menuData.push({ id: '1536131597135', sysId: 'damai-admin', code: '1201', title: '失败', name: '失败', path: 'fail', isEnabled: true, icon: null, remark: '失败相关业务' });
menuData.push({ id: '1536131597136', sysId: 'damai-admin', code: '13', title: null, name: '异常页', path: 'exception', isEnabled: true, icon: 'warning', remark: '异常页相关业务' });
menuData.push({ id: '1536131597137', sysId: 'damai-admin', code: '1300', title: '403', name: '403', path: '403', isEnabled: true, icon: null, remark: '403相关业务' });
menuData.push({ id: '1536131597138', sysId: 'damai-admin', code: '1301', title: '404', name: '404', path: '404', isEnabled: true, icon: null, remark: '404相关业务' });
menuData.push({ id: '1536131597139', sysId: 'damai-admin', code: '1302', title: '500', name: '500', path: '500', isEnabled: true, icon: null, remark: '500相关业务' });
menuData.push({ id: '1536131597140', sysId: 'damai-admin', code: '1303', title: '触发异常', name: '触发异常', path: 'trigger', isEnabled: true, icon: null, remark: '触发异常相关业务' });
menuData.push({ id: '1536131597141', sysId: 'damai-admin', code: '14', title: null, name: '账户', path: 'user', isEnabled: true, icon: 'user', remark: '账户相关业务' });
menuData.push({ id: '1536131597142', sysId: 'damai-admin', code: '1400', title: '登录', name: '登录', path: 'login', isEnabled: true, icon: null, remark: '登录相关业务' });
menuData.push({ id: '1536131597143', sysId: 'damai-admin', code: '1401', title: '注册', name: '注册', path: 'register', isEnabled: true, icon: null, remark: '注册相关业务' });
menuData.push({ id: '1536131597144', sysId: 'damai-admin', code: '1402', title: '注册结果', name: '注册结果', path: 'register-result', isEnabled: true, icon: null, remark: '注册结果相关业务' });
menuData.push({ id: '1536131597145', sysId: 'damai-admin', code: '15', title: null, name: 'v支付管理', path: 'afc', isEnabled: true, icon: 'pay-circle', remark: 'v支付相关业务' });
menuData.push({ id: '1536131597146', sysId: 'damai-admin', code: '1500', title: '提现账号申请管理', name: '提现账号申请管理', path: 'afc-applywithdrawaccount-mng', isEnabled: true, icon: null, remark: '申请提现账号相关业务' });
menuData.push({ id: '1536131597147', sysId: 'damai-admin', code: '1501', title: '提现管理', name: '提现管理', path: 'afc-withdraw-mng', isEnabled: true, icon: null, remark: '提现相关业务' });
menuData.push({ id: '1536131597148', sysId: 'damai-admin', code: '1502', title: '提现账号管理', name: '提现账号管理', path: 'afc-withdrawaccount-mng', isEnabled: true, icon: null, remark: '提现账号相关业务' });
menuData.push({ id: '1536131597149', sysId: 'damai-admin', code: '1503', title: '账号充值', name: '账号交易流水', path: 'afc-flow-mng', isEnabled: true, icon: null, remark: '账号交易流水相关业务' });
menuData.push({ id: '1536131597150', sysId: 'damai-admin', code: '16', title: '伙伴管理', name: '伙伴管理', path: 'prm', isEnabled: true, icon: 'team', remark: '伙伴相关业务' });
menuData.push({ id: '1536131597151', sysId: 'damai-admin', code: '1600', title: '伙伴信息管理', name: '伙伴信息管理', path: 'prm-partner-mng', isEnabled: true, icon: null, remark: '伙伴信息相关业务' });
menuData.push({ id: '1536131597152', sysId: 'damai-admin', code: '17', title: '供应商', name: '供应商', path: 'sup', isEnabled: true, icon: 'user', remark: '供应商相关业务' });
menuData.push({ id: '1536131597153', sysId: 'damai-admin', code: '1700', title: '订单管理', name: '订单管理', path: 'sup-order', isEnabled: true, icon: null, remark: '供应商订单业务' });
menuData.push({ id: '1536131597154', sysId: 'damai-admin', code: '1701', title: '账户管理', name: '账户管理', path: 'sup-account', isEnabled: true, icon: null, remark: '供应商账户信息' });
menuData.push({ id: '1536131597155', sysId: 'damai-admin', code: '18', title: '学生管理', name: '学生管理', path: 'stu', isEnabled: true, icon: 'user', remark: '学生表' });
menuData.push({ id: '1536131597156', sysId: 'damai-admin', code: '1800', title: '学生信息', name: '学生信息', path: 'stu-student', isEnabled: true, icon: null, remark: '学生信息' });

menuData.push({ id: '1536131597157', sysId: 'damai-admin', code: '1504', title: '供应商账户', name: '供应商账户信息', path: 'afc-org-account', isEnabled: true, icon: null, remark: '供应商账户相关业务' });
menuData.push({ id: '1536131597158', sysId: 'damai-admin', code: '1702', title: '商品管理', name: '商品管理', path: 'sup-goods', isEnabled: true, icon: null, remark: '供应商商品相关业务' });
menuData.push({ id: '1536131597159', sysId: 'damai-admin', code: '19', title: '积分与收益', name: '积分与收益', path: 'pnt', isEnabled: true, icon: 'user', remark: '积分与收益' });
menuData.push({ id: '1536131597160', sysId: 'damai-admin', code: '1900', title: '积分查询', name: '积分查询', path: 'pnt-list', isEnabled: true, icon: null, remark: '积分查询' });
menuData.push({ id: '1536131597161', sysId: 'damai-admin', code: '20', title: '店铺管理', name: '店铺管理', path: 'shp', isEnabled: true, icon: 'shop', remark: '店铺管理' });
menuData.push({ id: '1536131597162', sysId: 'damai-admin', code: '2000', title: '店铺信息管理', name: '店铺信息管理', path: 'shp-shop-mng', isEnabled: true, icon: null, remark: '店铺信息管理' });
menuData.push({ id: '1536131597163', sysId: 'damai-admin', code: '0103', title: '快递批量下单', name: '快递批量下单', path: 'kdi-batch', isEnabled: true, icon: null, remark: '快递批量下单' });

function sort(list) {
  return list.sort((item1, item2) => {
    const code1 = item1.code;
    const code2 = item2.code;
    const length = code1.length > code2.length ? code1.length : code2.length;
    const val1 = item1.code.padEnd(length, '0') - 0;
    const val2 = item2.code.padEnd(length, '0') - 0;
    return val1 === val2 ? code1.length - code2.length : val1 - val2;
  })
}

export function getMenuData(sysId) {
  const list = [];
  for (const item of menuData) {
    if (item.sysId === sysId) list.push(item);
  }
  return sort(list);
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
  res.json(sort(list));
}

export function pfmmenuGetById(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  const eo = menuData.find(item => item.id === params.id);
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
    sort(menuData);
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

  sort(menuData);
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
    sort(menuData);
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
