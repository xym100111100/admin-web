import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 1536131597087,
    actiId: 1536131597087,
    menuId: 1536131597106,
  },
  {
    id: 1536131597088,
    actiId: 1536131597088,
    menuId: 1536131597106,
  },
  {
    id: 1536131597089,
    actiId: 1536131597089,
    menuId: 1536131597107,
  },
  {
    id: 1536131597090,
    actiId: 1536131597090,
    menuId: 1536131597107,
  },
  {
    id: 1536131597091,
    actiId: 1536131597091,
    menuId: 1536131597108,
  },
  {
    id: 1536131597092,
    actiId: 1536131597092,
    menuId: 1536131597108,
  },
  {
    id: 1536131597093,
    actiId: 1536131597093,
    menuId: 1536131597109,
  },
  {
    id: 1536131597094,
    actiId: 1536131597094,
    menuId: 1536131597109,
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


export function pfmactimenuListAll(req, res) {
  res.json(tableListDataSource);
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
