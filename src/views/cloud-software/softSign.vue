<template>
  <div class="content">
    <LoadingGIF v-if="dataState.isLoading === true" />

    <SignBox v-if="dataState.showSignBox === 1" @handle-show-sign-box="handleShowSignBox" @submit-sign="submitSign" />

    <CountersignBox v-if="dataState.showCountersignBox === 1" @handle-show-countersign-box="handleShowCountersignBox"
      @submit-countersign="submitCountersign" />

    <VoidBox v-if="dataState.showVoidBox === 1" @handle-show-void-box="handleShowVoidBox"
      @deliver-disabled-btn="deliverDisabledBtn" @submit-void="submitVoid" />

    <div class="sign-form noPrint">
      <p class="title">軟體申請單</p>
      <!-- 按鈕 -->
      <SignTopBtn @handle-show-sign-box="handleShowSignBox" @handle-show-countersign-box="handleShowCountersignBox"
        @handle-show-void-box="handleShowVoidBox" :formContent="dataState.formContent"
        :formAllData="dataState.formAllData" :disabledBtn="dataState.disabledBtn" />

      <!-- 專案內容 -->
      <div class="area">
        <div class="area-row">
          <div class="area-title-50">申請單位：{{ dataState.formContent.applyDept }}</div>
          <div class="area-title-50">申請原因：{{ dataState.formContent.applyReason }}</div>
        </div>
        <div class="area-row">
          <div class="area-title-50">程式版號：{{ dataState.formContent.programV }}</div>
          <div class="area-title-50">SVN版號：{{ dataState.formContent.SVNV }}</div>
        </div>
        <div class="area-row">
          <div class="area-title">程式名稱：{{ dataState.formContent.programName }}</div>
        </div>
        <div class="area-row">
          <div class="area-title">適用機種：{{ dataState.formContent.Model }}</div>
        </div>
        <div class="area-row">
          <div class="area-title">IC：{{ dataState.formContent.IC }}</div>
        </div>
        <!-- 虛線 -->
        <hr style="border: 1px dashed var(--gray-border);" />

        <div class="area-row">
          <div class="area-title-50">申請地區：{{ dataState.formContent.applyArea }}</div>
          <div class="area-title-50">申請類別：{{ dataState.formContent.applyType }}</div>
        </div>
        <div class="area-row">
          <div class="area-title">台灣四階料號：{{ dataState.formContent.bomElno }}</div>
        </div>
        <div class="area-row">
          <div class="area-title">台灣Model NO：{{ dataState.formContent.modelNO }}</div>
        </div>
        <div class="area-row">
          <div class="area-title">蘇州四階料號：{{ dataState.formContent.suzobomElno }}</div>
        </div>
        <div class="area-row">
          <div class="area-title">蘇州Model NO：{{ dataState.formContent.suzomodelNO }}</div>
        </div>
        <div class="area-row">
          <div class="area-title">修改前內容：</div>
          <p>{{ dataState.formContent.reviseB }}</p>
        </div>
        <div class="area-row">
          <div class="area-title">修改後內容：</div>
          <p>{{ dataState.formContent.reviseA }}</p>
        </div>
        <div class="area-row">
          <div class="area-title">相關文件是否修改：{{ dataState.formContent.reviseDoc }}</div>
        </div>
        <div class="area-row">
          <div class="area-title">選擇修改文件：{{ dataState.formContent.choiceDoc }}</div>
        </div>
      </div>

      <!-- 附加文件 -->
      <FileCom :model="dataState.model" :toFileCom="dataState.toFileCom" />
      <p class="version">QP-038-07-H</p>
      <!-- 簽核人員順序 -->
      <SignForm class="mt-1" />
    </div>

    <!-- 列印區 -->
    <div class="print-area">
      <div class="print-block">
        <p class="print-title">橙的電子股份有限公司</p>
        <p class="print-subtitle">軟體申請單</p>
      </div>

      <div class="print-form">
        <table class="print-table">
          <tr v-show="false">
            <th class="table-5"></th>
            <th class="table-15"></th>
            <th class="table-15"></th>
            <th class="table-15"></th>
            <th class="table-20"></th>
            <th class="table-15"></th>
            <th class="table-15"></th>
          </tr>
          <tr>
            <td class="table-5" colspan="2">申請原因</td>
            <td class="table-15" colspan="3">{{ dataState.formContent.applyReason }}</td>
            <td class="table-15">日期</td>
            <td class="table-15">{{ dataState.formContent.CreateDate }}</td>
          </tr>
          <tr>
            <td class="table-5" colspan="2">申請單位</td>
            <td class="table-15">{{ dataState.formContent.applyDept }}</td>
            <td class="table-15">申請人</td>
            <td class="table-20">{{ dataState.formContent.EmpName }}</td>
            <td class="table-15">主管</td>
            <td class="table-15">{{ dataState.formContent.director?.SIGNERNAME }}</td>
          </tr>
          <tr>
            <td class="table-5" colspan="2">程式版號</td>
            <td class="table-15">{{ dataState.formContent.programV }}</td>
            <td class="table-15">程式名稱</td>
            <td class="table-20" colspan="3">{{ dataState.formContent.programName }}</td>
          </tr>
          <tr>
            <td class="table-5" colspan="2">SVN版號</td>
            <td class="table-15">{{ dataState.formContent.SVNV }}</td>
            <td class="table-15">適用機種</td>
            <td class="table-20" colspan="3">{{ dataState.formContent.Model }}</td>
          </tr>
          <tr>
            <td class="table-5" colspan="2">台灣四階料號</td>
            <td class="table-15">{{ dataState.formContent.bomElno }}</td>
            <td class="table-15">Model NO</td>
            <td class="table-20">{{ dataState.formContent.modelNO }}</td>
            <td class="table-15" rowspan="2">IC：{{ dataState.formContent.IC }}</td>
            <td class="table-15" rowspan="2">{{ dataState.formContent.applyType }}</td>
          </tr>
          <tr>
            <td class="table-5" colspan="2">蘇州四階料號</td>
            <td class="table-15">{{ dataState.formContent.suzobomElno }}</td>
            <td class="table-15">Model NO</td>
            <td class="table-20">{{ dataState.formContent.suzomodelNO }}</td>
          </tr>
          <tr>
            <td class="table-5" rowspan="2">內容簡述</td>
            <td class="table-15">修改前內容</td>
            <td class="table-15" colspan="5">{{ dataState.formContent.reviseB }}</td>
          </tr>
          <tr>
            <td class="table-15">修改後內容</td>
            <td class="table-15" colspan="5">{{ dataState.formContent.reviseA }}</td>
          </tr>
          <tr>
            <td class="table-5" colspan="2">相關文件</td>
            <td class="table-15" colspan="5">
              <el-radio v-model="dataState.formContent.reviseDoc" label="是">是</el-radio>
              <el-radio v-model="dataState.formContent.reviseDoc" label="否">否</el-radio>
              需修改
              <el-checkbox-group v-model="dataState.formContent.choiceDocArr">
                <el-checkbox label="品質手冊"></el-checkbox>
                <el-checkbox label="程序"></el-checkbox>
                <el-checkbox label="作業標準書"></el-checkbox>
                <el-checkbox label="表格"></el-checkbox>
                <el-checkbox label="其他"></el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
        </table>
      </div>

      <div class="print-form">
        <table class="print-table">
          <tr>
            <th colspan="3">簽核人員</th>
          </tr>
          <tr v-for="item in signStoreData.signStep" :key="item.SIGNORDER">
            <td class="table-25">{{ item.STEPNAME }}</td>
            <td class="table-25">
              <img class="signPicture" :src="dataState.signPicture + item.SIGNER + '.png'" alt="" style="height: 30px;"
                v-if="!(item.SIGNRESULT === 5 || item.SIGNRESULT === 0)">
            </td>
            <td class="table-50"> {{ item.OPINION }}</td>
          </tr>
        </table>
        <table class="print-table">
          <tr>
            <th colspan="3">會辦人員</th>
          </tr>
          <tr v-for="item in signStoreData.executorStep" :key="item.SIGNORDER">
            <td class="table-25">{{ item.STEPNAME }}</td>
            <td class="table-25">
              <img class="signPicture" :src="dataState.signPicture + item.SIGNER + '.png'" alt="" style="height: 30px;"
                v-if="!(item.SIGNRESULT === 5 || item.SIGNRESULT === 0)">
            </td>
            <td class="table-50" colspan="5"> {{ item.OPINION }}</td>
          </tr>
        </table>
        <p class="version">QP-038-07-H</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type AxiosResponse } from 'axios';
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useRoute } from "vue-router"
import { storeToRefs } from 'pinia';
import { resError, uploadFile, signSuccess, finishSignStatus, noticeSendMail, returnSignStatus, voidSignStatus, pushWaitSignPage, updateSignPerson2, updateSignPerson } from '@/utils/base';
import { GetRDDList } from '@/apis/getListAPI.js'
import { SignStepupdate, CountersignAdd } from '@/apis/baseAPI.js'
// 引入组件
const LoadingGIF = defineAsyncComponent(() => import('@/components/LoadingGIF.vue'));
const SignBox = defineAsyncComponent(() => import('@/components/SignBox.vue'));
const CountersignBox = defineAsyncComponent(() => import('@/components/CountersignBox.vue'));
const VoidBox = defineAsyncComponent(() => import('@/components/VoidBox.vue'));
const SignTopBtn = defineAsyncComponent(() => import('@/components/SignTopBtn.vue'));
const SignForm = defineAsyncComponent(() => import('@/components/SignForm.vue'));
const FileCom = defineAsyncComponent(() => import('@/components/FileCom.vue'));
// 引入store
import { userStore } from '@/stores/userStore'
import { signStore } from '@/stores/signStore'
import { baseStore } from '@/stores/baseStore'
import { createStore } from '@/stores/createStore';
const userStoreConfig = userStore()
const signStoreConfig = signStore()
const baseStoreConfig = baseStore()
const createStoreConfig = createStore()
const { userStoreData } = storeToRefs(userStoreConfig)
const { signStoreData } = storeToRefs(signStoreConfig)
const { baseStoreData } = storeToRefs(baseStoreConfig)
const { createStoreData } = storeToRefs(createStoreConfig)

