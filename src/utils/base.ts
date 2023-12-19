import baseAPI from '@/apis/baseAPI.js';

// 取同部門全部人員資料
export async function getPersonData(data: GetUserInfo) {
  const temp = await baseAPI.searchPerson(data).then((response: ResUserInfo) => {
    console.log("有呼叫", response.data)
    return response.data;
  })
  return temp
}