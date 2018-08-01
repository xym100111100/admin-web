import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 1,
    roleId: 2,
    actiId: 1,
  },
  {
    id: 2,
    roleId: 2,
    actiId: 2,
  },
  {
    id: 3,
    roleId: 4,
    actiId: 1,
  },
  {
    id: 4,
    roleId: 4,
    actiId: 3,
  },
  {
    id: 5,
    roleId: 6,
    actiId: 1,
  },
  {
    id: 6,
    roleId: 6,
    actiId: 4,
  },
  {
    id: 7,
    roleId: 8,
    actiId: 1,
  },
  {
    id: 8,
    roleId: 8,
    actiId: 5,
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
