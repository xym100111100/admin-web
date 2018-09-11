import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/ord-svr/ord/order?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/ord-svr/ord/order/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/ord-svr/ord/order', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function canceldelivery(params) {
  return request('/ord-svr/ord/order/canceldelivery', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function cancel(params) {
  return request('/ord-svr/ord/order/cancel', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/ord-svr/ord/order', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/ord-svr/ord/order?${stringify(params)}`, {
    method: 'DELETE',
  });
}
