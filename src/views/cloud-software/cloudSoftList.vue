<template>
  <div class="content">
    <LoadingGIF v-if="dataState.isLoading === true" />
    <p class="title">軟體申請單</p>
    <div class="list-form">
      <!-- 按鈕 -->
      <router-link class="action" to="/cloudSoft/create">
        <div class="top-btn">
          <img src="@/assets/white/電子表單icon_建立表單.png" alt="" class="icon" />
          建立表單
        </div>
      </router-link>

      <!-- 搜尋 -->
      <div class="block-search">
        <div class="search-row">
          <el-col :xs="24" :sm="24" :md="12">
            <!-- 建立日期 -->
            <div class="search-area">
              <div class="search-title">建立日期</div>
              <el-date-picker v-model="dataState.startDate" type="date" class="date-input" value-format="YYYY-MM-DD"
                placeholder="建立周期(起)"></el-date-picker>
              &nbsp;&nbsp;&nbsp;
              <div class="search-title">~</div>
              <el-date-picker v-model="dataState.endDate" type="date" value-format="YYYY-MM-DD"
                placeholder="建立周期(迄)"></el-date-picker>
            </div>
          </el-col>
        </div>
        <div class="search-row">
          <el-col :xs="24" :sm="24" :md="12">
              <!-- 建立人員 -->
              <div class="search-area">
                <div class="search-title">申請人員</div>
                <el-select v-model="dataState.branchValue" @change="changePersons(dataState.branchValue)" placeholder="部門"
                  no-data-text="無數據" clearable>
                  <el-option v-for="item in baseData.branchs" :key="item.DeptId" :value="item.DeptId"
                    :label="item.DeptName">
                  </el-option>
                </el-select>
                <el-select v-model="dataState.personValue" class="ml-1 mr-3" placeholder="人員" no-data-text="請先選部門" clearable>
                  <el-option v-for="item in dataState.personOptions" :key="item.EmpId" :value="item.EmpId"
                    :label="item.EmpName">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <div class="search-area">
              <div class="search-title">表單狀態</div>
              <el-select v-model="dataState.statusValue" placeholder="不拘" clearable>
                <el-option v-for="item in dataState.statusOptions" :label="item.label" :key="item.value" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <!-- <button class="search-btn btn-black" @click="searchFormList">
              <img src="@/assets/white/電子表單icon_搜尋.png" alt="" class="icon" />
              查詢表單
            </button> -->
          </el-col>
        </div>
      </div>
      <!-- 搜尋list -->
      <!-- <el-table border max-height="500" empty-text="暫無數據" style="width: 100%" :data="dataState.searchResult"
        :header-cell-style="{ color: 'white' }" :header-row-class-name="headerStyleClass" @row-click="clickRow"
        :default-sort="{ prop: 'number', order: 'descending' }">
        <el-table-column type="index" label="項次" width="80" sortable></el-table-column>
        <el-table-column prop="date" label="建立日期" width="100">
        </el-table-column>
        <el-table-column :prop="dataState.formAllData.id" label="表單單號" min-width="130" sortable>
        </el-table-column>
        <el-table-column prop="CustName" label="客戶名稱" min-width="150">
        </el-table-column>
        <el-table-column prop="ProName" label="專案名稱" min-width="150">
        </el-table-column>
        <el-table-column prop="ProCode" label="專案代號" min-width="150">
        </el-table-column>
        <el-table-column prop="EmpName" label="建檔人員" min-width="100">
        </el-table-column>
        <el-table-column prop="Status" label="簽核狀態" min-width="100">
        </el-table-column>
        <el-table-column prop="NextSIGNER" label="待簽人員" min-width="150">
        </el-table-column>
      </el-table> -->
    </div>
  </div>
</template>

<script setup lang="ts" name="FeasibilityList">
// 引入组件
const LoadingGIF = defineAsyncComponent(() => import('@/components/LoadingGIF.vue'));
import getListAPI from "@/apis/getListAPI.js";
// import baseAPI from "@/apis/baseAPI";
// import { Toast } from "@/utils/helper.js";
import { defineAsyncComponent, onMounted, reactive, computed, watch } from 'vue';
import { useRoute } from "vue-router"
import { storeToRefs } from 'pinia';

import { getPersonData } from '@/utils/base';

const url = location.href;
console.log("網址", url);

// TODO:本地測試用 => 設定 路由query的方法，上線要註解
const data = useRoute();
data.query.Empid = "222010"
const userId = data.query.Empid

