import request from '@/utils/request';

export function RDDAdd(data) {
  return request({
    url: '/RDDAdd',
    method: 'post',
    data,
  });
}
