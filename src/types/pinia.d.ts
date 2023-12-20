// 取人員群組 後端回應的 資料型別定義
interface ResEmpGroup {
  GroupID: string,
  EmpId: string,
  EmpName: string,
  GroupName: string
}

// 取人員資料 給後端的 資料型別定義
interface GetUserInfo {
  DeptId: string, //部門代號
  EmpId: string, //工號
  Company: string //公司
}
// 取人員資料 後端回應的 資料型別定義
interface ResUserInfo {
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
}

// 取部門資料 給後端的 資料型別定義
interface GetBranchsInfo {
  DeptId: string, //部門代號
  DeptName: string, //部門名稱
}
// 取部門資料 後端回應的 資料型別定義
interface ResBranchsInfo {
  DeptId: string,
  DeptName: string,
  ResourcesId: string
}

// 取List 給後端的 資料型別定義
interface GetList {
  Formno: string,
  status: string,
  Coid: string,
  DeptId: string,
  Startdt: string,
  Enddt: string,
  Empid: string,
  type: string,
}
// 取List 後端回應的 資料型別定義
interface ResEGAList {
  EGAId: string,
  Status: string,
  ComId: string,
  DeptId: string,
  Ndate: string | null,
  Nqty: string | null,
  FixtureName: string | null,
  Explanation: string | null,
  Empid: string,
  STNAME: string,
  SIGNER: string,
  NextSIGNER: string,
  Company: string,
  DeptName: string,
  CreateDate: string,
  EmpName: string
}


