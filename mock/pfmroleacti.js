import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {id:'1536574571794',roleId:'1536131597090',actiId:'1536131597088'},
  {id:'1536574571794',roleId:'1536131597090',actiId:'1536131597090'},
  {id:'1536574571795',roleId:'1536131597090',actiId:'1536131597092'},
  {id:'1536574571795',roleId:'1536131597090',actiId:'1536131597094'},
];

export function pfmroleactiList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const result = [];
  for (const item of tableListDataSource) {
    if (item.roleId === params.roleId) {
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
