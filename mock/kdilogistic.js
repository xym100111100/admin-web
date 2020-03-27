import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 1,
    orderId: '1534231917620',
    shipperName: '邮政快递',
    logisticCode: '51115127207238',
    receiveName: '收件人姓名1',
    receiverMobile: 18278904219,
    senderMobile: 18707895796,
    senderName: '发件人姓名1',
    orderTitle: '桂圆五斤一件 鲜果优先派送',
    orderTime: '2018-06-15 14:12:22',
  },
  {
    id: 2,
    orderId: '153423191769460',
    shipperName: '邮政快递',
    logisticCode: '511151272072454',
    receiveName: '收件人姓名2',
    receiverMobile: 18278904219,
    senderMobile: 18707895796,
    senderName: '发件人姓名2',
    orderTitle: '桂圆五斤一件 鲜果优先派送',
    orderTime: '2000-09-15 14:12:22',
  },
  {
    id: 3,
    orderId: '1534231917640',
    shipperName: '邮政快递',
    logisticCode: '51115127207212',
    receiveName: '收件人姓名3',
    receiverMobile: 18278904219,
    senderMobile: 18707895796,
    senderName: '发件人姓名3',
    orderTitle: '香水柠檬来五斤 鲜果优先派送',
    orderTime: '2018-01-15 14:12:22',
  },
  {
    id: 4,
    orderId: '1534231917696',
    shipperName: '邮政快递',
    logisticCode: '51115127207232',
    receiveName: '收件人姓名4',
    receiverMobile: 18278904219,
    senderMobile: 18707895796,
    senderName: '发件人姓名4',
    orderTitle: '大台农',
    orderTime: '2008-06-15 14:12:22',
  },
];

export function kdilogisticList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  if (params.receiver_info === undefined || params.receiver_info === '') {
    return res.json(tableListDataSource);
  }
  const result = [];
  for (let i = 0; i < tableListDataSource.length; i++) {
    if (tableListDataSource[i].receive_name === params.receiver_info) {
      result.push(tableListDataSource[i]);
    }
  }
  return res.json(result);
}

export function kdilogisticGetById(req, res, u) {
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

export function kdilogisticAdd(req, res, u, b) {
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

export function kdilogisticModify(req, res, u, b) {
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

export function kdilogisticDel(req, res, u) {
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
