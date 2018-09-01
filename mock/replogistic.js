import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: '1',
    updateTime: '1995-03-16',
    title: 20,
  },
  {
    id: '2',
    updateTime: '1995-03-16',
    title: 30,
  },
  {
    id: '3',
    updateTime: '1995-03-16',
    title: 15,
  },
  {
    id: '4',
    updateTime: '1995-03-16',
    title: 5,
  },
  {
    id: '5',
    updateTime: '1995-03-16',
    title: 19,
  },
  {
    id: '6',
    updateTime: '1995-03-16',
    title: 43,
  },
  {
    id: '7',
    updateTime: '1995-03-16',
    title: 10,
  },
];

export function rnarealnameList(req, res, u) {
  console.log('))))))');
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  if (JSON.stringify(params) === '{}') {
    res.json(tableListDataSource);
  } else {
    const eo = tableListDataSource.filter(item => item.updateTime === params.updateTime);
    res.json(eo);
  }
}

export function rnarealnameGetById(req, res, u) {
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

export function rnarealnameAdd(req, res, u, b) {
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

export function rnarealnameModify(req, res, u, b) {
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

export function rnarealnameDel(req, res, u) {
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
