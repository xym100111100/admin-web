import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/afc-svr/afc/withdraw?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/afc-svr/suc/org/getbyid?${stringify(params)}`);
}

export async function cancel(params) {
  return request(`/afc-svr/withdraw/cancel?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function review(params) {
  return request('/afc-svr/withdraw/ok', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deal(params) {
  return request(`/afc-svr/withdraw/deal?${stringify(params)}`, {
    method: 'PUT',
  });
}
