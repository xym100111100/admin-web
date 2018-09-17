import { parse } from 'url';
import { getList } from './pfmacti';
import IdUtils from '../src/utils/IdUtils';
// mock tableListDataSource
const tableListDataSource = [
  { id: '1536131597087', sysId: 'damai-admin', name: '系统配置-系统', isEnabled: true, orderNo: 1, remark: '系统基础信息'},
  { id: '1536131597088', sysId: 'damai-admin', name: '系统配置-菜单', isEnabled: true, orderNo: 2, remark: '菜单基础信息'},
  { id: '1536131597089', sysId: 'damai-admin', name: '系统配置-功能', isEnabled: true, orderNo: 3, remark: '功能及其动作的基础信息'},
  { id: '1536131597090', sysId: 'damai-admin', name: '系统配置-角色', isEnabled: true, orderNo: 4, remark: '角色基础信息'},
  
];

export function pfmfuncList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const funcList = [];
  for (const item of tableListDataSource) {
    if (!params.sysId || item.sysId === params.sysId) funcList.push(item);
  }
  const actiList = [];
  for (const item of getList()) {
    if (!params.sysId || item.sysId === params.sysId) {
      if (params.isAuth === undefined) actiList.push(item);
      else if (params.isAuth && item.isAuth) actiList.push(item);
    }
  }
  res.json({ funcs: funcList, actis: actiList });
}

export function pfmfuncGetById(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  const eo = tableListDataSource.find(item => item.id === params.id );
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

export function pfmfuncAdd(req, res, u, b) {
  const record = (b && b.body) || req.body;
  if (Math.random() >= 0.495) {
    record.id = IdUtils.genId();
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

export function pfmfuncModify(req, res, u, b) {
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

export function pfmfuncSort(req, res, u, b) {
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

export function pfmfuncDel(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const removedIndex = tableListDataSource.findIndex(item => item.id === params.id);
  if (removedIndex >= 0) {
    tableListDataSource.splice(removedIndex, 1);
    for (let index = 0; index < tableListDataSource.length; index++) {
      const func = tableListDataSource[index];
      func.orderNo = index;
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

export function pfmfuncEnable(req, res, u, b) {
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
//   pfmfuncList,
//   pfmfuncGetById,
//   pfmfuncAdd,
//   pfmfuncModify,
//   pfmfuncDel,
// };
