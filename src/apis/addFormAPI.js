import request from '@/utils/request';

export function OEDAdd(data) {
  return request({
    url: '/OEDAdd',
    method: 'post',
    data,
  });
}