const dataState = ref({
  formId: "" as string | string[],
  // 送出表單的等待畫面
  isLoading: false,
  // 計數api有幾個在執行
  runningCount: 0,
  signPicture: "https://esys.orange-electronic.com/Image/SignerPicture/",
  // 控制 簽核彈跳視窗
  showSignBox: 0,
  // 控制 會簽彈跳視窗
  showCountersignBox: 0,
  // 控制 作廢彈跳視窗
  showVoidBox: 0,
  // 控制 簽核完成後按鈕控制 disabled
  disabledBtn: false,
  // SignBox傳過來的資料
  signModalData: {
    radio: 1,
    password: "",
    opinion: "",
  },
  // CountersignBox傳過來的資料
  countersign: [] as SetCountersign[],
  // 傳給 FileCom 的資料
  model: "sign",
  toFileCom: "RDDForm",
  // 傳給 SignBox 的資料
  formAllData: {
    formCodeName: "RDD",
    formCodeName2: "soft",
    routeList: "/soft",
    updateFormsAPI: "RDDAdd",
    formName: "軟體申請單",
    webNameForm: "RDDForm",
    webNameSign: "RDDSign",
    //完簽
    finishSign: {
      RDDId: "" as string | string[], //單號
      Status: "2", //狀態
      Type: "1", //更新狀態
    },
    //退簽
    returnSign: {
      RDDId: "" as string | string[], //單號
      Status: "3", //狀態
      Type: "1", //更新狀態
    },
    //作廢
    voidSign: {
      RDDId: "" as string | string[], //單號
      Status: "4", //狀態
      Type: "1", //更新狀態
    },
    // 若有確認單類型的要多給clearId，當退簽/作廢時要清除
    clearId: {
      RDDId: "", //單號
      Type: 2, //類別
    },
  },
  // 表單內容
  formContent: {} as ResRDDList,
})

