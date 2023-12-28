<template>
  <div class="sign-top noPrint">
    <LoadingGIF v-if="dataState.isLoading === true" />
    <!-- 按鈕 -->
    <div class="top-button noMobile">
      <button class="top-btn action" @click="clickSubmit()" v-if="(formContent.status === '簽核中' ||
        formContent.status === '簽核中') &&
        (signStoreData.signer.SIGNER === userStoreData.EmpId)
        " :disabled="disabledBtn">
        <img src="@/assets/white/電子表單icon_簽核.png" alt="" class="icon" />
        簽核表單
      </button>
      <button class="top-btn action" @click="clickCountersign()" v-if="(formContent.status === '簽核中' ||
        formContent.status === '簽核中') &&
        (signStoreData.signer.SIGNER === userStoreData.EmpId)
        " :disabled="disabledBtn">
        <img src="@/assets/white/電子表單icon_會簽.png" alt="" class="icon" />
        會簽(意見徵詢)
      </button>
      <button class="top-btn common" @click="($refs.fileDOM as any).click()" v-if="(formContent.status === '簽核中' ||
        formContent.status === '簽核中') &&
        (signStoreData.signer.SIGNER === userStoreData.EmpId)
        " :disabled="disabledBtn">
        <input ref="fileDOM" @change="handleFileChange" type="file" multiple class="input-file" />
        <img src="@/assets/black/電子表單icon_附加檔案.png" alt="" class="icon" />
        加入簽核附件
      </button>
      <button class="top-btn common" @click="print">
        <img src="@/assets/black/電子表單icon_列印.png" alt="" class="icon" />
        列印
      </button>
      <button class="top-btn common" @click="$router.back()">
        <img src="@/assets/black/電子表單icon_返回.png" alt="" class="icon" />
        返回列表
      </button>
      <button class="top-btn common" @click="voidSubmit" v-if="dataState.voidBtn" :disabled="disabledBtn">
        <img src="@/assets/black/電子表單icon_作廢.png" alt="" class="icon" />
        作廢
      </button>
      <div class="area-title" v-if="baseStoreData.file.length > 0">簽核人員上傳文件：</div>
      <div class="file-list" v-if="baseStoreData.file.length > 0">
        <p class="file" v-for="item in baseStoreData.file" :key="item.name">
          {{ item.name }}
          <el-icon>
            <DeleteFilled class="delete" @click="deleteFile(item.name)" />
          </el-icon>
        </p>
      </div>
    </div>
    <div class="top-button noPC">
      <button class="top-btn mobile-action" @click="clickSubmit()" v-if="(formContent.status === '簽核中' ||
        formContent.status === '簽核中') &&
        (signStoreData.signer.SIGNER === userStoreData.EmpId)
        " :disabled="disabledBtn">
        <img src="@/assets/white/電子表單icon_簽核.png" alt="" class="icon" />
      </button>
      <button class="top-btn mobile-action" @click="clickCountersign()" v-if="(formContent.status === '簽核中' ||
        formContent.status === '簽核中') &&
        (signStoreData.signer.SIGNER === userStoreData.EmpId)
        " :disabled="disabledBtn">
        <img src="@/assets/white/電子表單icon_會簽.png" alt="" class="icon" />
      </button>
      <button class="top-btn mobile-common" @click="$router.back()">
        <img src="@/assets/black/電子表單icon_返回.png" alt="" class="icon" />
      </button>
      <a href="https://esys.orange-electronic.com/Default/Index">
        <img src="@/assets/logo.png" alt="" class="goHome" />
      </a>
    </div>
    <!-- 第一區塊 -->
    <div class="top-content">
      <div class="area">
        <div class="area-row">
          <div class="area-title-33">表單編號：{{ dataState.formId }}</div>
          <!-- <el-input :value="dataState.formId"></el-input> -->
          <div class="area-title-33">建立日期：{{ formContent.CreateDate }}</div>
          <!-- <el-input :value="formContent.CreateDate"></el-input> -->
          <div class="area-title-33">簽核狀態：{{ formContent.status }}</div>
          <!-- <el-input :value="formContent.status"></el-input> -->
        </div>
        <div class="area-row">
          <div class="area-title-33">公司別：{{ formContent.Company }}</div>
          <!-- <el-input :value="formContent.Company"></el-input> -->
          <div class="area-title-33">部門：{{ formContent.DeptName }}</div>
          <!-- <el-input :value="formContent.DeptName"></el-input> -->
          <div class="area-title-33">建檔人員：{{ formContent.EmpName }}</div>
          <!-- <el-input :value="formContent.EmpName"></el-input> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type AxiosResponse } from 'axios';
