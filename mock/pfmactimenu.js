import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 1,
    actiId: 2,
    menuId: 1,
  },
  {
    id: 2,
    actiId: 2,
    menuId: 2,
  },
  {
    id: 3,
    actiId: 4,
    menuId: 1,
  },
  {
    id: 4,
    actiId: 4,
    menuId: 3,
  },
  {
    id: 5,
    actiId: 6,
    menuId: 1,
  },
  {
    id: 6,
    actiId: 6,
    menuId: 4,
  },
  {
    id: 7,
    actiId: 8,
    menuId: 1,
  },
  {
    id: 8,
    actiId: 8,
    menuId: 5,
  },
];

export function pfmactimenuList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const result = [];
  for (const item of tableListDataSource) {
    if (item.actiId === params.actiId - 0) {
      result.push(item);
    }
  }
  return res.json(result);
}

export function pfmactimenuModify(req, res, u, b) {
  const body = (b && b.body) || req.body;
  for (let index = tableListDataSource.length - 1; index >= 0; index--) {
    if (tableListDataSource[index].actiId === body.actiId) {
      tableListDataSource.splice(index, 1);
    }
  }
  if (body.menuIds) {
    for (const id of body.menuIds) {
      const actiMenu = {};
      actiMenu.id = new Date().getTime();
      actiMenu.actiId = body.actiId;
      actiMenu.menuId = id;
      tableListDataSource.push(actiMenu);
    }
  }

  return res.json({
    result: 1,
    msg: '修改成功',
  });
}