onMounted(() => {
  // 取路由上的 單號/使用者
  const route = useRoute();
  console.log("route", route.params)
  dataState.value.formId = route.params.formId
  dataState.value.formAllData.returnSign.RDDId = route.params.formId;
  dataState.value.formAllData.finishSign.RDDId = route.params.formId;
  dataState.value.formAllData.voidSign.RDDId = route.params.formId;

  // 取部門
  baseStoreConfig.getBranchData({
    DeptId: "", //部門代號
    DeptName: "" //部門名稱
  })
  // 取全部人員資料
  baseStoreConfig.getPersonData({
    DeptId: "", //部門代號
    EmpId: "", //工號
    Company: "", //公司
  })
  // 取得表單內容
  fetchFormContent(dataState.value.formId);
})

// 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
watch(() => dataState.value.runningCount, (newValue) => {
  console.log("watch", newValue)
  dataState.value.isLoading = true;
  if (dataState.value.runningCount === 0) {
    dataState.value.isLoading = false;
  }
})
// 子層傳送改變showSignBox值，顯示/取消 modal
function handleShowSignBox(data: number) {
  dataState.value.showSignBox = data;
}
// 子層傳送改變showCountersignBox值，顯示/取消modal
function handleShowCountersignBox(data: number) {
  dataState.value.showCountersignBox = data;
}
// 子層傳送改變showVoidBox值，顯示/取消modal
function handleShowVoidBox(data: number) {
  dataState.value.showVoidBox = data;
}
//   // 子層SignBox傳控制是否簽核成功
function deliverDisabledBtn(data: boolean) {
  dataState.value.disabledBtn = data;
}
// 取得表單內容
async function fetchFormContent(formId: string | string[]) {
  const inputData = {
    formId: formId,
    webNameSign: "RDDSign",
  };

  dataState.value.runningCount++;
  await GetRDDList({
    Formno: formId, // 送單號
    status: "",
    Coid: "",
    DeptId: "",
    Startdt: "",
    Enddt: "",
    type: "1",
    Createid: "",
  })
    .then(async (response: AxiosResponse<ResRDDList[]>) => {
      console.log("表單內容", response.data[0]);
      response.data[0].choiceDocArr = response.data[0].choiceDoc?.split(',')

      // 取簽核人員
      await signStoreConfig.fetchSigner(inputData)
      // 取簽核順序
      await signStoreConfig.fetchSignStep(inputData)

      response.data[0].director = signStoreData.value.signStep.find(item => item.STEPNAME === '一階主管')

      dataState.value.formContent = response.data[0];

      // 取簽核人上傳附件
      // await signStoreConfig.fetchGetSignWFP(inputData);

      dataState.value.runningCount--;
    })
    .catch((error: any) => {
      dataState.value.runningCount--;
      console.log(error);
      resError("API取得表單內容發生錯誤")
    });
}
// 送簽
async function submitSign(data: any) {
  dataState.value.signModalData = data
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
    ExceId: dataState.value.formContent.CreateId
      ? dataState.value.formContent.CreateId
      : dataState.value.formContent.Empid, //建立人
    Status: "",
  })
    .then(async (response: any) => {
      console.log("簽核成功", response);

      if (response.data === "更新完成") {
        dataState.value.disabledBtn = true;
      }
      // 如果簽核附件有東西，上傳給後端
      if (baseStoreData.value.file.length > 0) {
        const result = await uploadFile(dataState.value);
        // 判斷uploadFile函式，檔案上傳是否成功
        if (result === false) {
          throw "檔案上傳錯誤";
        }
      }
    })
    .then(async () => {
      const inputData = {
        formId: dataState.value.formId,
        formName: "軟體申請單",
      };
      // 如果簽核-同意，取得下一個簽核人員
      if (dataState.value.signModalData.radio === 1) {
        await createStoreConfig.fetchNextSigner(inputData)
        // 發信給下一個簽核人員
        if (createStoreData.value.nextSigner) {
          await createStoreConfig.sendMail(inputData)
        } else {
          // 如果沒有下一個簽核人員，代表簽核完成
          // 須將nextSigner改為空物件，否則在上面nextSigner = response.data[0]他已經變成undefined 
          // 接簽核狀態更新api
          createStoreData.value.nextSigner = {} as ResSigner;
          await finishSignStatus(dataState.value);
          // 完簽發信通知建表人員
          await noticeSendMail(dataState.value, '完簽');
        }
      } else {
        // 如果簽核-不同意，簽核狀態送2退簽
        await returnSignStatus(dataState.value);
        // 退簽發信通知建表人員
        await noticeSendMail(dataState.value, '退簽');
      }
    })
    .then(() => {
      dataState.value.runningCount--;
      // 跳出成功訊息
      signSuccess();
    })
    .catch((error: any) => {
      dataState.value.runningCount--;
      console.log(error);
      resError("API送簽發生錯誤")
    });
}

