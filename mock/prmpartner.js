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
    { id: '2321328528', partnerName: '大卖', companyAddress: '安吉', contact: '11212121', orgId: "121212120", partnerType: "2", isEnabled: true, salesmanId: "1122121", remark: "12121", createTime: "2018年10月25日17:13:57" },
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

export function prmPartnerList(req, res) {
  res.json(tableListDataSource);
}

export function prmPartnerGetById(req, res, u) {
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

export function prmPartnerAdd(req, res, u, b) {
  const body = (b && b.body) || req.body;

  if (Math.random() >= 0.495) {
    // body.id = tableListDataSource.length + 1;
    tableListDataSource.list.push(body);
    return res.json({
      result: 1,
      msg: '添加伙伴成功',
    });
  } else {
    return res.json({
      result: -1,
      msg: '添加失败，伙伴已存在',
    });
  }
}

export function prmPartnerModify(req, res, u, b) {
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

export function prmPartnerDel(req, res, u) {
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
