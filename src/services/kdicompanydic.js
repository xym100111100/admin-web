import { stringify } from 'qs';
import request from '../utils/request';


export async function list() {
  return request(`/kdi-svr/kdi/companydic`);
}
