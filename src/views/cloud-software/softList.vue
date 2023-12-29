<template>
  <div class="content">
    <LoadingGIF v-if="dataState.isLoading === true" />
    <p class="title">軟體申請單</p>
    <div class="list-form">
      <!-- 按鈕 -->
      <RouterLink class="action" to="/soft/create">
        <div class="top-btn">
          <img src="@/assets/white/電子表單icon_建立表單.png" alt="" class="icon" />
          建立表單
        </div>
      </RouterLink>

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
                <el-option v-for="item in baseStoreData.branchs" :key="item.DeptId" :value="item.DeptId"
                  :label="item.DeptName">
                </el-option>
              </el-select>
              <el-select v-model="dataState.personValue" class="ml-1 mr-3" placeholder="人員" no-data-text="請先選部門"
                clearable>
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
                <el-option v-for="item in dataState.statusOptions" :label="item.label" :key="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <button class="search-btn btn-black" @click="searchFormList">
              <img src="@/assets/white/電子表單icon_搜尋.png" alt="" class="icon" />
              查詢表單
            </button>
          </el-col>
        </div>
      </div>
      <!-- 搜尋list -->
      <el-table border max-height="500" empty-text="暫無數據" style="width: 100%" :data="dataState.searchResult"
        :header-cell-style="{ color: 'white' }" :header-row-class-name="headerStyleClass" @row-click="clickRow"
        :default-sort="{ prop: 'number', order: 'descending' }">
        <el-table-column type="index" label="項次" width="80" sortable></el-table-column>
        <el-table-column prop="CreateDate" label="建立日期" width="100">
        </el-table-column>
        <el-table-column :prop="dataState.formAllData.id" label="表單號碼" min-width="130" sortable>
        </el-table-column>
        <el-table-column prop="applyReason" label="申請原因" min-width="100">
        </el-table-column>
        <el-table-column prop="applyArea" label="申請地區" min-width="100">
        </el-table-column>
        <el-table-column prop="applyType" label="申請類別" min-width="100">
        </el-table-column>
        <el-table-column prop="programName" label="程式名稱" min-width="100">
        </el-table-column>
        <el-table-column prop="programV" label="程式版號" min-width="100">
        </el-table-column>
        <el-table-column prop="SVNV" label="SVN版號" min-width="100">
        </el-table-column>
        <el-table-column prop="EmpName" label="申請人員" min-width="100">
        </el-table-column>
        <el-table-column prop="status" label="表單狀態" min-width="100">
        </el-table-column>
        <el-table-column prop="NextSIGNER" label="待簽人員" min-width="150">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type AxiosResponse } from 'axios';
import { defineAsyncComponent, onMounted, ref, watch, } from 'vue';
import { useRoute, useRouter, RouterLink } from "vue-router"
import { storeToRefs } from 'pinia';
import { resError, Toast, addDay } from '@/utils/base';
import { GetEmpGroup } from '@/apis/baseAPI.js'
import { GetRDDList } from '@/apis/getListAPI'
// 引入baseStore
import { baseStore } from '@/stores/baseStore';
// 引入userStore
import { userStore } from '@/stores/userStore';
// 引入组件
const LoadingGIF = defineAsyncComponent(() => import('@/components/LoadingGIF.vue'));

const router = useRouter();
const url = location.href;
console.log("網址", url);

// TODO:本地測試用 => 設定 路由query的方法，上線要註解
const route = useRoute();
route.query.Empid = "222010"
const userId = route.query.Empid

// TODO:上線用 => 設定 路由query的方法，上線要打開
// const { query } = useRoute();
// console.log(query)
// const userId = query.Empid

const dataState = ref({
  // 送出表單的等待畫面
  isLoading: false,
  // 計數api有幾個在執行
  runningCount: 0,
  startDate: "",
  endDate: "",
  // 接api拿部門資料
  branchValue: "",
  // 接api拿部門人員資料
  personOptions: [] as ResUserInfo[],
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
  searchResult: [] as ResRDDList[],
  // 查詢list時候，人員限制
  searchLimit: "",
  // 會變動的資料
  formAllData: {
    routeCreate: "soft-create",
    routeSign: "soft-sign",
    signPath: "/soft/sign/",
    createPath: "/soft/create/",
    searchFormsAPI: "GetRDDList",
    id: "RDDID",
  },
})

// 取部門資料
const baseStoreConfig = baseStore();
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

// 取出 baseStore 裡的state資料
const { baseStoreData } = storeToRefs(baseStoreConfig);


