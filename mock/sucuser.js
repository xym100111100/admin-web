import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: '13579',
    loginName: '紫色星期一',
    nickName: '紫色星期一',
    email: '５９６０３８９８０＠ｑｑ．ｃｏｍ',
    mobile: '１５８７８７５２７６８',
    wxNickname: '名字不要太长这样就好了',
    qqNickname: '名字不要太长这样就好了',
    isLock: false,
    realname: '测试',
    isVerifiedRealname: false,
    idcard: 1212121221,
    isVerifiedIdcard: true,
    isVerifiedEmail: false,
    isVerifiedMobile: false,
  },
  {
    id: '24680',
    loginName: '紫色星期一',
    nickName: '紫色星期一',
    email: '５９６０３８９８０＠ｑｑ．ｃｏｍ',
    mobile: '１５８７８７５２７６８',
    wxNickname: '名字不要太长这样就好了',
    qqNickname: '名字不要太长这样就好了',
    realname: '测试',
    isVerifiedRealname: false,
    idcard: 1212121221,
    isVerifiedIdcard: true,
    isVerifiedEmail: false,
    isVerifiedMobile: false,
    isLock: false,
  },
];

export function sucUserList(req, res) {
  res.json(tableListDataSource);
}

export function sucUserGetById(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const eo = tableListDataSource.find(item => item.id === params.id);
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
