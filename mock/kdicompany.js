import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: '1',
    companyName: '百世快递',
    companyAccount: '123',
    companyPwd: '456',
    companyCode: '789',
    payType: 1,
    entryTime: '1995-03-16 12:45:52',
    organizeId: '253274870',
  },
  {
    id: '2',
    companyName: '中通快递',
    companyAccount: '61341',
    companyPwd: '654664',
    companyCode: '546884',
    payType: 4,
    entryTime: '1990-03-16 08:45:52',
    organizeId: '253274870',
  },
  {
    id: '3',
    companyName: '圆通快递',
    companyAccount: '123646',
    companyPwd: '456787',
    companyCode: '78129',
    payType: 2,
    entryTime: '1995-01-16 17:45:52',
    organizeId: '253274871',
  },
  {
    id: '4',
    companyName: '京东快递',
    companyAccount: '123',
    companyPwd: '4564165',
    companyCode: '789310',
    payType: 3,
    entryTime: '1990-03-06 12:05:52',
    organizeId: '253274871',
  },
];

export function kdicompanyList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const eo = tableListDataSource.filter(item => item.organizeId === params.organizeId);
  res.json(eo);
}

export function kdicompanyGetById(req, res, u) {
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

export function kdicompanyAdd(req, res, u, b) {
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

export function kdicompanyModify(req, res, u, b) {
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

export function kdicompanyDel(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const removedIndex = tableListDataSource.findIndex(item => item.id === params.id);
  if (removedIndex !== -1) {
    tableListDataSource.splice(removedIndex, 1);
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
