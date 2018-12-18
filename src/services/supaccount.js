import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/ord-svr/ord/order/supplier/listOrderTrade?${stringify(params)}`);
}


export async function getById(params) {
  return request(`/sup-svr/sup/account/getbyid?${stringify(params)}`);
}

export async function add(params) {
  return request('/sup-svr/sup/account', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/sup-svr/sup/account', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/sup-svr/sup/account?${stringify(params)}`, {
    method: 'DELETE',
  });
}