import { useRoute } from "vue-router"
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, onMounted, ref, watch, defineEmits } from 'vue';
import { resError, Toast } from '@/utils/base';
import { GetEmpGroup } from '@/apis/baseAPI.js'
// 引入组件
const LoadingGIF = defineAsyncComponent(() => import('@/components/LoadingGIF.vue'));
// 引入Store
import { userStore } from '@/stores/userStore';
import { baseStore } from '@/stores/baseStore';
import { signStore } from '@/stores/signStore';

const userStoreConfig = userStore();
const baseStoreConfig = baseStore()
const signStoreConfig = signStore();

const { baseStoreData } = storeToRefs(baseStoreConfig);

// props寫法一：
const props = defineProps<{
  formContent: ResRDDList,
  formAllData: Object,
  disabledBtn: boolean,
}>()
// props寫法二：
// const props = defineProps({
//   formContent: { type: Object, required: true },
//   formAllData: { type: Object, required: true },
//   disabledBtn: { type: Boolean, required: true }
// })

console.log("props.formContent", props.formContent)

const emit = defineEmits(['handle-show-sign-box', 'handle-show-countersign-box', 'handle-show-void-box'])

const dataState = ref({
  // 送出表單的等待畫面
  isLoading: false,
  // 計數api有幾個在執行
  runningCount: 0,
  // 控制 作廢按鈕
  voidBtn: false,
  // 控制 簽核彈跳視窗
  showSignBox: 0,
  // 控制 會簽彈跳視窗
  showCountersignBox: 0,
  // 控制 退簽彈跳視窗
  showVoidBox: 0,
  // 表單號碼
  formId: "" as string | string[],
})

onMounted(() => {
  // 取路由上的 單號/使用者
  const route = useRoute();
  console.log("route", route.params)
  dataState.value.formId = route.params.formId

  // 取使用者資料
  userStoreConfig.getUserData({
    DeptId: "", //部門代號
    EmpId: route.params.userId, //工號
    Company: "" //公司
  })

  voidLimit();

})

const { userStoreData } = storeToRefs(userStoreConfig);
const { signStoreData } = storeToRefs(signStoreConfig);

// 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
watch(() => dataState.value.runningCount, (newValue) => {
  console.log("watch", newValue)
  dataState.value.isLoading = true;
  if (dataState.value.runningCount === 0) {
    dataState.value.isLoading = false;
  }
})

// 驗證是否為MIS人員，顯示作廢按鈕
async function voidLimit() {
  console.log("確定是否拿到userStoreData", userStoreData);
  dataState.value.runningCount++;
  await GetEmpGroup({
    GroupID: "",
    EmpId: userStoreData.value.EmpId, //工號
  })
    .then((response: AxiosResponse<ResEmpGroup[]>) => {
      const group = response.data[0].GroupID;
      if (group === "admin") {
        console.log("此人員有權限作廢");
        dataState.value.voidBtn = true;
      }
      dataState.value.runningCount--;
    })
    .catch((error: any) => {
      dataState.value.runningCount--;
      console.log(error)
      resError("API判斷是否有作廢權發生錯誤")
    })
}
// 送簽
function clickSubmit() {
  dataState.value.showSignBox = 1;
  emit("handle-show-sign-box", dataState.value.showSignBox);
}
// 會簽，改變showCountersignBox值，送至父層，呼叫彈窗
function clickCountersign() {
  dataState.value.showCountersignBox = 1;
  emit("handle-show-countersign-box", dataState.value.showCountersignBox);
}
// 作廢，改變showVoidBox值，送至父層，呼叫彈窗
function voidSubmit() {
  if (dataState.value.voidBtn) {
    dataState.value.showVoidBox = 1;
    emit("handle-show-void-box", dataState.value.showVoidBox);
  } else {
    Toast.fire({
      icon: "warning",
      title: "無權限作廢",
    });
  }
}
// 上傳附件顯示在網頁上
function handleFileChange(e: any) {
  const fileList = e.target.files;
  let fileSize = 0;
  for (let i = 0; i < fileList.length; i++) {
    fileSize = fileSize + fileList[i].size;
  }
  console.log("fileSize", fileSize);

  if (fileSize < 4000000) {
    baseStoreConfig.updateFile(fileList)
  } else {
    Toast.fire({
      icon: "warning",
      title: "檔案大小太大無法上傳！",
    });
  }
}
// 刪除時commit刪除function
function deleteFile(clickItem: string) {
  baseStoreConfig.deleteFile(clickItem)
}
// 列印
function print() {
  console.log("列印");
  window.print();
}
</script>

<style lang="scss" scoped>
// * {
//   font-family: "微軟正黑體";
//   box-sizing: border-box;
// }
// .top-button {
//   display: flex;
//   .top-btn {
//     display: flex;
//     align-items: center;
//     margin-right: 1rem;
//     .input-file {
//       display: none;
//     }
//   }
// }

// .icon {
//   height: 24px;
// }

// @media print {
//   .noPrint {
//     display: none;
//   }
// }
</style>