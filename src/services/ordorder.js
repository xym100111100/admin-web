import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/ord-svr/ord/order?${stringify(params)}`);
}

export async function buyrelation(params) {
  return request(`/ord-svr/ord/buyrelation/info?${stringify(params)}`);
}

export async function detail(params) {
  return request(`/ord-svr/ord/orderdetail/info?${stringify(params)}`);
}

export async function detailList(params) {
  return request(`/ord-svr/ord/detailList?${stringify(params)}`);
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

export async function shipmentconfirmation(params) {
  return request('/ord-svr/ord/order/shipmentconfirmation', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function splitPackageDeliver(params) {
  return request('/ord-svr/ord/order/splitPackageDeliver', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function getTrace(params) {
  return request('/ord-svr/ord/order/sendBySupplier', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}



export async function modifyOrderRealMoney(params) {
  return request('/ord-svr/ord/order', {
    method: 'PUT',
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

export async function updateOrg(params) {
  return request('/ord-svr/ord/order/updateOrg', {
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

export async function modifyOrderShippingAddress(params) {
  return request(`/ord-svr/ord/order/modifyreceiverinfo?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function getSettleTotal(params) {
  return request(`/ord-svr/ord/order/getSettleTotal?${stringify(params)}`);
}



export async function getUnshipmentsByDeliverOrgId(params) {
  return request(`/ord-svr/ord/order/unshipments?${stringify(params)}`);
}