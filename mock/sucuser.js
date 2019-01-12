import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = {
  endRow: 5,
  firstPage: 1,
  hasNextPage: true,
  hasPreviousPage: false,
  isFirstPage: true,
  isLastPage: false,
  lastPage: 3,
  list: [
    {
      id: '1',
      isLock: false,
      isVerifiedEmail: false,
      isVerifiedIdcard: false,
      isVerifiedMobile: false,
      isVerifiedRealname: false,
      loginName: 'admin',
      modifiedTimestamp: '1526607068000',
      nickname: '系统管理员',
      point:20,
    },
    {
      email: 'zhangsan@163.com',
      id: '472560881448779779',
      idcard: '450104201504011017',
      isLock: false,
      isVerifiedEmail: false,
      isVerifiedIdcard: false,
      isVerifiedMobile: false,
      isVerifiedRealname: false,
      loginName: '张三三san',
      wxNickname:'张三',
      mobile: '13545879858',
      modifiedTimestamp: '1526609421713',
      payPswd: '657ecbd0d4fa4cb8bc9953e8b028cbb2',
      realname: '实名A',
      salt: 'wrJBA5',
      point:22,
    },
    {
      email: 'lisi@163.com',
      id: '472560883663372292',
      idcard: '450104190001011014',
      isLock: false,
      isVerifiedEmail: false,
      isVerifiedIdcard: false,
      isVerifiedMobile: false,
      isVerifiedRealname: false,
      loginName: '李四四',
      loginPswd: 'a38ca595e6b7e1cd284e7b6ca090e573',
      mobile: '13545879857',
      modifiedTimestamp: '1526609422241',
      nickname: '昵称B',
      payPswd: 'a38ca595e6b7e1cd284e7b6ca090e573',
      realname: '实名B',
      salt: 'Nv5z0e',
      point:24,
    },
  ],
  navigateFirstPage: 1,
  navigateLastPage: 3,
  navigatePages: 8,
  navigatepageNums: [1, 2, 3],
  nextPage: 2,
  pageNum: 1,
  pageSize: 5,
  pages: 3,
  prePage: 0,
  size: 5,
  startRow: 1,
  total: '3',
};

export function sucUserList(req, res) {
  res.json(tableListDataSource);
}

export function sucuserGetById(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const eo = tableListDataSource.list.find(item => item.id === params.id);
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

export function sucuserList2(sysId) {
  const result = [];
  for (const item of tableListDataSource.list) {
    if (item.sysId === sysId) {
      result.push(item);
    }
  }
  return result;
}

export function sucUserAdd(req, res, u, b) {
  const body = (b && b.body) || req.body;

  if (Math.random() >= 0.495) {
    // body.id = tableListDataSource.length + 1;
    tableListDataSource.push(body);
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

export function sucUserModify(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const replacedIndex = tableListDataSource.findIndex(item => item.id === body.id);
  if (replacedIndex !== -1) {
    tableListDataSource.splice(replacedIndex, 1, body);
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

export function sucuserEnable(req, res, u, b) {
  const body = (b && b.body) || req.body;
  let success;
  for (const item of tableListDataSource) {
    if (item.id === body.id) {
      item.isLock = body.isLock;
      success = true;
      break;
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
      msg: '设置启用/禁用失败，找不到要启用/禁用的记录',
    });
  }
}

export function removeLoginPassWord(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const replacedIndex = tableListDataSource.findIndex(item => item.id === body.id);
  if (replacedIndex !== -1) {
    return res.json({
      result: 1,
      msg: '解除成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '解除失败，找不到要解除登录密码的账号',
    });
  }
}

export function removePayPassWord(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const replacedIndex = tableListDataSource.findIndex(item => item.id === body.id);
  if (replacedIndex !== -1) {
    return res.json({
      result: 1,
      msg: '解除成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '解除失败，找不到要解除支付密码的账号',
    });
  }
}

export function unbindWeChat(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const replacedIndex = tableListDataSource.findIndex(item => item.id === body.id);
  if (replacedIndex !== -1) {
    return res.json({
      result: 1,
      msg: '解除成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '解除失败，找不到要解除微信的账号',
    });
  }
}

export function unbindQQ(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const replacedIndex = tableListDataSource.findIndex(item => item.id === body.id);
  if (replacedIndex !== -1) {
    return res.json({
      result: 1,
      msg: '解除成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '解除失败，找不到要解除微信的账号',
    });
  }
}

export function charge(req, res, u, b) {
  console.info(33333);
  const body = (b && b.body) || req.body;
  console.info(body);
  return res.json({
    result: 1,
    msg: '充值成功',
  });

}
