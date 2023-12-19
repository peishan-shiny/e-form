// 取人員資料 給後端的 資料型別定義
interface GetUserInfo {
  DeptId: string, //部門代號
  EmpId: string, //工號
  Company: string //公司
}

// 人員資料  資料型別定義
interface UserInfo {
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

// 取人員資料 後端回應的 資料型別定義
interface ResUserInfo {
  data: UserInfo[]
}

// 取部門資料 給後端的 資料型別定義
interface GetBranchsInfo {
  DeptId: string, //部門代號
  DeptName: string, //部門名稱
}

// 取部門資料 後端回應的 資料型別定義
interface ResBranchsInfo {
  data: BranchsInfo[]
}

interface BranchsInfo {
  DeptId: string,
  DeptName: string,
  ResourcesId: string
}

