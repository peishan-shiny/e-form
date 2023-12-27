import request from '@/utils/request';

export function GetRDDList(data: GetList) {
  return request({
    url: '/GetRDDList',
    method: 'post',
    data,
  });
}
