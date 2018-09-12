import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 获取用户的角色列表
 * @param {{sysId:String,userId:String}} params 系统ID和用户ID
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
 * 修改用户的角色
 */
export async function modifyUserRoles(params) {
  return request('/pfm-svr/pfm/userrole', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

/**
 * 修改角色的用户
 */
export async function modifyRoleUsers(params) {
  return request('/pfm-svr/pfm/roleuser', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/pfm-svr/pfm/userrole`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}
