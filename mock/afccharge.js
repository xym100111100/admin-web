import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];

export function chargeForPerson(req, res, u, b) {
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

export function chargeForPlatForm(req, res, u, b) {
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