import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 154631651464,
    shipper_id: '482812906476535809',
    shipper_name: '邮政快递',
    logistic_code: '1234567891234567891',
    receive_name: '测试',
    sender_name: '测试',
    goods_info: '大台农',
    order_time: '2018-06-15',
  },
  {
    id: 15463165235,
    shipper_id: '482812906476535809',
    shipper_name: '邮政快递',
    logistic_code: '1234567891234567891',
    receive_name: '测试',
    sender_name: '测试',
    goods_info: '大台农',
    order_time: '2018-06-15',
  },
  {
    id: 154646451464,
    shipper_id: '482812906476535809',
    shipper_name: '邮政快递',
    logistic_code: '1234567891234567891',
    receive_name: '测试',
    sender_name: '测试',
    goods_info: '大台农',
    order_time: '2018-06-15',
  },
  {
    id: 154658751464,
    shipper_id: '482812906476535809',
    shipper_name: '邮政快递',
    logistic_code: '1234567891234567891',
    receive_name: '测试',
    sender_name: '测试',
    goods_info: '大台农',
    order_time: '2018-06-15',
  },
];

export function kdilogisticList(req, res) {
  res.json(tableListDataSource);
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