// TODO:上線用 => 設定 路由query的方法，上線要打開
// const { query } = useRoute();
// console.log(query)
// const userId = query.Empid


// 取部門資料
import { baseStore } from '@/stores/baseStore';

const baseStoreConfig = baseStore();
baseStoreConfig.getBranchData({
  DeptId: "", //部門代號
  DeptName: "" //部門名稱
})

const { baseData } = storeToRefs(baseStoreConfig);



// 取使用者資料
import { userStore } from '@/stores/userStore';

const userStoreConfig = userStore();
userStoreConfig.getUserData({
  DeptId: "", //部門代號
  EmpId: userId, //工號
  Company: "" //公司
}).catch((error)=>{
  console.log(error)
})

// const { userData } = storeToRefs(userStoreConfig);

const dataState = reactive({
  // 送出表單的等待畫面
  isLoading: false,
  // 計數api有幾個在執行
  runningCount: 0,
  startDate: "",
  endDate: "",
  // 接api拿部門資料
  branchValue: "",
  // 接api拿部門人員資料
  personOptions: [] as UserInfo[] | any,
  personValue: "",
  // 下拉式 表單狀態
  statusOptions: [
    {
      value: 1,
      label: "簽核中",
    },
    {
      value: 2,
      label: "完簽",
    },
    {
      value: 3,
      label: "退簽",
    },
    {
      value: 4,
      label: "作廢",
    },
  ],
  statusValue: "",
  // 專案代號
  projectNumber: "",
  searchResult: [],
  // 查詢list時候，人員限制
  searchLimit: "",
  // 會變動的資料
  formAllData: {
    routeCreate: "feasibility-create",
    routeSign: "feasibility-sign",
    signPath: "/feasibility/sign/",
    createPath: "/feasibility/create/",
    searchFormsAPI: "GetOEMList",
    id: "OEMId",
  },
})

onMounted(() => {
  //TODO:EmpId帶自己id試試
  // const { Empid = "222010" } = this.$route.query; //TODO:上線要註解這行
  // const url = location.href;
  // console.log("網址", url);
  // const Empid = $route.query.Empid; //TODO:上線要打開這行
  // console.log("取網址上的工號", Empid);
  // 將userId存在store
  // this.$store.commit("base/updateUserId", Empid);
  // 將userId帶入actions取得使用者資料
  // this.$store.dispatch("base/fetchUserData", Empid);
  // 取部門資料
  // this.$store.dispatch("base/fetchBranchData");
  // 取專案資料
  // this.$store.dispatch("base/fetchProjectAll")
  // 清除專案名稱
  // this.$store.commit("base/clearProject")
  // 取 使用者尚未簽核的表單
  // this.searchNotSign(this.userId);
})

