import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 1536131597087,
    sysId: 'damai-admin',
    funcId: 1536131597087,
    name: '查看',
    isEnabled: true,
    isAuth: true,
    remark: '查看系统的基础信息',
    orderNo: 1,
  },
  {
    id: 1536131597088,
    sysId: 'damai-admin',
    funcId: 1536131597087,
    name: '管理',
    isEnabled: true,
    isAuth: true,
    remark: '管理系统的基础信息',
    orderNo: 2,
  },
  {
    id: 1536131597089,
    sysId: 'damai-admin',
    funcId: 1536131597088,
    name: '查看',
    isEnabled: true,
    isAuth: true,
    remark: '查看菜单的基础信息',
    orderNo: 1,
  },
  {
    id: 1536131597090,
    sysId: 'damai-admin',
    funcId: 1536131597088,
    name: '管理',
    isEnabled: true,
    isAuth: true,
    remark: '管理菜单的基础信息',
    orderNo: 2,
  },
  {
    id: 1536131597091,
    sysId: 'damai-admin',
    funcId: 1536131597089,
    name: '查看',
    isEnabled: true,
    isAuth: true,
    remark: '查看功能及其动作的基础信息',
    orderNo: 1,
  },
  {
    id: 1536131597092,
    sysId: 'damai-admin',
    funcId: 1536131597089,
    name: '管理',
    isEnabled: true,
    isAuth: true,
    remark: '管理功能及其动作的基础信息',
    orderNo: 2,
  },
  {
    id: 1536131597093,
    sysId: 'damai-admin',
    funcId: 1536131597090,
    name: '查看',
    isEnabled: true,
    isAuth: true,
    remark: '查看角色的基础信息',
    orderNo: 1,
  },
  {
    id: 1536131597094,
    sysId: 'damai-admin',
    funcId: 1536131597090,
    name: '管理',
    isEnabled: true,
    isAuth: true,
    remark: '管理角色的基础信息',
    orderNo: 2,
  },
];

export function getList() {
  return tableListDataSource;
}

export function pfmactiGetById(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  const eo = tableListDataSource.find(item => item.id === params.id - 0);
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

export function pfmactiAdd(req, res, u, b) {
  const record = (b && b.body) || req.body;
  if (Math.random() >= 0.495) {
    record.id = new Date().getTime();
    record.orderNo = tableListDataSource.length;
    tableListDataSource.push(record);
    tableListDataSource.sort((item1, item2) => item1.orderNo > item2.orderNo);
    return res.json({
      result: 1,
      msg: '添加成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '添加失败，功能名称已存在',
    });
  }
}

export function pfmactiModify(req, res, u, b) {
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

export function pfmactiSort(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { dragCode, dropCode } = body;
  const dragParentCode = dragCode.substring(0, dragCode.length - 2);
  const dropParentCode = dropCode.substring(0, dropCode.length - 2);
  tableListDataSource.forEach(item => {
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

  tableListDataSource.sort((item1, item2) => item1.code > item2.code);
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

export function pfmactiDel(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const removedIndex = tableListDataSource.findIndex(item => item.id === params.id);
  if (removedIndex >= 0) {
    tableListDataSource.splice(removedIndex, 1);
    for (let index = 0; index < tableListDataSource.length; index++) {
      const acti = tableListDataSource[index];
      acti.orderNo = index;
    }
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

export function pfmactiAuth(req, res, u, b) {
  const body = (b && b.body) || req.body;
  let success;
  for (const item of tableListDataSource) {
    if (item.id === body.id) {
      item.isAuth = body.isAuth;
      success = true;
      break;
    }
  }
  if (success) {
    return res.json({
      result: 1,
      msg: '设置鉴权/忽略成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '设置鉴权/忽略失败，找不到要鉴权/忽略的记录',
    });
  }
}

export function pfmactiEnable(req, res, u, b) {
  const body = (b && b.body) || req.body;
  let success;
  for (const item of tableListDataSource) {
    if (item.id === body.id) {
      item.isEnabled = body.isEnabled;
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

// export default {
//   getList,
//   pfmactiGetById,
//   pfmactiAdd,
//   pfmactiModify,
//   pfmactiDel,
// };
