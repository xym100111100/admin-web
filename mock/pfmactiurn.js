import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: 1,
    actiId: 1536131597087,
    urn: 'GET:/pfm-svr/sys',
  },
  {
    id: 1,
    actiId: 1536131597088,
    urn: 'GET:/pfm-svr/sys/getbyid',
  },
  {
    id: 3,
    actiId: 1536131597088,
    urn: 'POST:/pfm-svr/sys',
  },
  {
    id: 4,
    actiId: 1536131597088,
    urn: 'PUT:/pfm-svr/sys',
  },
  {
    id: 5,
    actiId: 1536131597088,
    urn: 'DELETE:/pfm-svr/sys',
  },
  {
    id: 6,
    actiId: 1536131597089,
    urn: 'GET:/pfm-svr/menu',
  },
  {
    id: 7,
    actiId: 1536131597090,
    urn: 'GET:/pfm-svr/menu/getbyid',
  },
  {
    id: 8,
    actiId: 1536131597090,
    urn: 'POST:/pfm-svr/menu',
  },
  {
    id: 9,
    actiId: 1536131597090,
    urn: 'PUT:/pfm-svr/menu',
  },
  {
    id: 10,
    actiId: 1536131597090,
    urn: 'PUT:/pfm-svr/menu/sort',
  },
  {
    id: 11,
    actiId: 1536131597090,
    urn: 'PUT:/pfm-svr/menu/enable',
  },
  {
    id: 12,
    actiId: 1536131597090,
    urn: 'DELETE:/pfm-svr/menu',
  },
  {
    id: 13,
    actiId: 1536131597091,
    urn: 'GET:/pfm-svr/func',
  },
  {
    id: 14,
    actiId: 1536131597091,
    urn: 'GET:/pfm-svr/func/getbyid',
  },
  {
    id: 15,
    actiId: 1536131597092,
    urn: 'POST:/pfm-svr/func',
  },
  {
    id: 16,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/func',
  },
  {
    id: 17,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/func/sort',
  },
  {
    id: 18,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/func/enable',
  },
  {
    id: 19,
    actiId: 1536131597092,
    urn: 'DELETE:/pfm-svr/func',
  },
  {
    id: 20,
    actiId: 1536131597092,
    urn: 'GET:/pfm-svr/acti/getbyid',
  },
  {
    id: 21,
    actiId: 1536131597092,
    urn: 'POST:/pfm-svr/acti',
  },
  {
    id: 22,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/acti',
  },
  {
    id: 23,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/acti/sort',
  },
  {
    id: 24,
    actiId: 1536131597092,
    urn: 'DELETE:/pfm-svr/acti',
  },
  {
    id: 25,
    actiId: 1536131597092,
    urn: 'GET:/pfm-svr/actimenu',
  },
  {
    id: 26,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/actimenu',
  },
  {
    id: 27,
    actiId: 1536131597092,
    urn: 'GET:/pfm-svr/actiurn',
  },
  {
    id: 28,
    actiId: 1536131597092,
    urn: 'PUT:/pfm-svr/actiurn',
  },
  {
    id: 29,
    actiId: 1536131597093,
    urn: 'GET:/pfm-svr/role',
  },
  {
    id: 30,
    actiId: 1536131597094,
    urn: 'GET:/pfm-svr/role/getbyid',
  },
  {
    id: 31,
    actiId: 1536131597094,
    urn: 'POST:/pfm-svr/role',
  },
  {
    id: 32,
    actiId: 1536131597094,
    urn: 'PUT:/pfm-svr/role',
  },
  {
    id: 33,
    actiId: 1536131597094,
    urn: 'PUT:/pfm-svr/role/sort',
  },
  {
    id: 34,
    actiId: 1536131597094,
    urn: 'PUT:/pfm-svr/role/enable',
  },
  {
    id: 35,
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
