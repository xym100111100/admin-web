import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id: '1',
    userId: 25354223546474870,
    realName: '马s云',
    idCard: '54531564864131345654654',
    applyState: 3,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '2',
    userId: 2534252347654870,
    realName: '马g云',
    idCard: '54533164864131345654654',
    applyState: 2,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '3',
    userId: 25342223474870,
    realName: '马云h',
    idCard: '54531624864131345654654',
    applyState: 1,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '4',
    userId: 25342231472540,
    realName: '马e云',
    idCard: '545316486413134566554654',
    applyState: -1,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '5',
    userId: 253422301472540,
    realName: '马e云',
    idCard: '545316486413134566554654',
    applyState: 1,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '6',
    userId: 342231472540,
    realName: '马e云',
    idCard: '545316486413134566554654',
    applyState: -1,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '7',
    userId: 3422031472540,
    realName: '马e云',
    idCard: '545316486413134566554654',
    applyState: 3,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '8',
    userId: 2534229031472540,
    realName: '马e云',
    idCard: '545316486413134566554654',
    applyState: 4,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '9',
    userId: 2542231094540,
    realName: '马e云',
    idCard: '545316486413134566554654',
    applyState: 2,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '10',
    userId: 2534223102540,
    realName: '马e云',
    idCard: '545316486413134566554654',
    applyState: 1,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '11',
    userId: 25347240,
    realName: '马e云',
    idCard: '545316486413134566554654',
    applyState: -1,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
  {
    id: '12',
    userId: 25342231470,
    realName: '马e云',
    idCard: '545316486413134566554654',
    applyState: 4,
    applyTime: '1995-03-16',
    applyType: '硬要申请',
    picOne:
      'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign=c337a423af51f3ded7bfb136f5879b7a/4034970a304e251fcbeb8811a786c9177f3e533e.jpg',
    picTwo: 'http://himg2.huanqiu.com/attachment2010/2017/0122/20170122022729130.jpg',
    picThree: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    picFour: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  },
];

export function rnarealnameList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  if (JSON.stringify(params) === '{}') {
    res.json(tableListDataSource);
  } else {
    if (params.userId !== null && params.userId !== '') {
      const eo = tableListDataSource.filter(item => item.userId === params.userId);
      res.json(eo);
    } else {
      if (params.applyState === null || params.applyState === 0) {
        res.json(tableListDataSource);
      } else {
        const eo = tableListDataSource.filter(item => item.applyState === params.applyState);
        res.json(eo);
      }
    }
  }
}

export function rnarealnameGetById(req, res, u) {
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

export function rnarealnameAdd(req, res, u, b) {
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

export function rnarealnameModify(req, res, u, b) {
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

export function rnarealnameDel(req, res, u) {
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
