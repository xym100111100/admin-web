import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 1536131597087,
    actiId: 1536131597087,
    urn: 'GET:/pfm-svr/sys',
  },
  {
    id: 1536131597088,
    actiId: 1536131597088,
    urn: 'GET:/pfm-svr/sys/getbyid',
  },
  {
    id: 1536131597089,
    actiId: 1536131597088,
    urn: 'POST:/pfm-svr/sys',
  },
  {
    id: 1536131597090,
    actiId: 1536131597088,
    urn: 'PUT:/pfm-svr/sys',
  },
  {
    id: 1536131597091,
    actiId: 1536131597088,
    urn: 'DELETE:/pfm-svr/sys',
  },
  {
    id: 1536131597092,
    actiId: 1536131597089,
    urn: 'GET:/pfm-svr/menu',
  },
  {
    id: 1536131597093,
    actiId: 1536131597090,
    urn: 'GET:/pfm-svr/menu/getbyid',
  },
  {
    id: 1536131597094,
    actiId: 1536131597090,
    urn: 'POST:/pfm-svr/menu',
  },
  {
    id: 1536131597095,
    actiId: 1536131597090,
    urn: 'PUT:/pfm-svr/menu',
  },
  {
    id: 1536131597096,
    actiId: 1536131597090,
    urn: 'PUT:/pfm-svr/menu/sort',
  },
  {
    id: 1536131597097,
    actiId: 1536131597090,
    urn: 'PUT:/pfm-svr/menu/enable',
  },
  {
    id: 1536131597098,
    actiId: 1536131597090,
    urn: 'DELETE:/pfm-svr/menu',
  },
  {
    id: 1536131597099,
    actiId: 1536131597091,
    urn: 'GET:/pfm-svr/func',
  },
  {
    id: 1536131597100,
    actiId: 1536131597091,
    urn: 'GET:/pfm-svr/func/getbyid',
  },
  {
    id: 1536131597101,
    actiId: 1536131597092,
    urn: 'POST:/pfm-svr/func',
  },
  {
    id: 1536131597102,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/func',
  },
  {
    id: 1536131597103,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/func/sort',
  },
  {
    id: 1536131597104,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/func/enable',
  },
  {
    id: 1536131597105,
    actiId: 1536131597092,
    urn: 'DELETE:/pfm-svr/func',
  },
  {
    id: 1536131597106,
    actiId: 1536131597092,
    urn: 'GET:/pfm-svr/acti/getbyid',
  },
  {
    id: 1536131597107,
    actiId: 1536131597092,
    urn: 'POST:/pfm-svr/acti',
  },
  {
    id: 1536131597108,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/acti',
  },
  {
    id: 1536131597109,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/acti/sort',
  },
  {
    id: 1536131597110,
    actiId: 1536131597092,
    urn: 'DELETE:/pfm-svr/acti',
  },
  {
    id: 1536131597111,
    actiId: 1536131597092,
    urn: 'GET:/pfm-svr/actimenu',
  },
  {
    id: 1536131597112,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/actimenu',
  },
  {
    id: 1536131597113,
    actiId: 1536131597092,
    urn: 'GET:/pfm-svr/actiurn',
  },
  {
    id: 1536131597114,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/actiurn',
  },
  {
    id: 1536131597115,
    actiId: 1536131597093,
    urn: 'GET:/pfm-svr/role',
  },
  {
    id: 1536131597116,
    actiId: 1536131597094,
    urn: 'GET:/pfm-svr/role/getbyid',
  },
  {
    id: 1536131597117,
    actiId: 1536131597094,
    urn: 'POST:/pfm-svr/role',
  },
  {
    id: 1536131597118,
    actiId: 1536131597094,
    urn: 'PUT:/pfm-svr/role',
  },
  {
    id: 1536131597119,
    actiId: 1536131597094,
    urn: 'PUT:/pfm-svr/role/sort',
  },
  {
    id: 1536131597120,
    actiId: 1536131597094,
    urn: 'PUT:/pfm-svr/role/enable',
  },
  {
    id: 1536131597121,
    actiId: 1536131597094,
    urn: 'DELETE:/pfm-svr/role',
  },
];

export function pfmactiurnList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const result = [];
  for (const item of tableListDataSource) {
    if (item.actiId === params.actiId - 0) {
      result.push(item);
    }
  }
  return res.json(result);
}

export function pfmactiurnModify(req, res, u, b) {
  const body = (b && b.body) || req.body;
  for (let index = tableListDataSource.length - 1; index >= 0; index--) {
    if (tableListDataSource[index].actiId === body.actiId) {
      tableListDataSource.splice(index, 1);
    }
  }
  if (body.urns) {
    for (const urn of body.urns) {
      const actiUrn = {};
      actiUrn.id = new Date().getTime();
      actiUrn.actiId = body.actiId;
      actiUrn.urn = urn;
      tableListDataSource.push(actiUrn);
    }
  }

  return res.json({
    result: 1,
    msg: '修改成功',
  });
}
