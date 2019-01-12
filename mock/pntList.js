import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = {
  endRow: 5,
  firstPage: 1,
  hasNextPage: true,
  hasPreviousPage: false,
  isFirstPage: true,
  isLastPage: false,
  lastPage: 3,
  list: [
    { nickname:'想',point: 10.000, income: 253.000, totalIncome: 2560.0, isLocked: 0, modifiedTimestamp: 1542321011 },
    { nickname:'寻',point: 13.000, income: 253.000, totalIncome: 2560.0, isLocked: 1, modifiedTimestamp: 5214421031 },
    { nickname:'的',point: 12.000, income: 253.000, totalIncome: 2560.0, isLocked: 0, modifiedTimestamp: 5214421031 },
    { nickname:'个',point: 11.000, income: 253.000, totalIncome: 2560.0, isLocked: 1, modifiedTimestamp: 5214421031 },
    { nickname:'是',point: 14.000, income: 253.000, totalIncome: 2560.0, isLocked: 0, modifiedTimestamp: 5214421031 },
    { nickname:'额 ',point: 15.000, income: 253.000, totalIncome: 2560.0, isLocked: 1, modifiedTimestamp: 5214421031 },
  ],
  navigateFirstPage: 1,
  navigateLastPage: 3,
  navigatePages: 8,
  navigatepageNums: [1, 2, 3],
  nextPage: 2,
  pageNum: 1,
  pageSize: 5,
  pages: 3,
  prePage: 0,
  size: 5,
  startRow: 1,
  total: 6,
}
export function pntListList(req, res) {
  res.json(tableListDataSource);
}


export function pntListGetById(req, res, u) {
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

export function pntListAdd(req, res, u, b) {
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

export function pntListModify(req, res, u, b) {
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

export function pntListDel(req, res, u) {
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

export function pntListByAccountId(req, res, u) {
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

export function pntListRecharge(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const replacedIndex = tableListDataSource.findIndex(item => item.id === body.id);
  if (replacedIndex !== -1) {
    tableListDataSource.splice(replacedIndex, 1, body);
    return res.json({
      result: 1,
      msg: '充值成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '充值失败，找不到要充值的记录',
    });
  }
}