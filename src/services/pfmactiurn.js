import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/pfm-svr/pfm/actiurn?${stringify(params)}`);
}

export async function modify(params) {
  return request('/pfm-svr/pfm/actiurn', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
