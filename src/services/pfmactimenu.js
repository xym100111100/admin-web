import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/pfm-svr/pfm/actimenu?${stringify(params)}`);
}

export async function listAll() {
  return request(`/pfm-svr/pfm/actimenu/listAll`);
}

export async function modify(params) {
  return request('/pfm-svr/pfm/actimenu', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