// 送出 會簽人員
async function submitCountersign(data: any) {
  dataState.value.countersign = data
  // 先排序
  dataState.value.countersign.sort(function (a, b) {
    return a.order - b.order
  })
  console.log("排序後", dataState.value.countersign)
  // 再上傳
  if (dataState.value.countersign.length > 0) {
    dataState.value.runningCount++;
    dataState.value.countersign.forEach((item) => {
      item.FORMNO = dataState.value.formId.toString();
      item.SIGNORDER = signStoreData.value.signer.SIGNORDER;
      item.STEPNAME = "會簽";
      item.SignGroup = "簽核";
    });

    CountersignAdd(dataState.value.countersign)
      .then(async (response: any) => {
        console.log("新增會簽人員", response);
        if (response.data === "更新完成") {
          dataState.value.disabledBtn = true;
        }
        const inputData = {
          formId: dataState.value.formId,
          formName: "軟體申請單",
        };

        // 如果會簽有人，取得下一個簽核人員，發信通知用
        if (dataState.value.countersign.length > 0) {
          await createStoreConfig.fetchNextSigner(inputData)
          await createStoreConfig.sendMail(inputData)
        }
      })
      .then(() => {
        dataState.value.runningCount--;
        // 跳出成功訊息
        signSuccess();
      })
      .catch((error: any) => {
        dataState.value.runningCount--;
        console.log(error);
        resError("API增加會簽人員發生錯誤")
      });
  }

}

