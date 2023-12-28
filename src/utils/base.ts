import Swal from 'sweetalert2'
import { storeToRefs } from 'pinia';
// 引入API
import { UploadSignFormData, MailSend } from '@/apis/baseAPI.js'
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
      console.log("簽核附件上傳後端error", error);
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
  await addFormAPI[dataState.formAllData.updateFormsAPI](dataState.formAllData.finishSign).then(async (response: any) => {
    console.log("更新簽核狀態-完簽", response);

  }).catch((error: any) => {
    console.log("更新簽核狀態-完簽-error", error);
  });
}

// 更新簽核狀態 - 退簽
export async function returnSignStatus(dataState: any) {
  await addFormAPI[dataState.formAllData.updateFormsAPI](dataState.formAllData.returnSign).then(async (response: any) => {
    console.log("更新簽核狀態-退簽", response);

  }).catch((error: any) => {
    console.log("更新簽核狀態-退簽-error", error);
  });
}

// 接發信api 通知建表人員(完簽或退簽)
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
      console.log("通知完簽/退簽-發信", response);
    })
    .catch((error: any) => {
      console.log("發信-error", error);
    });
}

// 若有確認單 需清除 連結的申請單單號
export async function cleanFormId(dataState: any) {
  await addFormAPI[dataState.formAllData.updateFormsAPI](dataState.formAllData.clearId).then(async (response: any) => {
    console.log("退簽清除", response);

  }).catch((error: any) => {
    console.log("更新簽核狀態-退簽-error", error);
  });
}

// 成功 彈跳視窗，並轉跳至待簽核表單
export function signSuccess() {
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

