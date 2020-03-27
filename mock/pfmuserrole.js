import { parse } from 'url';
import { sucuserList2 } from './sucuser';
import { pfmroleList2 } from './pfmrole';

// mock tableListDataSource
const tableListDataSource = [{ id: '1', sysId: 'damai-admin', userId: '1', roleId: '1536131597090' }];

/**
 * 通过用户ID获取用户角色列表
 */
export function pfmuserroleListUserRoles(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const result = {};
  result.roles = pfmroleList2(params.sysId);
  result.existIds = [];
  for (const item of tableListDataSource) {
    if (item.sysId === params.sysId && item.userId === params.userId) {
      result.existIds.push(item.roleId);
    }
  }
  return res.json(result);
}

/**
 * 通过角色ID获取用户角色列表
 */
export function pfmuserroleListRoleUsers(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const result = {};
  result.users = sucuserList2(params.sysId);
  result.existIds = [];
  for (const item of tableListDataSource) {
    if (item.roleId === params.roleId) {
      result.existIds.push(item.userId);
    }
  }
  return res.json(result);
}
