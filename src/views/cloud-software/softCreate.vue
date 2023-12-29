<template>
  <div class="content">
    <LoadingGIF v-if="dataState.isLoading === true" />
    <div class="create-form">
      <p class="title">軟體申請單</p>
      <!-- 按鈕 -->
      <CreateTopBtn :formId="dataState.formId" @call-show-box="verifyForm" />

      <!-- 專案內容 -->
      <div class="area">
        <el-form :model="dataState.ruleForm" :rules="dataState.rules" ref="ruleFormDOM" label-width="170px"
          class="demo-ruleForm">
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="請選擇研發PA：" prop="RDPAEmpid">
                <el-select v-model="dataState.ruleForm.RDPADept" @change="changePersons(dataState.ruleForm.RDPADept)"
                  placeholder="部門" no-data-text="無數據">
                  <el-option v-for="item in baseStoreData.branchs" :key="item.DeptId" :label="item.DeptName"
                    :value="item.DeptId">
                  </el-option>
                </el-select>
                <el-select v-model="dataState.ruleForm.RDPAEmpid" class="ml-1" placeholder="人員">
                  <el-option v-for="item in dataState.ruleForm.personOptions" :key="item.EmpId" :label="item.EmpName"
                    :value="item.EmpId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="12">
              <el-form-item label="申請單位：" prop="applyDept">
                <el-select v-model="dataState.ruleForm.applyDept" placeholder="請選擇" :popper-append-to-body="false">
                  <el-option v-for="item in dataState.ruleForm.applyDeptOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申請原因：" prop="applyReason">
                <el-select v-model="dataState.ruleForm.applyReason" placeholder="請選擇">
                  <el-option v-for="item in dataState.ruleForm.applyReasonOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="12">
              <el-form-item label="程式版號：" prop="programV">
                <el-input v-model="dataState.ruleForm.programV"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SVN版號：" prop="SVNV">
                <el-input v-model="dataState.ruleForm.SVNV"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="程式名稱：" prop="programName">
                <el-input v-model="dataState.ruleForm.programName"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="適用機種：" prop="Model">
                <el-input v-model="dataState.ruleForm.Model"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="IC：" prop="IC">
                <el-input v-model="dataState.ruleForm.IC"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <hr style="border: 1px dashed var(--gray-border);" />
          <div class="area-row">
            <el-col :span="12">
              <el-form-item label="申請地區：" prop="applyArea">
                <el-select v-model="dataState.ruleForm.applyArea" multiple placeholder="可複選"
                  :popper-append-to-body="false">
                  <el-option v-for="item in dataState.ruleForm.applyAreaOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申請類別：" prop="applyType">
                <el-select v-model="dataState.ruleForm.applyType" multiple placeholder="可複選">
                  <el-option v-for="item in dataState.ruleForm.applyTypeOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="四階料號：">
                <el-input v-model="dataState.ruleForm.bomElno"
                  @change="fetchModelNO(dataState.ruleForm.bomElno, 'bomElno')"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="Model NO：">
                <el-input v-model="dataState.ruleForm.modelNO" disabled></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="蘇州四階料號：">
                <el-input v-model="dataState.ruleForm.suzobomElno"
                  @change="fetchModelNO(dataState.ruleForm.suzobomElno, 'suzobomElno')"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="蘇州Model NO：">
                <el-input v-model="dataState.ruleForm.suzoModelNO" disabled></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="修改前內容：">
                <el-input type="textarea" :autosize="{ minRows: 1 }" v-model="dataState.ruleForm.reviseB"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="修改後內容：">
                <el-input type="textarea" :autosize="{ minRows: 1 }" v-model="dataState.ruleForm.reviseA"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="相關文件是否修改：">
                <el-radio v-model="dataState.ruleForm.reviseDoc" label="是">是</el-radio>
                <el-radio v-model="dataState.ruleForm.reviseDoc" label="否">否</el-radio>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="選擇修改文件：">
                <el-checkbox-group v-model="dataState.ruleForm.choiceDoc">
                  <el-checkbox label="品質手冊" :disabled="dataState.ruleForm.reviseDoc === '否'"></el-checkbox>
                  <el-checkbox label="程序" :disabled="dataState.ruleForm.reviseDoc === '否'"></el-checkbox>
                  <el-checkbox label="作業標準書" :disabled="dataState.ruleForm.reviseDoc === '否'"></el-checkbox>
                  <el-checkbox label="表格" :disabled="dataState.ruleForm.reviseDoc === '否'"></el-checkbox>
                  <el-checkbox label="其他" :disabled="dataState.ruleForm.reviseDoc === '否'"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </div>
        </el-form>
      </div>

      <!-- 附加文件 -->
      <FileCom />
      <p class="version">QP-038-07-H</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type AxiosResponse } from 'axios';
