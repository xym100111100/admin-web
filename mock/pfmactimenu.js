import { parse } from 'url';
import IdUtils from '../src/utils/IdUtils';

// mock tableListDataSource
const tableListDataSource = [
  {id:'582097020261629953',menuId:'1536131597087',actiId:'1536131597087'},
  {id:'582097020475539458',menuId:'1536131597088',actiId:'1536131597087'},
  {id:'582097020500705283',menuId:'1536131597089',actiId:'1536131597087'},
  {id:'582097020551036932',menuId:'1536131597090',actiId:'1536131597087'},
  {id:'582097020618145798',menuId:'1536131597091',actiId:'1536131597087'},
  {id:'582097020601368581',menuId:'1536131597092',actiId:'1536131597087'},
  {id:'582097020643311623',menuId:'1536131597093',actiId:'1536131597087'},
  {id:'582097020676866056',menuId:'1536131597094',actiId:'1536131597087'},
  {id:'582097020706226185',menuId:'1536131597095',actiId:'1536131597087'},
  {id:'582097020769140747',menuId:'1536131597096',actiId:'1536131597087'},
  {id:'582097020815278092',menuId:'1536131597097',actiId:'1536131597087'},
  {id:'582097020869804045',menuId:'1536131597098',actiId:'1536131597087'},
  {id:'582097020899164174',menuId:'1536131597099',actiId:'1536131597087'},
  {id:'582097020991438863',menuId:'1536131597100',actiId:'1536131597087'},
  {id:'582097021033381904',menuId:'1536131597101',actiId:'1536131597087'},
  {id:'582097021083713553',menuId:'1536131597102',actiId:'1536131597087'},
  {id:'582097021121462290',menuId:'1536131597103',actiId:'1536131597087'},
  {id:'582097021155016723',menuId:'1536131597104',actiId:'1536131597087'},
  {id:'582097021222125588',menuId:'1536131597105',actiId:'1536131597087'},
  {id:'582097020232269824',menuId:'1536131597106',actiId:'1536131597087'},
  {id:'582097021285040149',menuId:'1536131597107',actiId:'1536131597087'},
  {id:'582097021318594582',menuId:'1536131597108',actiId:'1536131597087'},
  {id:'582097021436035096',menuId:'1536131597109',actiId:'1536131597087'},
  {id:'582097021373120535',menuId:'1536131597110',actiId:'1536131597087'},
  {id:'582097021507338265',menuId:'1536131597111',actiId:'1536131597087'},
  {id:'582097021570252826',menuId:'1536131597112',actiId:'1536131597087'},
  {id:'582097021591224347',menuId:'1536131597113',actiId:'1536131597087'},
  {id:'582097021666721820',menuId:'1536131597145',actiId:'1536131597087'},
  {id:'582097021725442077',menuId:'1536131597146',actiId:'1536131597087'},
  {id:'582097021746413598',menuId:'1536131597147',actiId:'1536131597087'},
  {id:'582097021775773727',menuId:'1536131597148',actiId:'1536131597087'},
  {id:'582097021826105376',menuId:'1536131597149',actiId:'1536131597087'},
  {id:'582097021893214242',menuId:'1536131597150',actiId:'1536131597087'},
  {id:'582097021998071845',menuId:'1536131597151',actiId:'1536131597087'},
  {id:'582097021930962979',menuId:'1536131597152',actiId:'1536131597087'},
  {id:'582097021964517412',menuId:'1536131597153',actiId:'1536131597087'},
  {id:'582097022027431974',menuId:'1536131597154',actiId:'1536131597087'},
  {id:'582097022174232616',menuId:'1536131597155',actiId:'1536131597087'},
  {id:'582097022224564265',menuId:'1536131597156',actiId:'1536131597087'},
  {id:'582097021859659809',menuId:'1536131597157',actiId:'1536131597087'},
  {id:'582097022090346535',menuId:'1536131597158',actiId:'1536131597087'},
  {id:'582097022291673130',menuId:'1536131597159',actiId:'1536131597087'},
  {id:'582097022325227563',menuId:'1536131597160',actiId:'1536131597087'},
  {id:'582097022354587692',menuId:'1536131597161',actiId:'1536131597087'},
  {id:'582097022379753517',menuId:'1536131597162',actiId:'1536131597087'},
  {id:'582097020727197706',menuId:'1536131597163',actiId:'1536131597087'},
  {id:'582097022409113646',menuId:'1536131597164',actiId:'1536131597087'},
  {id:'582097022455250991',menuId:'1536131597165',actiId:'1536131597087'},
  {id:'582097022492999728',menuId:'1536131597166',actiId:'1536131597087'},
  {id:'1536131597088',menuId:'1536131597106',actiId:'1536131597088'},
  {id:'1536131597089',menuId:'1536131597107',actiId:'1536131597089'},
  {id:'1536131597090',menuId:'1536131597107',actiId:'1536131597090'},
  {id:'1536131597091',menuId:'1536131597108',actiId:'1536131597091'},
  {id:'1536131597092',menuId:'1536131597108',actiId:'1536131597092'},
  {id:'1536131597093',menuId:'1536131597109',actiId:'1536131597093'},
  {id:'1536131597094',menuId:'1536131597109',actiId:'1536131597094'},
];

export function pfmactimenuList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const result = [];
  if(params.actiId  === undefined){
    return   res.json(tableListDataSource);
  }
  for (const item of tableListDataSource) {
    if (item.actiId === params.actiId ) {
      result.push(item);
    }
  }
  return res.json(result);
}


export function pfmactimenuListAll(req, res) {
  res.json(tableListDataSource);
}

export function pfmactimenuModify(req, res, u, b) {
  const body = (b && b.body) || req.body;
  for (let index = tableListDataSource.length - 1; index >= 0; index--) {
    if (tableListDataSource[index].actiId === body.actiId) {
      tableListDataSource.splice(index, 1);
    }
  }
  if (body.menuIds) {
    for (const id of body.menuIds) {
      const actiMenu = {};
      actiMenu.id = IdUtils.genId();
      actiMenu.actiId = body.actiId;
      actiMenu.menuId = id;
      tableListDataSource.push(actiMenu);
    }
  }

  return res.json({
    result: 1,
    msg: '修改成功',
  });
}
