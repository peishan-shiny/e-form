<template>
  <div class="sign-box">
    <LoadingGIF v-if="dataState.isLoading === true" />
    <!-- 簽核 彈跳視窗 -->
    <div class="sign-modal" @click="cancelModal">
      <div class="box">
        <div class="box-title">表單簽核</div>
        <div class="box-info">
          <p class="box-info-text">● 簽核選擇不同意，請填寫簽核意見！</p>
          <p class="box-info-text">
            ● If you do not agree,please fill in the opintion!
          </p>
        </div>
        <div class="box-content">
          <div class="box-row">
            <div class="box-content-text">簽核決定</div>
            <div class="box-content-item">
              <el-radio-group v-model="dataState.signModalData.radio">
                <el-radio :label="1">同意</el-radio>
                <br />
                <el-radio :label="2">不同意，請填寫意見</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="box-row">
            <div class="box-content-text">簽核密碼</div>
            <div class="box-content-item">
              <el-input type="password" v-model="dataState.signModalData.password" required></el-input>
            </div>
          </div>
          <div class="box-row">
            <div class="box-content-text opinion">簽核意見</div>
            <div class="box-content-item">
              <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="dataState.signModalData.opinion">
              </el-input>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-black" @click="confirmPassword" :disabled="dataState.disabledBtn">
          確認
        </button>
        <button type="button" class="btn btn-red" @click="dataState.showSignBox = 0">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { type AxiosResponse } from 'axios';
import { useRoute } from "vue-router"
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, onMounted, ref, watch, defineEmits } from 'vue';
import { resError, Toast, createDate } from '@/utils/base';
import { Login, SignStepupdate, UploadSignFormData, GetSignStepNext, MailSend } from '@/apis/baseAPI.js'
import { RDDAdd } from '@/apis/addFormAPI.js'

// 引入组件
const LoadingGIF = defineAsyncComponent(() => import('@/components/LoadingGIF.vue'));
// 引入store
import { signStore } from '@/stores/signStore'
import { baseStore } from '@/stores/baseStore'
const signStoreConfig = signStore()
const baseStoreConfig = baseStore()
const { signStoreData } = storeToRefs(signStoreConfig)
const { baseStoreData } = storeToRefs(baseStoreConfig)

// props寫法一：
const props = defineProps<{
  formContent: ResRDDList,
  formAllData: GetformAllData,
}>()

const emit = defineEmits(['handle-show-sign-box', 'deliver-disabled-btn'])

const dataState = ref({
  // 送出表單的等待畫面
  isLoading: false,
  // 計數api有幾個在執行
  runningCount: 0,
  showSignBox: 1,
  // 簽核完成將確認鈕 disabled
  disabledBtn: false,
  // 簽核彈跳窗的資料
  signModalData: {
    radio: 1,
    password: "",
    opinion: "",
  },
  // 表單號碼
  formId: "" as any,
  // 簽核完，取下一個簽核人員
  nextSigner: {} as ResSigner,
})

onMounted(() => {
  // 取路由上的 單號/使用者
  const route = useRoute();
  console.log("route", route.params)
  dataState.value.formId = route.params.formId

})


// 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
watch(() => dataState.value.runningCount, (newValue) => {
  console.log("watch", newValue)
  dataState.value.isLoading = true;
  if (dataState.value.runningCount === 0) {
    dataState.value.isLoading = false;
  }
})

watch(() => dataState.value.showSignBox, (newValue) => {
  console.log("watch", newValue)
  emit("handle-show-sign-box", dataState.value.showSignBox);
})

// 驗證 密碼
async function confirmPassword() {
  if (dataState.value.signModalData.password) {
    await Login({
      acc: "222010", //TODO:工號，先代自己工號，上架改成下一個簽核人員工號 signStoreData.value.signer.SIGNER
      Pwd: dataState.value.signModalData.password, //密碼
    })
      .then((response: any) => {
        if (response.data === "密碼通過") {
          submitSign();
        }
      })
      .catch((error: any) => {
        console.log(error)
        resError("密碼錯誤" + error)
      })
  } else {
    Toast.fire({
      icon: "warning",
      title: "請填寫密碼！",
    });
  }
}

