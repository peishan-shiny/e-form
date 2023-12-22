// 取人員群組 後端回應的
interface ResEmpGroup {
  GroupID: string,
  EmpId: string,
  EmpName: string,
  GroupName: string
}

// 取人員資料 給後端
interface GetUserInfo {
  DeptId: string, //部門代號
  EmpId: string, //工號
  Company: string //公司
}
// 取人員資料 後端回應的
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

// 取部門資料 給後端
interface GetBranchsInfo {
  DeptId: string, //部門代號
  DeptName: string, //部門名稱
}
// 取部門資料 後端回應的
interface ResBranchsInfo {
  DeptId: string,
  DeptName: string,
  ResourcesId: string
}

// 取List 給後端
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
// 取List 後端回應的
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

// 附件上傳後端 後端回應
interface ResUploadFile {
  EmpId: string
  FormId: string
  WebName: string
  filename: string
  success: boolean
}

// 取下一位簽核人員 後端回應
interface ResNextSigner {
  FORMNO: string,
  SIGNORDER: number | string,
  STEPNAME: string,
  SIGNER: string,
  SIGNERNAME: string,
  ACTUALNAME: string,
  ACTUALSIGNER: string,
  SIGNRESULT: number | string,
  OPINION: string,
  SIGNTIME: null | any,
  ALLOWCUSTOM: boolean,
  SignGroup: string,
  ISEnable: string | boolean,
  types: string,
  ExceId: null | any,
  Status: null | any
}

// 寄信 給後端
interface GetSendMail {
  Empid: string, //工號
  Sub: string, //主旨
  Messg: string, //內文
}

// 定義軟體申請單create的值
interface SoftCreateValue {
  // 申請單位
  applyDept: string,
  // 申請原因
  applyReason: string,
  // 程式版號
  programV: string,
  // SVNV
  SVNV: string,
  // 程式名稱
  programName: string,
  // 適用機種
  Model: string,
  // IC
  IC: string,
  // 申請地區
  applyArea: string[],
  // 申請類別
  applyType: string[],
  // 四階料號
  bomElno: string,
  // Model NO
  modelNO: string,
  // 蘇州四階料號
  suzobomElno: string,
  // 蘇州Model NO
  suzoModelNO: string,
  // 修改前內容
  reviseB: string,
  // 修改後內容
  reviseA: string,
  // 相關文件是否修改
  reviseDoc: string,
  // 選擇修改文件
  choiceDoc: string[],
}

// 測試用
interface test {
  OEDId: string, //單號
  ProCode: string, //專案代號
  Status: string, //狀態  
  ComId: string,
  DeptId: string,
  FILENAME: string, //檔案名稱
  VERSION: string, //版次      
  Createid: string,
  CreateDate: string,
  ProName: string,
  Type: string,
}




