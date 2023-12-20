import request from '@/utils/request';

export function GetEGAList(data) {
  return request({
    url: '/GetEGAList',
    method: 'post',
    data,
  });
}
