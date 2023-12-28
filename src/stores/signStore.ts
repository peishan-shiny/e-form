import { type AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { resError } from '@/utils/base';
import { GetSignStepNext, GetSignStep, GetSignWFP } from '@/apis/baseAPI.js';

export const signStore = defineStore('signStore', {
  state: () => ({
    signStoreData: {
      // 簽核人員
      signer: {} as ResSigner,
      // 簽核人員
      signStep: [] as ResSigner[],
      // 會辦人員
      executorStep: [] as ResSigner[],
      // 全部簽核人員(製表/簽核/會辦/核准/會簽)
      allSign: [] as ResSigner[],
      // 簽核附件
      signFile: [] as ResSignFile[]
    },
  }),
  actions: {
    // 取簽核人員
    async fetchSigner(inputData: any) {
      await GetSignStepNext(inputData.formId).then(async (response: AxiosResponse<ResSigner[]>) => {
        this.signStoreData.signer = response.data[0]
        console.log("signStore 取到簽核人員：", this.signStoreData.signer);
      }).catch((error: any) => {
        console.log(error)
        resError("API取簽核人員發生錯誤")
      })
    },
    // 取簽核順序
    async fetchSignStep(inputData: any) {
      await GetSignStep(inputData.formId).then(async (response: AxiosResponse<ResSigner[]>) => {
        this.signStoreData.allSign = response.data
        console.log("signStore 取到簽核順序：", this.signStoreData.allSign);
        this.sortSignStep()
        await this.fetchGetSignWFP(inputData)
      }).catch((error: any) => {
        console.log(error)
        resError("API取簽核順序發生錯誤")
      })
    },
    // 取簽核附件
    async fetchGetSignWFP(inputData: any) {
      await GetSignWFP({
        FileId: "", //附檔編號
        FileName: "", //附檔名稱
        FilePath: "", //附檔存放路徑 //ReportFile
        WebName: inputData.webNameSign, //附檔所在網頁名稱
        WebID: inputData.formId, //附檔所在 對應表單表編號ID
        ExecID: "",
        SIGNORDER: "",//簽核順序
      }).then(async (response: AxiosResponse<ResSignFile[]>) => {
        this.signStoreData.signFile = response.data
        console.log("signStore 簽核附件：", this.signStoreData.signFile);
      }).catch((error: any) => {
        console.log(error)
        resError("API取簽核附件發生錯誤")
      })
    },
    // 排列簽核順序
    sortSignStep() {
      const arr = this.signStoreData.allSign
      // 退簽的位址
      const returnSignIndex = [] as number[]
      arr.forEach((item, index) => {
        // 判斷是否有退簽的人，SIGNRESULT === 2(不同意)
        if (item.SIGNRESULT === 2) {
          returnSignIndex.push(index)
        }
      })

      // 保留第一個SIGNRESULT為2，將後面人員的SIGNRESULT/OPINION取出做修改
      if (returnSignIndex.length > 0) {
        console.log("有進入更改");
        for (let i = returnSignIndex[0] + 1; i < arr.length; i++) {
          arr[i].SIGNRESULT = 5
          arr[i].OPINION = ""
        }
      }

      // 取簽核人員
      this.signStoreData.signStep = [...arr].filter(
        (item) => item.SignGroup === "簽核" || item.SignGroup === "作廢"
      );
      console.log("簽核順序store", this.signStoreData.signStep);

      // 取會辦人員
      this.signStoreData.executorStep = [...arr].filter(
        (item) => item.SignGroup === "會辦"
      );
      console.log("會辦順序store", this.signStoreData.executorStep);

      // 排除會簽人員 列印時使用
      // this.signStoreData.printSign = arr.reverse().filter(
      //   (item) => item.STEPNAME !== "會簽" && item.SignGroup !== "作廢"
      // );
      // console.log("顯示列印時的簽核人員store", this.signStoreData.printSign);


    }
  },
})
