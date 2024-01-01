import Swal from 'sweetalert2'
import { storeToRefs } from 'pinia';
// 引入API
import { UploadSignFormData, MailSend, SignStepupdate, CountersignAdd } from '@/apis/baseAPI.js'
import * as addFormAPI from '@/apis/addFormAPI.js'
// 引入store
import { baseStore } from '@/stores/baseStore'
import { signStore } from '@/stores/signStore'
import { createStore } from '@/stores/createStore'
const signStoreConfig = signStore()
const baseStoreConfig = baseStore()
const createStoreConfig = createStore()
const { signStoreData } = storeToRefs(signStoreConfig)
const { baseStoreData } = storeToRefs(baseStoreConfig)
const { createStoreData } = storeToRefs(createStoreConfig)

// api回應有error
export function resError(data: any) {
  // 跳出視窗
  Swal.fire({
    icon: "error",
    title: data,
    // text: data,
    confirmButtonColor: "#333",
    confirmButtonText: "確認",
  })
}

// 轉跳到各表單搜尋頁面
export function pushWaitSignPage(data: string) {
  Swal.fire({
    title: "成功送出",
    confirmButtonColor: "#333",
    confirmButtonText: "確認",
  }).then((resule) => {
    console.log(resule);
    if (resule.value) {
      // 轉跳到各表單搜尋頁面
      (window.top as any).location =
        `https://esys.orange-electronic.com/ODF/RDN?id=${data}`;
      // `https://esys.orange-electronic.com/RDDocument/Index?id=${data}&formN=index`;
    }
  });
}

// null或undefined 提示
export const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 2500
})

// 產生當下日期
export function createDate() {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y + "/" + m + "/" + d;
}

// 搜尋日期時 => 將日期+1
export function addDay(day: string) {
  let newDay = new Date(day)
  newDay = new Date(newDay.setDate(newDay.getDate() + 1))
  const y = newDay.getFullYear();
  const m = newDay.getMonth() + 1;
  const d = newDay.getDate();
  console.log("utils", y + "-" + m + "-" + d)
  return y + "-" + m + "-" + d;
}

// 下載功能，拿取表單的附件
export function downloadFile(filePath: string) {
  window.open(
    "https://orangeapitest.orange-electronic.com/api" + "/Download?file=" + filePath
  );
}

// 上傳附件給後端
export async function uploadFile(dataState: any) {
  if (baseStoreData.value.file.length === 0) return true;
  // shift() 用法 => 會把file陣列裡的第一個拿出來，且會改變原本陣列detailFile會刪除第一個
  const uploadDFileCurrent = baseStoreData.value.file.shift();
  console.log("uploadDFileCurrent", uploadDFileCurrent);

  const formData = new FormData();
  formData.append("file", uploadDFileCurrent);
  formData.append("FileName", uploadDFileCurrent.name);
  formData.append("FormId", dataState.formId);
  formData.append("EmpId", signStoreData.value.signer.SIGNER);
  formData.append("WebName", dataState.formAllData.webNameSign);
  formData.append("SIGNORDER", signStoreData.value.signer.SIGNORDER.toString());

  // fileUploadStatus記錄上傳檔案成功或失敗
  const fileUploadStatus = await UploadSignFormData(formData)
    .then((response: any) => {
      console.log("簽核附件上傳後端", response);
      return true;
    })
    .catch((error: any) => {
      console.log("簽核附件上傳後端-error", error);
      Toast.fire({
        icon: "error",
        title: "附件上傳失敗請再試一次或聯絡IT人員",
      });
      return false;
    });
  if (fileUploadStatus === false) {
    return false;
  }
  // 過一秒後再執行一次，直到detailFile長度為0
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(uploadFile(dataState));
    }, 1000);
  });
}

// 更新簽核狀態 - 完簽
export async function finishSignStatus(dataState: any) {
  await addFormAPI[dataState.formAllData.updateFormsAPI](dataState.formAllData.finishSign).then((response: any) => {
    console.log("更新簽核狀態-完簽", response);

  }).catch((error: any) => {
    console.log("更新簽核狀態-完簽-error", error);
  });
}

