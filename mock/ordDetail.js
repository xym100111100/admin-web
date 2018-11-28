import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
    {
      id: 1,
      subjectType:0,
      receiverName:'maomi',
      orderCode:4556,
      orderState:2,
      orderRemarks:'备注',
      receiverProvince:'广西',
      receiverCity:'南宁',
      receiverExpArea:'西乡塘',
      receiverAddress:'保护伞公司',
      receiverMobile:12345,
      receiverTel:321,
      receiverPostCode:124154,
      senderInfo:'1564156/54654/64',
      shipperInfo:'65465/524587/15454',
      allDetaileId:[132154564,6356146351],
      senderPostCode:'00000',
      buyCount:2,
      returnCount:1,
      onlineTitle:'跑车',
      specName:'林肯加长版',
      buyPrice:11,
      deliver:true,
    },
    {
      id: 2,
      subjectType:0,
      receiverName:'maomi',
      orderCode:4556,
      orderState:2,
      orderRemarks:'备注',
      receiverProvince:'广西',
      receiverCity:'南宁',
      receiverExpArea:'广东省',
      receiverAddress:'宝安区',
      receiverMobile:12345,
      receiverTel:321,
      receiverPostCode:124154,
      senderInfo:'1564156/54654/64',
      shipperInfo:'65465/524587/15454',
      allDetaileId:[132154564,6356146351],
      senderPostCode:'00000',
      buyCount:2,
      returnCount:1,
      onlineTitle:'保时捷',
      specName:'911限量版',
      buyPrice:11,
      deliver:false,
    },
    {
      id: 3,
      subjectType:0,
      receiverName:'maomi',
      orderCode:4556,
      orderState:2,
      orderRemarks:'备注',
      receiverProvince:'广西',
      receiverCity:'南宁',
      receiverExpArea:'广东省',
      receiverAddress:'宝安区',
      receiverMobile:12345,
      receiverTel:321,
      receiverPostCode:124154,
      senderInfo:'1564156/54654/64',
      shipperInfo:'65465/524587/15454',
      allDetaileId:[132154564,6356146351],
      senderPostCode:'00000',
      buyCount:2,
      returnCount:1,
      onlineTitle:'劳斯莱斯',
      specName:'幻影',
      buyPrice:11,
      deliver:false,
    },
  ]







export function detail(req, res) {
  console.log("2222222222222222222222222222222222")
  res.json(tableListDataSource);
}

export function ordorderGetById(req, res, u) {
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

export function ordorderAdd(req, res, u, b) {
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

export function ordorderModify(req, res, u, b) {
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

export function ordorderDel(req, res, u) {
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
