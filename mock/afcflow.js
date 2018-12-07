import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [
  {
    id:'1',
    accountName: '黑色幽默',
    tradeType:'余额充值' ,
    tradeAmount:'33' ,
    tradeTime:'2018-06-15 14:12:22',
    opName:'黑色幽默' ,
  }
];

export function tradeList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  if (params.receiver_info === undefined || params.receiver_info === '') {
    console.info(tableListDataSource);
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