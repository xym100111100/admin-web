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
 * 添加角色到用户中
 */
export async function addRoles(params) {
  return request('/pfm-svr/pfm/roleuser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 从用户中移除角色
 */
export async function removeRoles(params) {
  return request('/pfm-svr/pfm/roleuser', {
    method: 'DELETE',
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