// 當部門資料改變 取人員資料
async function changePersons(DeptId:string) {
  dataState.personOptions = await getPersonData({
    DeptId: DeptId, //部門代號
    EmpId: "", //工號
    Company: "", //公司
  })
  console.log("有進", dataState.personOptions)
}
// 查詢表單
// async function searchFormList() {
//   dataState.runningCount++;
//   await getListAPI.GetOEMList(
//   {
//     Formno: dataState.projectNumber, // 送專案代號
//     Formno2: "", // 送單號
//     Name: "", // 送專案名稱
//     status: dataState.statusValue, //狀態
//     Coid: "", //公司代號
//     DeptId: dataState.branchValue, //部門代號
//     Startdt: dataState.startDate, //開始請假日期
//     Enddt: dataState.endDate, //結束
//     Createid: dataState.searchLimit,//原本填this.personValue
//     type: "0",
//   }
//   ).then((response) => {
//   console.log("搜尋到的資料", response.data);
//   if (response.data == null) {
//     Toast.fire({
//       icon: "warning",
//       title: "此條件查無資料！",
//     });
//   } else {
//     // 判斷如果 搜尋欄位(申請人員)personValue有值，要過濾Empid是否等於personValue
//     if (dataState.personValue) {
//       dataState.searchResult = response.data.filter((item) => {
//         if (item.Empid === dataState.personValue) {
//           item.date = item.CreateDate.split(" ")[0];
//           item.Status = item.Status ? item.Status : item.status;
//           item.ProCode = item.ProCode === '' ? '待定' : item.ProCode
//           item.ProName = item.ProName === '' ? '待定' : item.ProName
//           return item
//         }
//       });
//     } else {
//       dataState.searchResult = response.data.map((item) => {
//         item.date = item.CreateDate.split(" ")[0];
//         item.Status = item.Status ? item.Status : item.status;
//         item.ProCode = item.ProCode === '' ? '待定' : item.ProCode
//         item.ProName = item.ProName === '' ? '待定' : item.ProName
//         return item
//       });
//     }
//   }
//   dataState.runningCount--;
//   })
//   .catch((error) => {
//     console.log(error, "查詢表單發生錯誤！");
//     dataState.runningCount--;
//     Toast.fire({
//       icon: "warning",
//       title: "無法取得資料，請聯絡IT人員！",
//     });
//   });
// },
// computed: {
//   branchs() {
//     return this.$store.state.base.branchs;
//   },
//   userId() {
//     return this.$store.state.base.userId;
//   },
//   projectAll() {
//     return this.$store.state.base.projectAll;
//   },
//   project() {
//     return this.$store.state.base.project;
//   },
// }
// 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
// watch(dataState.runningCount, () => {
//   if (dataState.runningCount === 0) {
//     stadataStatete.isLoading = false;
//   } else {
//     dataState.isLoading = true;
//   }
// })
// methods: {
//     // 當改變專案代號時 取 專案名稱
//     async fetchProName(proId) {
//     if (proId === "") {
//       this.$store.commit("base/clearProject")
//       return
//     }
//     dataState.runningCount++;
//     await this.$store.dispatch("base/fetchProjectData", proId).catch((error) => {
//       this.$alert(error.message, {
//         confirmButtonText: '確定',
//         type: "warning"
//       });
//     }).finally(() => {
//       dataState.runningCount--;
//     })
//   },
    
//     // 限制人員查詢表單，只能查詢自己的
//     // 只有部分人員可以查詢全部，222010/GroupID="admin"
//     async limitSearchForm(userId) {
//     await baseAPI
//       .GetEmpGroup({
//         GroupID: "",
//         EmpId: userId, //工號
//       })
//       .then((response) => {
//         console.log("人員群組", response.data);
//         const person = response.data;
//         // 判斷可以查詢全部資料的人員，searchLimit帶空字串
//         for (let p of person) {
//           if (p.GroupID === "admin" || p.EmpId === "222010" || p.EmpId === "205002" || p.EmpId === "217008") {
//             dataState.searchLimit = "";
//             return
//           }
//         }
//         // 其餘的代自己工號查詢
//         dataState.searchLimit = userId;
//       });
//   },

//     // 查詢使用者 待簽核表單
//     async searchNotSign(id) {
//     console.log("有抓到使用者id", id);
//     dataState.runningCount++;
//     await getListAPI.GetOEMList({
//       status: "1", //狀態
//       type: "0",
//     }).then((response) => {
//       console.log("所有尚未簽核資料", response.data);

//       if (response.data == null) {
//         console.log("目前無待簽核表單");
//       } else {
//         dataState.searchResult = response.data.filter((item) => {
//           item.date = item.CreateDate.split(" ")[0];
//           item.Status = item.Status ? item.Status : item.status;
//           item.ProCode = item.ProCode === '' ? '待定' : item.ProCode
//           item.ProName = item.ProName === '' ? '待定' : item.ProName

//           return item.SIGNER == id
//         });
//         console.log("為使用者簽核的資料", dataState.searchResult);
//       }
//     }).then(async () => {
//       await this.limitSearchForm(id)
//       dataState.runningCount--;
//     })
//       .catch((error) => {
//         console.log(error, "查詢表單發生錯誤！");
//         dataState.runningCount--;
//         Toast.fire({
//           icon: "warning",
//           title: "無法取得資料，請聯絡IT人員！",
//         });
//       });
//   },
//   // 讓table表頭為黑底
//   headerStyleClass({ rowIndex }) {
//     if (rowIndex === 0) {
//       return "black-row";
//     }
//   },
//   clickRow(row) {
//     // console.log(row[dataState.formAllData.id]);
//     // 跑簽核頁面
//     this.$router.push(
//       `${dataState.formAllData.signPath}${row[dataState.formAllData.id]}/${this.userId
//       }`
//     );
//   },
// },
</script>

<style>
/* 表頭設置黑色 */
.el-table .black-row {
  background-color: var(--black);
}

.el-table th.el-table__cell {
  background-color: unset;
}
</style>