// 送簽
async function submitSign() {
  if (
    (dataState.value.signModalData.radio === 1 && dataState.value.signModalData.password) ||
    (dataState.value.signModalData.radio === 2 && dataState.value.signModalData.opinion !== "")
  ) {
    dataState.value.runningCount++;
    await SignStepupdate({
      FORMNO: dataState.value.formId, //表單單號
      SIGNORDER: signStoreData.value.signer.SIGNORDER, //簽核順序
      STEPNAME: signStoreData.value.signer.STEPNAME, //簽核職稱
      SIGNER: signStoreData.value.signer.SIGNER, //簽核人員代號
      SIGNERNAME: signStoreData.value.signer.SIGNERNAME, //簽核人員名稱
      ACTUALNAME: signStoreData.value.signer.ACTUALNAME, //實際簽核人員名稱(EX: 假如財務請假，就會請財務代理人簽核
      ACTUALSIGNER: signStoreData.value.signer.ACTUALSIGNER, //實際簽核人員代號 是否簽核 未簽核回傳: ""
      SIGNRESULT: dataState.value.signModalData.radio, //簽核結果 1: 同意, 0: 未簽核, 3: 退簽 , 4: 作廢
      OPINION: dataState.value.signModalData.opinion, //簽核意見
      SIGNTIME: "", //簽核時間
      ALLOWCUSTOM: signStoreData.value.signer.ALLOWCUSTOM, //是否自訂簽核
      SignGroup: signStoreData.value.signer.SignGroup, //簽核群組
      ISEnable: signStoreData.value.signer.ISEnable, //是否顯示
      types: 1, //1修改
      ExceId: props.formContent.CreateId
        ? props.formContent.CreateId
        : props.formContent.Empid, //建立人
      Status: "",
    })
      .then(async (response: any) => {
        console.log("簽核成功", response);

        if (response.data === "更新完成") {
          dataState.value.disabledBtn = true;
          emit("deliver-disabled-btn", true);
        }
        // 如果簽核附件有東西，上傳給後端
        if (baseStoreData.value.file.length > 0) {
          const result = await uploadFile();
          // 判斷uploadFile函式，檔案上傳是否成功
          if (result === false) {
            throw "檔案上傳錯誤";
          }
        }
      })
      .then(async () => {
        // 如果簽核-同意，取得下一個簽核人員，發信通知用
        if (dataState.value.signModalData.radio === 1) {
          await fetchNextSigner(dataState.value.formId);
        } else {
          // 如果簽核-不同意，簽核狀態送2退簽
          await returnSignStatus();
        }
      })
      .then(() => {
        dataState.value.runningCount--;
        // 跳出成功訊息
        signSuccess();
      })
      .catch((error: any) => {
        dataState.value.runningCount--;
        Toast.fire({
          icon: "error",
          title: "上傳失敗請再試一次",
        });
        console.log(error);
      });
  } else {
    Toast.fire({
      icon: "warning",
      title: "若不同意請填寫意見",
    });
  }
}

// 點黑底，取消modal
function cancelModal(event: any) {
  const modal = document.querySelector(".sign-modal");
  if (event.target === modal) {
    dataState.value.showSignBox = 0;
  }
}


