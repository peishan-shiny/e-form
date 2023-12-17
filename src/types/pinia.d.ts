// 取人員資料 給後端的資料型別
declare interface GetUserInfo{
DeptId: string, //部門代號
EmpId: string, //工號
Company: string //公司
}

// 取人員資料 後端回應的資料型別
declare interface UserInfo {
  data:[{
    DeptId: string,
    DeptName: string,
    DeptName_E: string,
    EmpId: string,
    EmpName: string,
    ResourcesId: string,
    ResourcesName: string,
    ResourcesName_E: string,
    Compose: string,
    FullName: string,
    Title: string,
    Language: string,
    Email: string,
    type: string
  }]
}
