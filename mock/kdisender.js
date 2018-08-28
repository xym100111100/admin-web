import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    senderId: '1234556',
    isDefault: '1',
    senderName: '微薄利',
    senderTel: '124563254',
    senderMobile: '4516135846',
    senderPostCode: '530000',
    senderaddr: ['广西壮族自治区', '南宁市', '西乡塘区'],
    senderAddress: '华尔街工谷',
    orgId: 253274870,
    senderProvince: '广西壮族自治区',
    senderCity: '南宁市',
    senderExpArea: '西乡塘区',
  },
  {
    key: '1',
    senderId: '1234556',
    isDefault: '0',
    senderName: '微薄利',
    senderTel: '1111111',
    senderMobile: '4516135846',
    senderPostCode: '530000',
    senderaddr: ['广西壮族自治区', '南宁市', '西乡塘区'],
    senderAddress: '华尔街工谷',
    orgId: 253274870,
    senderProvince: '广西壮族自治区',
    senderCity: '南宁市',
    senderExpArea: '西乡塘区',
  },
  {
    key: '2',
    senderId: '1234556',
    isDefault: '0',
    senderName: '微薄利',
    senderTel: '22222',
    senderMobile: '4516135846',
    senderPostCode: '530000',
    senderaddr: ['广西壮族自治区', '南宁市', '西乡塘区'],
    senderAddress: '华尔街工谷',
    orgId: 253274870,
    senderProvince: '广西壮族自治区',
    senderCity: '南宁市',
    senderExpArea: '西乡塘区',
  },
  {
    key: '3',
    senderId: '1234556',
    isDefault: '0',
    senderName: '微薄利',
    senderTel: '333333',
    senderMobile: '4516135846',
    senderPostCode: '530000',
    senderaddr: ['广西壮族自治区', '南宁市', '西乡塘区'],
    senderAddress: '华尔街工谷',
    orgId: 253274870,
    senderProvince: '广西壮族自治区',
    senderCity: '南宁市',
    senderExpArea: '西乡塘区',
  },
  {
    key: '3',
    senderId: '1234556',
    isDefault: '0',
    senderName: '微薄利',
    senderTel: '333333',
    senderMobile: '4516135846',
    senderPostCode: '530000',
    senderaddr: ['广西壮族自治区', '南宁市', '西乡塘区'],
    senderAddress: '华尔街工谷',
    orgId: 253274870,
    senderProvince: '广西壮族自治区',
    senderCity: '南宁市',
    senderExpArea: '西乡塘区',
  },
];

export function kdiSenderList(req, res) {
  res.json(tableListDataSource);
}

export function getDefaultSender(req, res) {
  res.json(tableListDataSource[0]);
}

export function modifyDefaultSender(req, res, u, b) {
  const body = (b && b.body) || req.body;
  console.info(body);
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

export function kdisenderGetById(req, res, u) {
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

export function addKdiSender(req, res, u, b) {
  const body = (b && b.body) || req.body;
  console.info(body);
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

export function kdisenderAdd(req, res, u, b) {
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

export function kdisenderModify(req, res, u, b) {
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

export function kdisenderDel(req, res, u) {
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
