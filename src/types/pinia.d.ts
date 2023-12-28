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
  EmpId: string | string[], //工號
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

// 附件上傳後端 後端回應
interface ResUploadFile {
  EmpId: string,
  FormId: string,
  WebName: string,
  filename: string,
  success: boolean
}
// 取原附件 給後端/後端回應
interface ResFile {
  FileId: string,
  FileName: string,
  FilePath: string,
  WebName: string,
  WebID: string,
  ExecID: string,
  SIGNORDER?: string,
}

// 取簽核附件 給後端/後端回應
interface ResSignFile {
  FileId: string,
  FileName: string,
  FilePath: string,
  WebName: string,
  WebID: string,
  ExecID: string,
  SIGNORDER: string,
}

// 取下一位簽核人員 後端回應
interface ResSigner {
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
  // signFile?: any,
}

// 寄信 給後端
interface GetSendMail {
  Empid: string, //工號
  Sub: string, //主旨
  Messg: string, //內文
}

// 取列表  給後端
interface GetList {
  Formno?: string | string[],
  status: string,
  Coid?: string,
  DeptId?: string,
  Startdt?: string,
  Enddt?: string,
  Createid?: string,
  type: string
}

// 自己命傳遞資料的格式
interface GetformAllData {
  formCodeName: string,
  formCodeName2: string,
  routeList: string,
  updateFormsAPI: string,
  formName: string,
  webNameForm: string,
  webNameSign: string,
  finishSign: {
    RDDId: string | string[], //單號
    Status: string, //狀態
    Type: string, //更新狀態
  },
  returnSign: {
    RDDId: string | string[], //單號
    Status: string, //狀態
    Type: string, //更新狀態
  },
  voidSign: {
    RDDId: string | string[], //單號
    Status: string, //狀態
    Type: string, //更新狀態
  },
}

// 取列表-軟體申請單  後端回應
interface ResRDDList {
  AppDeptName?: string,
  ComId: string,
  Company: string,
  CreateDate: string,
  DeptId: string,
  DeptName: string,
  EmpName: string,
  Empid?: string,
  IC?: string,
  Model?: string,
  RDDId: string,
  SVNV: string,
  applyArea: string,
  applyDept?: string,
  applyReason: string,
  applyType: string,
  bomElno?: string,
  choiceDoc?: string,
  modelNO?: string,
  programName: string,
  programV: string,
  reviseA?: string,
  reviseB?: string,
  reviseDoc?: string,
  status: string,
  suzobomElno: string,
  suzomodelNO: string,
  CreateId?: string,
  STNAME?: string,
  SIGNER?: string,
  NextSIGNER?: string,
}

// 會簽用 
interface SetCountersign {
  SIGNERNAME: string,
  SIGNER: string,
  order: number,
  FORMNO: string,
  SIGNORDER: number | string,
  STEPNAME: string,
  SignGroup: string,
}







