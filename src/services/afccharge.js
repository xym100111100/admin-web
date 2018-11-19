import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  console.info(6666);
  return request(`/afc-svr/afc/chargeList?${stringify(params)}`);
}

export async function chargeForPerson(params) {
    return request('/afc-svr/charge', {
        method: 'POST',
        body: {
          ...params,
        },
      });
}

export async function chargeForPlatform(params) {
  return request('/afc-svr/afc/platform/charge', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

