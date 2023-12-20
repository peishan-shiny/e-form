<template>
  <div class="content">
    <LoadingGIF v-if="dataState.isLoading === true" />
    <p class="title">軟體申請單</p>
    <div class="create-form">
      <!-- 按鈕 -->
      <CreateTopBtn @call-showBox="showBox" :formId="dataState.formId" />

      <!-- 專案內容 -->
      <div class="area">
        <el-form :model="dataState" :rules="rules" ref="ruleForm" label-width="170px" class="demo-ruleForm">
          <div class="area-row">
            <el-col :span="12">
              <el-form-item label="申請單位：" prop="applyDept">
                <el-select v-model="dataState.applyDept" multiple placeholder="可複選">
                  <el-option v-for="item in dataState.applyDeptOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申請原因：" prop="applyReason">
                <el-input v-model="dataState.applyReason"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="12">
              <el-form-item label="程式版號：" prop="programV">
                <el-input v-model="dataState.programV"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SVN版號：" prop="SVNV">
                <el-input v-model="dataState.SVNV"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="程式名稱：" prop="programName">
                <el-input v-model="dataState.programName"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="適用機種：" prop="Model">
                <el-input v-model="dataState.Model"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="IC：" prop="IC">
                <el-input v-model="dataState.IC"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="area-row">
            <el-col :span="24">
              <el-form-item label="備註：">
                <el-input type="textarea" :autosize="{ minRows: 1 }" v-model="dataState.reviseB"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-form>
      </div>

      <!-- 附加文件 -->
      <FileCom />
    </div>
  </div>
</template>

<script  setup lang="ts">
import { defineAsyncComponent, onMounted, ref, reactive, watch, } from 'vue';
import { storeToRefs } from 'pinia';
import { resError, Toast } from '@/utils/base';
import CreateTopBtn from "@/components/CreateTopBtn.vue";
import FileCom from "@/components/FileCom.vue";

// 引入组件
const LoadingGIF = defineAsyncComponent(() => import('@/components/LoadingGIF.vue'));