// 取使用者資料
const userStoreConfig = userStore();
userStoreConfig.getUserData({
  DeptId: "", //部門代號
  EmpId: userId, //工號
  Company: "" //公司
})
// const { userStoreData } = storeToRefs(userStoreConfig);

onMounted(() => {
  // 取 使用者尚未簽核的表單
  searchNotSign(userId);
})

// 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
watch(() => dataState.value.runningCount, () => {

  dataState.value.isLoading = true;
  if (dataState.value.runningCount === 0) {
    dataState.value.isLoading = false;
  }
})
// 當部門資料改變 過濾人員資料
async function changePersons(DeptId: string) {
  dataState.value.personValue = ""
  dataState.value.personOptions = baseStoreData.value.allPersons.filter(item => item.DeptId === DeptId)
}
// 查詢表單
async function searchFormList() {
  let newDate = "" as any
  if (dataState.value.endDate) {
    newDate = addDay(dataState.value.endDate)
  }

  dataState.value.runningCount++;
  await GetRDDList(
    {
      Formno: "", // 送單號
      status: dataState.value.statusValue, //狀態
      Coid: "", //公司代號
      DeptId: dataState.value.branchValue, //部門代號
      Startdt: dataState.value.startDate, //開始請假日期
      Enddt: newDate.toString(), //原本填結束dataState.value.endDate
      Createid: dataState.value.searchLimit,//原本填dataState.value.personValue
      type: "0",
    }
  ).then((response: AxiosResponse<ResRDDList[]>) => {
    // console.log("搜尋到的資料", response);
    if (response.data == null) {
      Toast.fire({
        icon: "warning",
        title: "此條件查無資料！",
      });
    } else {
      // 判斷如果 搜尋欄位(申請人員)personValue有值，要過濾Empid是否等於personValue
      if (dataState.value.personValue) {
        dataState.value.searchResult = response.data.filter((item: any) => {
          if (item.Empid === dataState.value.personValue) {
            item.CreateDate = item.CreateDate.split(" ")[0];
            return item
          }
        });
      } else {
        dataState.value.searchResult = response.data.map((item: any) => {
          item.CreateDate = item.CreateDate.split(" ")[0];
          return item
        });
      }
    }
    dataState.value.runningCount--;
  }).catch((error: any) => {
    dataState.value.runningCount--;
    console.log(error)
    resError("查詢表單發生錯誤")
  })
}
// 查詢使用者 待簽核表單
async function searchNotSign(id: string) {
  console.log("有抓到使用者id", id);
  dataState.value.runningCount++;
  await GetRDDList({
    status: "1", //狀態
    type: "0",
  }).then((response: AxiosResponse<ResRDDList[]>) => {
    console.log("所有尚未簽核資料", response);

    if (response.data == null) {
      console.log("目前無待簽核表單");
    } else {
      dataState.value.searchResult = response.data.filter((item: any) => {
        item.CreateDate = item.CreateDate.split(" ")[0];
        return item.SIGNER == id
      });
      console.log("為使用者簽核的資料", dataState.value.searchResult);
    }
  }).then(async () => {
    await limitSearchForm(id)
    dataState.value.runningCount--;
  }).catch((error: any) => {
    dataState.value.runningCount--;
    console.log(error)
    resError("查詢待簽核表單發生錯誤")
  })
}

// 限制人員查詢表單，只能查詢自己的
// 只有部分人員可以查詢全部，222010/GroupID="admin"
async function limitSearchForm(userId: string) {
  await GetEmpGroup({
    GroupID: "",
    EmpId: userId, //工號
  })
    .then((response: AxiosResponse<ResEmpGroup[]>) => {
      console.log("人員群組", response.data);
      const person = response.data;
      // 判斷可以查詢全部資料的人員，searchLimit帶空字串
      for (let p of person) {
        if (p.GroupID === "admin" || p.EmpId === "222010") {
          dataState.value.searchLimit = "";
          return
        }
      }
      // 其餘的代自己工號查詢
      dataState.value.searchLimit = userId;
    });
}
// 跳至簽核頁面
function clickRow(row: any) {
  console.log(`${dataState.value.formAllData.signPath}${row[dataState.value.formAllData.id]}/${userId
    }`);
  router.push(
    `${dataState.value.formAllData.signPath}${row[dataState.value.formAllData.id]}/${userId
    }`
  );
}
// 讓table表頭為黑底
function headerStyleClass({ rowIndex }: any) {
  if (rowIndex === 0) {
    return "black-row";
  }
}
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