import { type AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { resError } from '@/utils/base';
import { GetSignStepNext, MailSend } from '@/apis/baseAPI.js';

export const createStore = defineStore('createStore', {
  state: () => ({
    createStoreData: {
      // 下一個簽核人員
      nextSigner: {} as ResSigner,
    },
  }),
  actions: {
    // create頁面-取簽核人員，發信使用
    async fetchNextSigner(inputData: any) {
      await GetSignStepNext(inputData.formId).then(async (response: AxiosResponse<ResSigner[]>) => {
        this.createStoreData.nextSigner = response.data[0]
        console.log("createStore 取到簽核人員：", this.createStoreData.nextSigner);
      }).catch((error: any) => {
        console.log(error)
        resError("API取簽核人員發生錯誤" + error)
      })
    },
    // create頁面-發信通知
    async sendMail(inputData: any) {
      await MailSend({
        Empid: "222010", //TODO:工號，先代自己工號，上線改成下一個簽核人員工號 this.createStoreData.nextSigner.SIGNER
        Sub: `簽核通知：${inputData.formName}，表單號碼：${inputData.formId}`, //主旨
        Messg: `
          請協助進行表單號碼：${inputData.formId} 簽核作業！
          可點選網址查看，https://esys.orange-electronic.com/Eform/List`, //內文 上架更改內容
      }).then((response: any) => {
        console.log("完成發信", response);
      }).catch((error: any) => {
        console.log(error)
        resError("API發信發生錯誤" + error)
      })
    },
  },
})
