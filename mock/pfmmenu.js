import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 1,
    sysId: 'pfm-admin',
    path: 'pfm',
    code: '00',
    name: '系统配置',
    remark: '配置基础的系统信息',
    icon: 'setting',
    isEnabled: true,
  },
  {
    id: 2,
    sysId: 'pfm-admin',
    path: 'sys-mng',
    code: '0000',
    name: '系统',
    remark: '管理平台的各系统信息',
    // icon: 'global',
    isEnabled: true,
  },
  {
    id: 3,
    sysId: 'pfm-admin',
    path: 'menu-mng',
    code: '0001',
    name: '菜单',
    remark: '管理系统的菜单',
    // icon: 'bars',
    isEnabled: true,
  },
  {
    id: 4,
    sysId: 'pfm-admin',
    path: 'func-mng',
    code: '0002',
    name: '功能',
    remark: '管理系统的功能',
    // icon: 'role',
    isEnabled: true,
  },
  {
    id: 5,
    sysId: 'pfm-admin',
    path: 'role-mng',
    code: '0003',
    name: '角色',
    remark: '管理系统的角色',
    // icon: 'role',
    isEnabled: true,
  },
  {
    id: 6,
    sysId: 'pfm-admin',
    path: 'menu-list',
    code: '000100',
    name: '菜单测试1',
    remark: '管理系统的菜单测试',
    icon: 'bars',
    isEnabled: true,
  },
  {
    id: 7,
    sysId: 'pfm-admin',
    path: 'menu-list',
    code: '00010000',
    name: '菜单测试12',
    remark: '管理系统的菜单测试',
    icon: 'bars',
    isEnabled: true,
  },
  {
    id: 8,
    sysId: 'pfm-admin',
    path: 'menu-list',
    code: '000101',
    name: '菜单测试13',
    remark: '管理系统的菜单测试',
    icon: 'bars',
    isEnabled: true,
  },
  {
    id: 9,
    sysId: 'pfm-admin',
    path: 'menu-list',
    code: '0001000000',
    name: '菜单测试14',
    remark: '管理系统的菜单测试',
    icon: 'bars',
    isEnabled: true,
  },
];

export function pfmmenuList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const list = [];
  for (const item of tableListDataSource) {
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

export function pfmmenuAdd(req, res, u, b) {
  const body = (b && b.body) || req.body;
  if (Math.random() >= 0.495) {
    tableListDataSource.push(body);
    tableListDataSource.sort((item1, item2) => item1.code > item2.code);
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

export function pfmmenuSort(req, res, u, b) {
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

export function pfmmenuDel(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const removedIndex = tableListDataSource.findIndex(item => item.id === body.id);
  const { code } = tableListDataSource[removedIndex];
  for (let i = tableListDataSource.length - 1; i >= 0; i--) {
    const tempCode = tableListDataSource[i].code;
    if (tempCode.indexOf(`${code}`) === 0) {
      tableListDataSource.splice(i, 1);
    }
  }
  if (removedIndex >= 0) {
    tableListDataSource.sort((item1, item2) => item1.code > item2.code);
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
  for (const item of tableListDataSource) {
    if (item.id === body.id) {
      item.isEnabled = body.isEnabled;
      success = true;
      code = item.code;
      if (body.isEnabled) {
        for (const item2 of tableListDataSource) {
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

export default {
  pfmmenuList,
  pfmmenuGetById,
  pfmmenuAdd,
  pfmmenuModify,
  pfmmenuDel,
};
