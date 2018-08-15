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
    {
      id: '1',
      name: '易微利',
      remark: '易微利超市',
    },
    {
      id: '472560881448779779',
      name: '大卖',
      remark: '大卖科技有限公司',
    },
    {
      id: '472560883663372292',
      name: '微薄利',
      remark: '微薄利科技有限公司',
    },
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
  total: '3',
};

export function sucUserOrgList(req, res) {
  res.json(tableListDataSource);
}

export function sucUserOrgGetById(req, res, u) {
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

export function sucUserOrgAdd(req, res, u, b) {
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

export function sucUserOrgModify(req, res, u, b) {
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