const dataState = ref({
  // 送出表單的等待畫面
  isLoading: false,
  // 計數api有幾個在執行
  runningCount: 0,
  // 類別選項
  typeOptions: [
    {
      label: "接收器",
      value: "接收器"
    },
    {
      label: "發射器",
      value: "發射器"
    },
  ],
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
  applyArea: "",
  // 申請類別
  applyType: "",
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
  choiceDoc: "",
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
// computed: {
//   userData() {
//     return this.$store.state.base.userData;
//   },
//   file() {
//     return this.$store.state.base.file;
//   },
//   projectAll() {
//     return this.$store.state.base.projectAll;
//   },
//   project() {
//     return this.$store.state.base.project;
//   },
// },
// watch: {
//   // 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
//   runningCount: {
//     handler: function () {
//       if (this.runningCount === 0) {
//         this.isLoading = false;
//       } else {
//         this.isLoading = true;
//       }
//     },
//   },
// },
// methods: {
//   // 當改變專案代號時 取 專案名稱
//   async fetchProName(proId) {
//     this.runningCount++;
//     await this.$store.dispatch("base/fetchProjectData", proId).catch((error) => {
//       this.$alert(error.message, {
//         confirmButtonText: '確定',
//         type: "warning"
//       });
//     }).finally(async () => {
//       await this.fetchSpecial(proId)
//       this.runningCount--;
//     })
//   },
//   // 當改變專案代號時 取 關鍵及特殊特性對應的表單
//   async fetchSpecial(proId) {
//     this.runningCount++;
//     await getListAPI
//       .GetOENList({
//         Formno: proId, // 送專案代號
//         Formno2: "", // 送單號
//         status: "",
//         Coid: "",
//         DeptId: "",
//         Startdt: "",
//         Enddt: "",
//         type: "0",
//         Createid: "",
//       })
//       .then(async (response) => {
//         this.specialFormArr = response.data;
//         console.log("關鍵及特殊特性清單", this.specialFormArr);
//       })
//       .catch((error) => {
//         console.log(error, "取得表單內容發生錯誤！");
//         Toast.fire({
//           icon: "warning",
//           title: "無法取得關鍵及特殊特性資料，請聯絡IT人員！",
//         });
//       }).finally(() => {
//         this.runningCount--;
//       })
//   },
//   // 子層傳來的proFormat，再送表單
//   deliverProFormat(data) {
//     this.proFormat = data;
//     this.controlData = false;
//     //確定拿到子層proFormat，再送出表單
//     this.verifyContent();
//   },
//   // 子層傳來改變controlData為false，因proFormat有空值
//   deliverControlData(data) {
//     this.controlData = data;
//   },
//   // 當填完input將errorBorder樣式移除
//   removeBorder(inputNmae) {
//     this.isErrorBorder = this.isErrorBorder.filter(
//       (item) => item !== inputNmae
//     );
//   },
//   // 跳出彈跳框
//   showBox() {
//     if (this.proId && this.typeValue && this.fileVersion) {
//       const Swal = require("sweetalert2");
//       Swal.fire({
//         title: "表單送簽",
//         text: "表單送出後，如要更改或作廢請洽MIS",
//         showCancelButton: true,
//         confirmButtonColor: "#333",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "確認",
//         cancelButtonText: "取消",
//       }).then((resule) => {
//         // console.log(resule)
//         if (resule.value) {
//           // 確定傳送表單將controlData改為true，請子元件傳送資料過來
//           this.controlData = true;
//         }
//       });
//     } else {
//       // 如果有空值的input 加上errorBorder樣式
//       if (this.proId == "") {
//         this.isErrorBorder.push("proId");
//       }
//       if (this.typeValue == "") {
//         this.isErrorBorder.push("typeValue");
//       }
//       if (this.fileVersion == "") {
//         this.isErrorBorder.push("fileVersion");
//       }
//       Toast.fire({
//         icon: "warning",
//         title: "請填寫專案代號/類別/版次",
//       });
//     }
//   },
//   // 驗證表單是否有填寫完整
//   async verifyContent() {
//     this.runningCount++;
//     await addFormAPI
//       .OEBAdd({
//         OEBID: "", //單號
//         Status: "1", //狀態
//         ProCode: this.proId, //專案代號
//         ComId: this.userData.ResourcesId, // 公司id
//         Deptid: this.userData.DeptId, // 部門id
//         FILENAME: this.typeValue, //檔案名稱
//         VERSION: this.fileVersion, //版次
//         CreateId: this.userData.EmpId, // 建檔人
//       })
//       .then(async (response) => {
//         console.log("回應表單號碼", response.data);
//         // 存取表單號碼
//         this.formId = response.data;

//         // 如果附件有東西，上傳給後端
//         if (this.file.length > 0) {
//           const result = await this.uploadFile();
//           // 判斷uploadFile函式，檔案上傳是否成功
//           if (result === false) {
//             throw "檔案上傳錯誤";
//           }
//         }

//         return this.formId;
//       })
//       .then(async (formId) => {
//         // 上傳產品規格表
//         await this.uploadProFormat(formId);

//         return formId;
//       })
//       .then(async (formId) => {
//         // 取得第一個簽核人員
//         const inputData = {
//           formId: formId,
//           formName: "初期產品規格表",
//         };
//         await this.$store.dispatch("sign/fetchNextSigner", inputData);
//         console.log("等待取簽核人員外面的await結束");
//       })
//       .then(async () => {
//         // 將file資料清除
//         await this.$store.commit("base/clearFile");
//         console.log("成功");
//         this.runningCount--;
//         // 跳出成功視窗
//         const Swal = require("sweetalert2");
//         Swal.fire({
//           title: "成功送出",
//           confirmButtonColor: "#333",
//           confirmButtonText: "確認",
//         }).then((resule) => {
//           console.log(resule);
//           if (resule.value) {
//             // 轉跳到各表單搜尋頁面
//             window.top.location =
//               "https://esys.orange-electronic.com/RDDocument/Index?id=OEB&formN=index";
//           }
//         });
//       })
//       .catch((error) => {
//         console.log(error, "建立表單發生錯誤！");
//         this.runningCount--;
//         Toast.fire({
//           icon: "warning",
//           title: "無發建立，請聯絡IT人員！",
//         });
//       });
//   },
//   // 上傳附件給後端
//   async uploadFile() {
//     if (this.file.length === 0) return true;
//     // shift() 用法 => 會把file陣列裡的第一個拿出來，且會改變原本陣列detailFile會刪除第一個
//     const uploadDFileCurrent = this.file.shift();
//     console.log("uploadDFileCurrent", uploadDFileCurrent);

//     let formData = new FormData();
//     formData.append("file", uploadDFileCurrent);
//     formData.append("FileName", uploadDFileCurrent.name);
//     formData.append("FormId", this.formId);
//     formData.append("EmpId", this.userData.EmpId);
//     formData.append("WebName", "OEBForm");
//     this.runningCount++;
//     // fileUploadStatus記錄上傳檔案成功或失敗
//     const fileUploadStatus = await baseAPI
//       .uploadFile(formData)
//       .then((response) => {
//         console.log("附件上傳後端", response);
//         this.runningCount--;
//         return true;
//       })
//       .catch((error) => {
//         this.runningCount--;
//         console.log("附件上傳後端error", error);
//         Toast.fire({
//           icon: "error",
//           title: "附件上傳失敗請再試一次或聯絡IT人員",
//         });
//         return false;
//       });
//     if (fileUploadStatus === false) {
//       return false;
//     }
//     // 過一秒後再執行一次，直到detailFile長度為0
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(this.uploadFile());
//       }, 1000);
//     });
//   },
//   // 上傳產品規格表
//   async uploadProFormat(formId) {
//     this.proFormat.forEach((item) => {
//       this.newProFormat.push({
//         OEBId: formId, //單號
//         Descs: item.Descs, //項目
//         Size: item.Size, //規格
//         Remark: item.Remark, //備註
//       });
//     });
//     console.log("上傳產品規格表LIST", this.newProFormat);
//     this.runningCount++;
//     await addFormAPI
//       .OEBDAdd(this.newProFormat)
//       .then((response) => {
//         console.log("上傳產品規格表給後端", response);
//         this.runningCount--;
//       })
//       .catch((error) => {
//         this.runningCount--;
//         console.log("上傳產品規格表error", error);
//         Toast.fire({
//           icon: "error",
//           title: "上傳產品規格表失敗，請聯絡IT人員",
//         });
//       });
//   },
// },
</script>
