import { stringify } from 'qs';
import request from '../utils/request';

export async function personList(params) {
  return request(`/afc-svr/afc/personTradeList?${stringify(params)}`);
}

export async function orgList(params) {
  return request(`/afc-svr/afc/orgTradeList?${stringify(params)}`);
}

export async function orgTrade(params) {
  return request(`/afc-svr/afc/orgTrade?${stringify(params)}`);
}

export async function tradeList(params) {
  return request(`/afc-svr/afc/trade?${stringify(params)}`);
}
