import { defineStore } from 'pinia';
import {searchPerson,getBranch} from '@/apis/baseAPI.js';

export const baseStore = defineStore('baseStore', {
  state: () => ({
    baseData: {
      // 部門群組
      branchs: [{
        DeptId: "",
        DeptName: "",
        ResourcesId: ""
      }],
      persons: [] as UserInfo[]
    },
  }),
  actions: {
    // 向後端拿取部門資料
    async getBranchData(data: GetBranchsInfo) {
      await getBranch(data).then((response: BranchsInfo[]) => {
        this.baseData.branchs = response;
        console.log("store部門資料", this.baseData.branchs)
      })
    },
    // async getBranchData(data: GetBranchsInfo): Promise<AxiosResponse<Branchs[]>> {
    //   return await baseAPI.getBranch(data)
    // },
    // 取同部門全部人員資料
    async getPersonData(data: GetUserInfo) {
      await searchPerson(data).then((response: UserInfo[]) => {
        return response;
        // this.baseData.persons = response.data;
        // console.log("store同部門全部人員資料", this.baseData.persons)
      })

    },
  },
})