// 上傳附件給後端
async function uploadFile() {
  if (baseStoreData.value.file.length === 0) return true;
  // shift() 用法 => 會把file陣列裡的第一個拿出來，且會改變原本陣列detailFile會刪除第一個
  const uploadDFileCurrent = baseStoreData.value.file.shift();
  console.log("uploadDFileCurrent", uploadDFileCurrent);

  let formData = new FormData();
  formData.append("file", uploadDFileCurrent);
  formData.append("FileName", uploadDFileCurrent.name);
  formData.append("FormId", dataState.value.formId);
  formData.append("EmpId", signStoreData.value.signer.SIGNER);
  formData.append("WebName", props.formAllData.webNameSign);
  formData.append("SIGNORDER", signStoreData.value.signer.SIGNORDER);
  dataState.value.runningCount++;
  // fileUploadStatus記錄上傳檔案成功或失敗
  const fileUploadStatus = await UploadSignFormData(formData)
    .then((response: any) => {
      console.log("簽核附件上傳後端", response);
      dataState.value.runningCount--;
      return true;
    })
    .catch((error: any) => {
      dataState.value.runningCount--;
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
      resolve(uploadFile());
    }, 1000);
  });
}
// 簽核完成，取得 下一個簽核人員，發信通知使用
async function fetchNextSigner(formId: any) {
  dataState.value.runningCount++;
  await GetSignStepNext(formId)
    .then(async (response: AxiosResponse<ResSigner[]>) => {
      // dataState.value.nextSigner = {};
      dataState.value.nextSigner = response.data[0];
      console.log("下一個簽核人員", dataState.value.nextSigner);
      dataState.value.runningCount--;

      //發信給下一個簽核人員
      if (dataState.value.nextSigner) {
        await sendMail();
      } else {
        // 如果沒有下一個簽核人員，代表簽核完成
        // 須將nextSigner改為空物件，否則在上面this.nextSigner = response.data[0]他已經變成undefined 
        // 接簽核狀態更新api
        // dataState.value.nextSigner = {};
        await finishSignStatus();
      }
    })
    .catch((error: any) => {
      console.log(error, "取得簽核人員發生錯誤！");
      dataState.value.runningCount--;
      Toast.fire({
        icon: "warning",
        title: "無法取得資料，請聯絡IT人員！",
      });
    });
}
// 接發信api
async function sendMail() {
  dataState.value.runningCount++;
  await MailSend({
    Empid: dataState.value.nextSigner.SIGNER, //TODO:工號，先代自己工號，上架改成下一個簽核人員工號 dataState.value.nextSigner.SIGNER
    Sub: `簽核通知：${props.formAllData.formName}，表單號碼：${dataState.value.formId}`, //主旨
    Messg: `
          請協助進行表單號碼：${dataState.value.formId} 簽核作業！
          可點選網址查看，https://esys.orange-electronic.com/Eform/List`, //內文 上架更改內容
  })
    .then((response: any) => {
      console.log("發信", response);
      dataState.value.runningCount--;
    })
    .catch((error: any) => {
      console.log("發信-error", error);
      dataState.value.runningCount--;
    });
}
// 更新簽核狀態 - 完簽
async function finishSignStatus() {
  dataState.value.runningCount++;
  await addFormAPI[props.formAllData.updateFormsAPI](props.formAllData.finishSign).then(async (response: any) => {
    console.log("更新簽核狀態-完簽", response);

    // 完簽發信通知建表人員
    await finishSignSendMail();

    dataState.value.runningCount--;
  }).catch((error: any) => {
    dataState.value.runningCount--;
    console.log("更新簽核狀態-完簽-error", error);
  });
}
// 完簽接發信api 通知建表人員
async function finishSignSendMail() {
  dataState.value.runningCount++;
  await MailSend({
    Empid: props.formContent.Empid, //TODO:工號，先代自己工號，上架改成 建表人員 props.formContent.Empid
    Sub: `完簽通知：${props.formAllData.formName}，表單號碼：${dataState.value.formId}`, //主旨
    Messg: `
          可點選網址查看，https://esys.orange-electronic.com/RDDocument/Detail?webId=${props.formAllData.formCodeName}&formN=${props.formAllData.formCodeName2}&formId=${dataState.value.formId}`, //直接跳到簽核頁面 上架更改內容

    // 表單列表頁面
    // https://esys.orange-electronic.com/RDDocument/Index?id=${props.formAllData.formCodeName}&formN=index
  })
    .then((response: any) => {
      console.log("完簽發信", response);
      dataState.value.runningCount--;
    })
    .catch((error: any) => {
      console.log("發信-error", error);
      dataState.value.runningCount--;
    });
}
// 更新簽核狀態 - 退簽
async function returnSignStatus() {
  dataState.value.runningCount++;
  await addFormAPI[props.formAllData.updateFormsAPI](props.formAllData.returnSign).then(async (response) => {
    console.log("更新簽核狀態-退簽", response);

    // 如果有確認單的 會多跑這個程序
    if (props.formAllData.clearId) {
      await this.cleanFormId();
    }

    // 發信通知建表人員
    await this.sendMailCreater();

    dataState.value.runningCount--;
  }).catch((error) => {
    dataState.value.runningCount--;
    console.log("更新簽核狀態-退簽-error", error);
  });
}
// 若有確認單 需清除 連結的申請單單號
async function cleanFormId() {
  dataState.value.runningCount++;
  await addFormAPI[props.formAllData.updateFormsAPI](props.formAllData.clearId).then(async (response) => {
    console.log("退簽清除", response);

    dataState.value.runningCount--;
  }).catch((error) => {
    dataState.value.runningCount--;
    console.log("更新簽核狀態-退簽-error", error);
  });
}
// 退簽接發信api 通知建表人員
async function sendMailCreater() {
  dataState.value.runningCount++;
  await MailSend({
    Empid: props.formContent.Empid, //TODO:工號，先代自己工號，上架改成 建表人員 props.formContent.Empid
    Sub: `退簽通知：${props.formAllData.formName}，表單號碼：${dataState.value.formId}`, //主旨
    Messg: `
          可點選網址查看，https://esys.orange-electronic.com/RDDocument/Detail?webId=${props.formAllData.formCodeName}&formN=${props.formAllData.formCodeName2}&formId=${dataState.value.formId}`, //直接跳到簽核頁面 上架更改內容

    // 表單列表頁面
    // https://esys.orange-electronic.com/RDDocument/Index?id=${props.formAllData.formCodeName}&formN=index
  })
    .then((response: any) => {
      console.log("發信", response);
      dataState.value.runningCount--;
    })
    .catch((error: any) => {
      console.log("發信-error", error);
      dataState.value.runningCount--;
    });
}
// 成功 彈跳視窗，並轉跳至待簽核表單
function signSuccess() {
  Swal.fire({
    title: "成功送出",
    text: `下一個簽核人員：${Object.keys(dataState.value.nextSigner).length === 0 ? '無' : dataState.value.nextSigner?.SIGNERNAME}`,
    confirmButtonColor: "#333",
    confirmButtonText: "確認",
  }).then((resule: any) => {
    console.log(resule);
    if (resule.value) {
      // TODO:上線下面這行打開，第2行註解
      window.top.location = "https://esys.orange-electronic.com/Eform/List";
      // this.$router.push(`${props.formAllData.routeList}`);
    }
  });
}
</script>