// 更新簽核狀態 - 退簽
export async function returnSignStatus(dataState: any) {
  await addFormAPI[dataState.formAllData.updateFormsAPI](dataState.formAllData.returnSign).then((response: any) => {
    console.log("更新簽核狀態-退簽", response);

  }).catch((error: any) => {
    console.log("更新簽核狀態-退簽-error", error);
  });
}

// 更新簽核狀態 - 作廢
export async function voidSignStatus(dataState: any) {
  await addFormAPI[dataState.formAllData.updateFormsAPI](dataState.formAllData.voidSign).then((response: any) => {
    console.log("更新簽核狀態-作廢", response);

  }).catch((error: any) => {
    console.log("更新簽核狀態-作廢-error", error);
  });
}

// 接發信api 通知建表人員(完簽/退簽/作廢)
export async function noticeSendMail(dataState: any, status: string) {
  await MailSend({
    Empid: dataState.formContent.Empid, //TODO:工號，先代自己工號，上架改成 建表人員 dataState.formContent.Empid
    Sub: `${status}通知：${dataState.formAllData.formName}，表單號碼：${dataState.formId}`, //主旨
    Messg: `
          可點選網址查看，https://esys.orange-electronic.com/RDDocument/Detail?webId=${dataState.formAllData.formCodeName}&formN=${dataState.formAllData.formCodeName2}&formId=${dataState.formId}`, //直接跳到簽核頁面 上架更改內容

    // 表單列表頁面
    // https://esys.orange-electronic.com/RDDocument/Index?id=${props.formAllData.formCodeName}&formN=index
  })
    .then((response: any) => {
      console.log("通知完簽/退簽/作廢-發信", response);
    })
    .catch((error: any) => {
      console.log("通知完簽/退簽/作廢-發信-error", error);
    });
}

// 若有確認單 需清除 連結的申請單單號
export async function cleanFormId(dataState: any) {
  await addFormAPI[dataState.formAllData.updateFormsAPI](dataState.formAllData.clearId).then((response: any) => {
    console.log("清除連結的單號", response);

  }).catch((error: any) => {
    console.log("清除連結的單號-error", error);
  });
}

// 更新簽核人員簽核，判斷簽核順序 > 0 且 簽核結果為0者，作廢人員SIGNRESULT代4
export async function updateSignPerson2(dataState: any) {
  for (let i = 0; i < signStoreData.value.allSign.length; i++) {
    if (
      Number(signStoreData.value.allSign[i].SIGNORDER) > 0 &&
      Number(signStoreData.value.allSign[i].SIGNRESULT) === 0 && signStoreData.value.allSign[i].SignGroup === "作廢"
    ) {
      console.log("作廢人有進", i);

      await SignStepupdate({
        FORMNO: dataState.formId, //表單單號
        SIGNORDER: signStoreData.value.allSign[i].SIGNORDER, //簽核順序
        STEPNAME: signStoreData.value.allSign[i].STEPNAME, //簽核職稱
        SIGNER: signStoreData.value.allSign[i].SIGNER, //簽核人員代號
        SIGNERNAME: signStoreData.value.allSign[i].SIGNERNAME, //簽核人員名稱
        ACTUALNAME: signStoreData.value.allSign[i].ACTUALNAME, //實際簽核人員名稱(EX: 假如財務請假，就會請財務代理人簽核
        ACTUALSIGNER: signStoreData.value.allSign[i].ACTUALSIGNER, //實際簽核人員代號 是否簽核 未簽核回傳: ""
        SIGNRESULT: 4, //簽核結果 1: 同意, 0: 未簽核, 3: 退簽 , 4: 作廢
        OPINION: dataState.signModalData.opinion, //簽核意見
        SIGNTIME: "", //簽核時間
        ALLOWCUSTOM: signStoreData.value.allSign[i].ALLOWCUSTOM, //是否自訂簽核
        SignGroup: signStoreData.value.allSign[i].SignGroup, //簽核群組
        ISEnable: signStoreData.value.allSign[i].ISEnable, //是否顯示
        types: 1, //1修改
        ExceId: dataState.formContent.CreateId
          ? dataState.formContent.CreateId
          : dataState.formContent.Empid, //建立人
        Status: "",
      })
        .then((response: any) => {
          console.log("更新簽核人員-作廢", response);

        })
        .catch((error: any) => {
          console.log("更新簽核人員-作廢-error", error);
        });
    }
  }
}

