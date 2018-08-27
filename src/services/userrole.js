import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/pfm-svr/pfm/userroleandrole?${stringify(params)}`);
}

export async function userList(params) {
  return request(`/pfm-svr/pfm/userrole/listuserbysysidandroleid?${stringify(params)}`);
}

export async function add(params) {
  return request('/pfm-svr/pfm/userrole', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function addEx(params) {
  return request('/pfm-svr/pfm/userrole', {
    method: 'POST',
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