<style lang="scss" scoped>
* {
  font-family: "微軟正黑體";
}

.el-radio {
  padding: 0.25rem;
}

.btn {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}

/* 彈跳窗 */
.sign-modal {
  position: fixed;
  /* 固定定位 */
  z-index: 100;
  /* 设置在顶层 */
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);

  .box {
    width: 25%;
    min-width: 400px;
    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    background-color: var(--white);
    border: 1px solid var(--white);
    border-radius: 0.5rem;
    padding: 1rem;

    .box-title {
      text-align: center;
      background-color: var(--sec-color);
      padding: 0.5rem;
    }

    .box-info {
      background-color: #ffdac7;
      padding: 0.5rem;

      .box-info-text {
        font-size: 13px;
        padding: 0.25rem;
      }
    }

    .box-content {
      border: 1px solid var(--gray-border);

      .box-row {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--gray-border);

        .box-content-text {
          background-color: var(--gray-border);
          padding: 2rem 0.5rem;
          white-space: nowrap;
        }

        .box-content-item {
          padding: 0.5rem;
          width: 100%;
        }

        .opinion {
          padding: 4rem 0.5rem;
        }
      }
    }
  }
}

@media screen and (max-width: 912px) {
  .sign-modal {
    .box {
      width: 75%;
      min-width: 300px;

      .box-content {
        width: 100%;
        border: 1px solid var(--gray-border);

        .box-row {
          all: unset;
          display: flex;
          flex-direction: column;

          .box-content-text {
            all: unset;
            background-color: var(--gray-border);
            padding: 0.5rem 0.5rem;
          }

          .box-content-item {
            padding: 0.5rem;
          }

          .opinion {
            all: unset;
            background-color: var(--gray-border);
            padding: 0.5rem 0.5rem;
          }
        }
      }
    }
  }
}
</style>