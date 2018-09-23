import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/kdi-svr/kdi/logistic?${stringify(params)}`);
}

/**
 * 统计本组织一段时间内的下单量
 */
export async function reportOrderCountInPeriod(params) {
  return request(`/kdi-svr/kdi/logistic/report/ordercountinperiod?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/kdi-svr/kdi/logistic/getbyid?${stringify(params)}`);
}

export async function printpage(params) {
  return request(`/kdi-svr/kdi/logistic/printpage?${stringify(params)}`);
}

export async function add(params) {
  return request('/kdi-svr/kdi/logistic', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function modify(params) {
  return request('/kdi-svr/kdi/logistic', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function del(params) {
  return request(`/kdi-svr/kdi/logistic?${stringify(params)}`, {
    method: 'DELETE',
  });
}
