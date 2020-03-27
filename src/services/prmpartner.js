import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/prm-svr/prm/partner?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/onl-svr/onl/online/getonlines?${stringify(params)}`);
}

export async function add(params) {
  return request('/prm-svr/prm/partner', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/prm-svr/prm/partner', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function enable(params) {
  return request(`/prm-svr/prm/partner/enable?${stringify(params)}`, {
    method: 'PUT',
  });
}

