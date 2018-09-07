import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 1536131597087,
    roleId: 1536131597091,
    actiId: 1536131597087,
  },
  {
    id: 1536131597088,
    roleId: 1536131597090,
    actiId: 1536131597088,
  },
  {
    id: 1536131597089,
    roleId: 1536131597093,
    actiId: 1536131597087,
  },
  {
    id: 1536131597090,
    roleId: 1536131597093,
    actiId: 1536131597089,
  },
  {
    id: 1536131597091,
    roleId: 1536131597095,
    actiId: 1536131597087,
  },
  {
    id: 1536131597092,
    roleId: 1536131597095,
    actiId: 1536131597090,
  },
  {
    id: 1536131597093,
    roleId: 1536131597097,
    actiId: 1536131597087,
  },
  {
    id: 1536131597094,
    roleId: 1536131597097,
    actiId: 1536131597091,
  },
];

export function pfmroleactiList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const result = [];
  for (const item of tableListDataSource) {
    if (item.roleId === params.roleId - 0) {
      result.push(item);
    }
  }
  return res.json(result);
}

export function pfmroleactiListAll(req, res) {
  res.json(tableListDataSource);
}

export function pfmroleactiModify(req, res, u, b) {
  const body = (b && b.body) || req.body;
  for (let index = tableListDataSource.length - 1; index >= 0; index--) {
    if (tableListDataSource[index].roleId === body.roleId) {
      tableListDataSource.splice(index, 1);
    }
  }
  if (body.actiIds) {
    for (const id of body.actiIds) {
      const actiMenu = {};
      actiMenu.id = new Date().getTime();
      actiMenu.roleId = body.roleId;
      actiMenu.actiId = id;
      tableListDataSource.push(actiMenu);
    }
  }

  return res.json({
    result: 1,
    msg: '修改成功',
  });
}
