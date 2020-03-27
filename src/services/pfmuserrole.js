import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 获取用户的角色列表
 * @param {{sysId:String,userId:Number}} params 系统ID和用户ID
 */
export async function listUserRoles(params) {
  return request(`/pfm-svr/pfm/userrole?${stringify(params)}`);
}

/**
 * 根据角色ID获取角色的用户列表
 * @param {{roleId:String}} params 角色ID
 */
export async function listRoleUsers(params) {
  return request(`/pfm-svr/pfm/roleuser?${stringify(params)}`);
}

/**
 * 查询已添加的用户
 */
export async function listAddedUsers(params) {
  return request(`/pfm-svr/pfm/userrole/listaddedusers?${stringify(params)}`);
}

/**
 * 查询未添加的用户
 */
export async function listUnaddedUsers(params) {
  return request(`/pfm-svr/pfm/userrole/listunaddedusers?${stringify(params)}`);
}

/**
 * 查询已添加与未添加的用户
 */
export async function listAddedAndUnaddedUsers(params) {
  return request(`/pfm-svr/pfm/userrole/listaddedandunaddedusers?${stringify(params)}`);
}

/**
 * 给用户添加角色
 */
export async function addRoles(params) {
  return request('/pfm-svr/pfm/userrole', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 移除用户的角色
 */
export async function delRoles(params) {
  return request('/pfm-svr/pfm/userrole', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

/**
 * 添加用户到角色中
 */
export async function addUsers(params) {
  return request('/pfm-svr/pfm/roleuser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/**
 * 从角色中移除用户
 */
export async function delUsers(params) {
  return request('/pfm-svr/pfm/roleuser', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

// export async function del(params) {
//   return request(`/pfm-svr/pfm/userrole`, {
//     method: 'DELETE',
//     body: {
//       ...params,
//     },
//   });
// }