import Swal from 'sweetalert2'
import { defineAsyncComponent, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { resError, pushWaitSignPage, addSignCounter } from '@/utils/base';
import { RDDAdd } from '@/apis/addFormAPI.js';
import { UploadFormData, GetElno } from '@/apis/baseAPI.js';
// 引入组件
const LoadingGIF = defineAsyncComponent(() => import('@/components/LoadingGIF.vue'));
const CreateTopBtn = defineAsyncComponent(() => import('@/components/CreateTopBtn.vue'));
const FileCom = defineAsyncComponent(() => import('@/components/FileCom.vue'));

import { userStore } from '@/stores/userStore';
import { baseStore } from '@/stores/baseStore';
import { createStore } from '@/stores/createStore';
const userStoreConfig = userStore()
const { userStoreData } = storeToRefs(userStoreConfig);

const baseStoreConfig = baseStore()
const { baseStoreData } = storeToRefs(baseStoreConfig);
// 將file資料清除
baseStoreData.value.file = []

const createStoreConfig = createStore()
const { createStoreData } = storeToRefs(createStoreConfig)

const ruleFormDOM = ref(null)
const dataState = ref({
  // 送出表單的等待畫面
  isLoading: false,
  // 計數api有幾個在執行
  runningCount: 0,
  ruleForm: {
    // RDPA
    RDPADept: "",
    RDPAEmpid: "",
    personOptions: [] as ResUserInfo[],
    // 申請單位
    applyDept: "",
    applyDeptOptions: [
      {
        value: "研發一課",
        label: "研發一課",
      },
      {
        value: "研發二課",
        label: "研發二課",
      },
      {
        value: "研發三課",
        label: "研發三課",
      },
    ],
    // 申請原因
    applyReason: "",
    applyReasonOptions: [
      {
        value: "制定",
        label: "制定",
      },
      {
        value: "修定",
        label: "修定",
      },
      {
        value: "廢止",
        label: "廢止",
      },
    ],
    // 程式版號
    programV: "",
    // SVNV
    SVNV: "",
    // 程式名稱
    programName: "",
    // 適用機種
    Model: "",
    // IC
    IC: "",
    // 申請地區
    applyArea: [],
    applyAreaOptions: [
      {
        value: "台灣",
        label: "台灣",
      },
      {
        value: "蘇州",
        label: "蘇州",
      },
    ],
    // 申請類別
    applyType: [],
    applyTypeOptions: [
      {
        value: "產線",
        label: "產線",
      },
      {
        value: "雲端",
        label: "雲端",
      },
    ],
    // 四階料號
    bomElno: "",
    // Model NO
    modelNO: "",
    // 蘇州四階料號
    suzobomElno: "",
    // 蘇州Model NO
    suzoModelNO: "",
    // 修改前內容
    reviseB: "",
    // 修改後內容
    reviseA: "",
    // 相關文件是否修改
    reviseDoc: "",
    // 選擇修改文件
    choiceDoc: [],
  },
  rules: {
    RDPAEmpid: [
      { required: true, message: "請選擇簽核時的研發PA", trigger: "change" },
    ],
    applyDept: [
      { required: true, message: "請選擇申請單位", trigger: "change" },
    ],
    applyReason: [
      { required: true, message: "請選擇申請原因", trigger: "change" },
    ],
    programV: [
      { required: true, message: "請填寫程式版號", trigger: "change" },
    ],
    SVNV: [
      { required: true, message: "請填寫SVN", trigger: "change" },
    ],
    programName: [
      { required: true, message: "請填寫程式名稱", trigger: "change" },
    ],
    Model: [
      { required: true, message: "請填寫適用機種", trigger: "change" },
    ],
    IC: [
      { required: true, message: "請填寫IC", trigger: "change" },
    ],
    applyArea: [
      { type: 'array', required: true, message: "請選擇申請地區", trigger: "change" },
    ],
    applyType: [
      { type: 'array', required: true, message: "請選擇申請類別", trigger: "change" },
    ],
    // bomElno: [
    //   { required: true, message: "請填寫四階料號", trigger: "change" },
    // ],
    // suzobomElno: [
    //   { required: true, message: "請填寫蘇州四階料號", trigger: "change" },
    // ],
  },
  // 上傳成功將單號存起來
  formId: "",
})

// 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
watch(() => dataState.value.runningCount, (newValue) => {
  console.log("watch", newValue)
  dataState.value.isLoading = true;
  if (dataState.value.runningCount === 0) {
    dataState.value.isLoading = false;
  }
})

// 當部門資料改變 過濾人員資料
async function changePersons(DeptId: string) {
  dataState.value.ruleForm.RDPAEmpid = ""
  dataState.value.ruleForm.personOptions = baseStoreData.value.allPersons.filter(item => item.DeptId === DeptId)
}

function verifyForm() {
  (ruleFormDOM.value as any).validate((valid: boolean) => {
    if (valid) {
      console.log("驗證ok", valid);
      showBox()
    } else {
      console.log("驗證error", valid);
    }
  });
}

// 跳出彈跳框
async function showBox() {
  // 要核對程式名稱是否與上傳的file名稱相同
  Swal.fire({
    title: "表單送簽",
    text: "表單送出後，如要更改或作廢請洽MIS",
    showCancelButton: true,
    confirmButtonColor: "#333",
    cancelButtonColor: "#d33",
    confirmButtonText: "確認",
    cancelButtonText: "取消",
  }).then((resule) => {
    if (resule.value) {
      verifyContent()
    }
  })
}

// 驗證表單是否有填寫完整
async function verifyContent() {
  dataState.value.runningCount++;
  await RDDAdd({
    RDDId: "", //單號
    Status: "1", //狀態
    ComId: userStoreData.value.ResourcesId, //公司代號
    DeptId: userStoreData.value.DeptId, //部門代號
    applyDept: dataState.value.ruleForm.applyDept, //申請單位
    applyReason: dataState.value.ruleForm.applyReason, //申請原因
    programV: dataState.value.ruleForm.programV, //程式版號
    SVNV: dataState.value.ruleForm.SVNV, //SVN版號
    programName: dataState.value.ruleForm.programName, //程式名稱
    Model: dataState.value.ruleForm.Model, //適用機種
    IC: dataState.value.ruleForm.IC, //IC
    applyArea: dataState.value.ruleForm.applyArea.join(","), //申請地區
    applyType: dataState.value.ruleForm.applyType.join(","), //申請類別
    bomElno: dataState.value.ruleForm.bomElno, //四階料號
    modelNO: dataState.value.ruleForm.modelNO, //Model NO
    suzobomElno: dataState.value.ruleForm.suzobomElno, //蘇州四階料號
    suzoModelNO: dataState.value.ruleForm.suzoModelNO, //蘇州Model NO
    reviseB: dataState.value.ruleForm.reviseB, //修改前內容
    reviseA: dataState.value.ruleForm.reviseA, //修改後內容
    reviseDoc: dataState.value.ruleForm.reviseDoc, //相關文件是否修改
    choiceDoc: dataState.value.ruleForm.choiceDoc.join(","), //選擇修改文件
    Createid: userStoreData.value.EmpId,
    Type: "0"
  })
    .then(async (response: AxiosResponse<string>) => {
      console.log("回應表單號碼", response.data);
      // 存取表單號碼
      dataState.value.formId = response.data;

      // 如果附件有東西，上傳給後端
      if (baseStoreData.value.file.length > 0) {
        const result = await uploadFile();
        // 判斷uploadFile函式，檔案上傳是否成功
        if (result === false) {
          throw "檔案上傳錯誤";
        }
      }

      return dataState.value.formId;
    })
    .then(async (formId: string) => {
      // 取得第一個簽核人員
      const inputData = {
        formId: formId,
        formName: "軟體申請單",
      };

      // 這邊要插入研發PA => 用會簽方式自加入 
      await addSignCounter({
        SIGNER: dataState.value.ruleForm.RDPAEmpid,
        FORMNO: dataState.value.formId,
        SIGNORDER: "1",
        STEPNAME: "研發PA",
        SignGroup: "簽核"
      })

      // 取下一個簽核人
      await createStoreConfig.fetchNextSigner(inputData)

      console.log("發信前");
      await createStoreConfig.sendMail(inputData)
      console.log("結束");
    })
    .then(() => {
      console.log("成功");
      dataState.value.runningCount--;
      // 跳出成功視窗
      pushWaitSignPage('RDD')
    })
    .catch((error: any) => {
      console.log(error)
      dataState.value.runningCount--;
      resError("建立表單發生錯誤！")
    })
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
  formData.append("EmpId", userStoreData.value.EmpId);
  formData.append("WebName", "RDDForm");

  dataState.value.runningCount++;
  // fileUploadStatus記錄上傳檔案成功或失敗
  const fileUploadStatus = await UploadFormData(formData)
    .then((response: ResUploadFile) => {
      console.log("附件上傳後端", response);
      dataState.value.runningCount--;
      return true;
    })
    .catch((error: any) => {
      console.log(error)
      dataState.value.runningCount--;
      resError("附件上傳後端發生錯誤")
      return false;
    })
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

// 依照四階料號拿取ModelNO
async function fetchModelNO(bomElno: string, type: string) {
  await GetElno(bomElno).then(async (response: any) => {
    if (type === 'bomElno') {
      dataState.value.ruleForm.modelNO = response.data[0].el_taxno
    } else {
      dataState.value.ruleForm.suzoModelNO = response.data[0].el_taxno
    }

    console.log("ModelNO", dataState.value.ruleForm.modelNO)
    console.log("suzoModelNO", dataState.value.ruleForm.suzoModelNO)
  }).catch((error: any) => {
    console.log(error)
    resError("取ModelNO發生錯誤")
  })
}
</script>
