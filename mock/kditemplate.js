import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: '1',
    name:'百世快递1',
    imgPath:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2910461361,3236237426&fm=27&gp=0.jpg",
    isDefault:false,
    orgId: '517928358546243584',	
  },
  {
    id: '2',
    name:'百世快递2',
    imgPath:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2910461361,3236237426&fm=27&gp=0.jpg",
    isDefault:false,
    orgId: '517928358546243584',	
  },
  {
    id: '3',
    name:'中通快递',
    imgPath:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2910461361,3236237426&fm=27&gp=0.jpg",
    isDefault:false,
    orgId: '517928358546243584',	
  },
  {
    id: '4',
    name:'申通快递',
    imgPath:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2910461361,3236237426&fm=27&gp=0.jpg",
    isDefault:true,
    orgId: '517928358546243584',	
  },

];

export function kditemplateList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const eo = tableListDataSource.filter(item => item.orgId === params.orgId);
  res.json(eo);
}

export function kditemplateGetById(req, res, u) {
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

export function kditemplateAdd(req, res, u, b) {
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

export function kditemplateModify(req, res, u, b) {
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

export function kditemplateDel(req, res, u) {
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
