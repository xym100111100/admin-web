import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/suc-svr/suc/user?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/suc-svr/suc/user/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/suc-svr/suc/user', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/suc-svr/suc/user', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function enable(params) {
  return request('/suc-svr/suc/user/enable', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function removeLoginPassWord(params) {
  return request(`/suc-svr/suc/user/del/loginpassword?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function removePayPassWord(params) {
  return request(`/suc-svr/suc/user/del/paypassword?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function unbindWeChat(params) {
  return request(`/suc-svr/suc/user/unbindwechat?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function unbindQQ(params) {
  return request(`/suc-svr/suc/user/unbindqq?${stringify(params)}`, {
    method: 'PUT',
  });
}