// 送出 作廢
async function submitVoid(data: any) {
  dataState.value.signModalData = data
  // 上傳作廢人員名單給後端
  dataState.value.runningCount++;
  const addSigner = []
  addSigner.push({
    FORMNO: dataState.value.formId,
    SIGNER: userStoreData.value.EmpId,
    SIGNERNAME: userStoreData.value.EmpName,
    SIGNORDER: signStoreData.value.signer.SIGNORDER,
    STEPNAME: "作廢人員",
    SignGroup: "作廢",
  })
  await CountersignAdd(addSigner)
    .then((response: any) => {
      console.log("作廢人員上傳後端", response);

      if (response.data === "更新完成") {
        dataState.value.disabledBtn = true;
      }

    }).then(async () => {
      const inputData = {
        formId: dataState.value.formId,
        formName: "軟體申請單",
      };
      await signStoreConfig.fetchSignStep(inputData)
      await voidSignStatus(dataState.value)

      // 更新簽核程序的狀態 => 必須先送作廢的人，再送其他人
      await updateSignPerson2(dataState.value)
      await updateSignPerson(dataState.value)
      // 作廢發信通知建表人員
      await noticeSendMail(dataState.value, '作廢');

    })
    .then(() => {
      dataState.value.runningCount--;
      // 跳出成功訊息
      pushWaitSignPage('RDD')
    })
    .catch((error: any) => {
      dataState.value.runningCount--;
      console.log(error);
      resError("API新增作廢人員發生錯誤")
    });
}
</script>
