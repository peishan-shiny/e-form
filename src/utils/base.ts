import {searchPerson} from '@/apis/baseAPI.js';

// 取同部門全部人員資料
export async function getPersonData(data: GetUserInfo) {
  const temp = await searchPerson(data).then((response: UserInfo[]) => {
    console.log("有呼叫", response)
    return response;
  })
  return temp
}