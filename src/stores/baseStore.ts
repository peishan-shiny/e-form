import { defineStore } from 'pinia';
import { resError } from '@/utils/base';
import { searchPerson, getBranch } from '@/apis/baseAPI.js';

export const baseStore = defineStore('baseStore', {
  state: () => ({
    baseData: {
      // 部門群組
      branchs: [{
        DeptId: "",
        DeptName: "",
        ResourcesId: ""
      }],
      // 全公司人員
      allPersons: [] as ResUserInfo[]
    },
  }),
  actions: {
    // 向後端拿取部門資料
    async getBranchData(data: GetBranchsInfo) {
      await getBranch(data).then((response: ResBranchsInfo[]) => {
        this.baseData.branchs = response;
        // console.log("store部門資料", this.baseData.branchs)
      }).catch((error: any) => {
        console.log(error)
        resError("API拿取部門資料錯誤" + error)
      })
    },
    // 取全公司人員資料
    async getPersonData(data: GetUserInfo) {
      await searchPerson(data).then((response: ResUserInfo[]) => {
        this.baseData.allPersons = response;
        // console.log("store全公司人員資料", this.baseData.allPersons)
      }).catch((error: any) => {
        console.log(error)
        resError("API拿取人員資料錯誤" + error)
      })
    },
  },
})
