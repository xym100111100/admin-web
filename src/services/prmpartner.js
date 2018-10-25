import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/prm-svr/prm/partner?${stringify(params)}`);
}

export async function getById(params) {
  return request(`/onl-svr/onl/online/getonlines?${stringify(params)}`);
}

export async function add(params) {
  console.log(params);

  return request('/prm-svr/prm/partner', {
    method: 'POST',
    body: {
      ...params,
    },
  });
  // return request(`/prm-svr/prm/partner?${stringify(params)}`, {
  //   method: 'POST'
  // });
}
