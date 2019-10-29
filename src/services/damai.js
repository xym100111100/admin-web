import request from '../utils/request';
import { stringify } from 'qs';

export async function listOrgAccount(params) {
  return request(`/damai-svr/damaisuc/listOrgAccount?${stringify(params)}`);
}

export async function apply(params) {
  return request('/damai-svr/withdraw/apply', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


export async function review(params) {
  return request('/damai-svr/withdraw/ok', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}