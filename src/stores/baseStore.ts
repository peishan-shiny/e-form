import { type AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { resError } from '@/utils/base';
import { searchPerson, getBranch } from '@/apis/baseAPI.js';

export const baseStore = defineStore('baseStore', {
  state: () => ({
    baseStoreData: {
      // 部門群組
      branchs: [{
        DeptId: "",
        DeptName: "",
        ResourcesId: ""
      }],
      // 全公司人員
      allPersons: [] as ResUserInfo[],
      // 上傳的file
      file: [] as any[]
    },
  }),
  actions: {
    // 向後端拿取部門資料
    async getBranchData(data: GetBranchsInfo) {
      await getBranch(data).then((response: AxiosResponse<ResBranchsInfo[]>) => {
        this.baseStoreData.branchs = response.data;
        // console.log("store部門資料", this.baseStoreData.branchs)
      }).catch((error: any) => {
        console.log(error)
        resError("API拿取部門資料錯誤" + error)
      })
    },
    // 取全公司人員資料
    async getPersonData(data: GetUserInfo) {
      await searchPerson(data).then((response: AxiosResponse<ResUserInfo[]>) => {
        this.baseStoreData.allPersons = response.data;
        // console.log("store全公司人員資料", this.baseStoreData.allPersons)
      }).catch((error: any) => {
        console.log(error)
        resError("API拿取人員資料錯誤" + error)
      })
    },
    // 修改 file
    updateFile(data: any) {
      // console.log("typeof", typeof data)
      this.baseStoreData.file.push(...Object.values(data))
      console.log("baseStore updateFile：", this.baseStoreData.file)
    },
    // 刪除 file - 刪除上傳的檔案
    deleteFile(clickItem: string) {
      // console.log("clickItem", clickItem)
      this.baseStoreData.file = this.baseStoreData.file.filter((item) => item.name !== clickItem);
      console.log("刪除後剩下的檔案", this.baseStoreData.file);
    },
    // 清空 file
    clearFile() {
      this.baseStoreData.file = []
      console.log("已清除file", this.baseStoreData.file);
    },
  },
})
