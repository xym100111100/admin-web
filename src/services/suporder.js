import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/ord-svr/ord/order/supplier?${stringify(params)}`);
}

export async function buyrelation(params) {
  return request(`/ord-svr/ord/buyrelation/info?${stringify(params)}`);
}

export async function detail(params) {
  return request(`/ord-svr/ord/orderdetail/info?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/sup-svr/sup/order/getbyid?${stringify(params)}`);
}



export async function shipmentconfirmation(params) {
  return request('/ord-svr/ord/order/shipmentconfirmation', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function add(params) {
  return request('/sup-svr/sup/order', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/sup-svr/sup/order', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/sup-svr/sup/order?${stringify(params)}`, {
    method: 'DELETE',
  });
}
