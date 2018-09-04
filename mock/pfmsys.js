import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 'pfm-admin',
    name: '平台后台管理',
    remark: '平台后台管理系统',
  },
  {
    id: 'kdi-admin',
    name: '快递管理',
    remark: '快递管理系统',
  },
  {
    id: 'damai-admin',
    name: '大卖网后台管理',
    remark: '大卖网后台管理系统',
  },
  {
    id: 'wbl-admin',
    name: '微薄利后台管理',
    remark: '微薄利后台管理系统',
  },
];

export function pfmsysList(req, res) {
  res.json(tableListDataSource);
}

export function pfmsysGetById(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  const eo = tableListDataSource.find(item => item.id === params.id);
  if (eo) {
    return res.json(eo);
  } else {
    return res.json({});
  }
}

export function pfmsysAdd(req, res, u, b) {
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

export function pfmsysModify(req, res, u, b) {
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

export function pfmsysDel(req, res, u) {
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