// 更新簽核人員簽核，判斷簽核順序 > 0 且 簽核結果為0者，非作廢人員SIGNRESULT代5
export async function updateSignPerson(dataState: any) {
  for (let i = 0; i < signStoreData.value.allSign.length; i++) {
    if (
      Number(signStoreData.value.allSign[i].SIGNORDER) > 0 &&
      Number(signStoreData.value.allSign[i].SIGNRESULT) === 0 && signStoreData.value.allSign[i].SignGroup !== "作廢"
    ) {
      console.log("一般人有進", i);
      await SignStepupdate({
        FORMNO: dataState.formId, //表單單號
        SIGNORDER: signStoreData.value.allSign[i].SIGNORDER, //簽核順序
        STEPNAME: signStoreData.value.allSign[i].STEPNAME, //簽核職稱
        SIGNER: signStoreData.value.allSign[i].SIGNER, //簽核人員代號
        SIGNERNAME: signStoreData.value.allSign[i].SIGNERNAME, //簽核人員名稱
        ACTUALNAME: signStoreData.value.allSign[i].ACTUALNAME, //實際簽核人員名稱(EX: 假如財務請假，就會請財務代理人簽核
        ACTUALSIGNER: signStoreData.value.allSign[i].ACTUALSIGNER, //實際簽核人員代號 是否簽核 未簽核回傳: ""
        SIGNRESULT: 5, //簽核結果 1: 同意, 0: 未簽核, 3: 退簽 , 4: 作廢
        OPINION: "", //簽核意見
        SIGNTIME: "", //簽核時間
        ALLOWCUSTOM: signStoreData.value.allSign[i].ALLOWCUSTOM, //是否自訂簽核
        SignGroup: signStoreData.value.allSign[i].SignGroup, //簽核群組
        ISEnable: signStoreData.value.allSign[i].ISEnable, //是否顯示
        types: 1, //1修改
        ExceId: dataState.formContent.CreateId
          ? dataState.formContent.CreateId
          : dataState.formContent.Empid, //建立人
        Status: "",
      })
        .then((response: any) => {
          console.log("更新簽核人員-作廢", response);

        })
        .catch((error: any) => {
          console.log("更新簽核人員-作廢-error", error);
        });
    }
  }
}

// 成功 彈跳視窗，並轉跳至待簽核表單
export function signSuccess() {
  console.log(createStoreData.value.nextSigner)
  Swal.fire({
    title: "成功送出",
    text: `下一個簽核人員：${Object.keys(createStoreData.value.nextSigner).length === 0 ? '無' : createStoreData.value.nextSigner?.SIGNERNAME}`,
    confirmButtonColor: "#333",
    confirmButtonText: "確認",
  }).then((resule: any) => {
    console.log(resule);
    if (resule.value) {
      // TODO:上線下面這行打開，第2行註解
      (window.top as any).location = "https://esys.orange-electronic.com/Eform/List";
      // this.$router.push(`${props.formAllData.routeList}`);
    }
  });
}

// 用會簽方式 + 簽核人員
export async function addSignCounter(data: any) {
  await CountersignAdd([data])
    .then((response: any) => {
      console.log("新增會簽人員", response);
    })
    .catch((error: any) => {
      console.log("新增會簽人員-error", error);
    });
}

