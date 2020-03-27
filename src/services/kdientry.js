import request from '../utils/request';

export async function add(params) {
  return request('/kdi-svr/kdi/logistic/entry', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
