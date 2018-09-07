import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/onl-svr/onl/online?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/onl-svr/onl/online/getonlines?${stringify(params)}`);
}

export async function add(params) {
  return request('/onl-svr/onl/online', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function cancelPromotion(params) {
  return request(`/onl-svr/onl/onlinepromotion?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function tapeOut(params) {
  return request(`/onl-svr/onl/online?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function append(params) {
  return request('/onl-svr/onl/onlinespec/append', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
