import { apiHelper } from '@/utils/helper'

export default {

  // 取得 研發專案 列表
  GetProList(data) {
    return apiHelper.post('/GetProList', data)
  },

  // 取得 可行性評估表 列表
  GetOEMList(data) {
    return apiHelper.post('/GetOEMList', data)
  },

  // 取得 RX時程計畫表(A) 列表
  GetRXFList(data) {
    return apiHelper.post('/GetRXFList', data)
  },
  // 取得 RX時程計畫表(A) 細節
  GetRXFDList(data) {
    return apiHelper.post('/GetRXFDList', data)
  },
  // 取得 RX時程計畫表(A) - 實際時程
  GetRXAList(data) {
    return apiHelper.post('/GetRXAList', data)
  },

  // 取得 TX時程計畫表(A) 列表
  GetTXFList(data) {
    return apiHelper.post('/GetTXFList', data)
  },
  // 取得 TX時程計畫表(A) 細節
  GetTXFDList(data) {
    return apiHelper.post('/GetTXFDList', data)
  },

  // 取得 多功能小組成員表 列表
  GetOEAList(data) {
    return apiHelper.post('/GetOEAList', data)
  },

  // 取得 多功能小組成員表 細節
  GetOEADList(data) {
    return apiHelper.post('/GetOEADList', data)
  },

  // 取得 初期產品規格表
  GetOEBList(data) {
    return apiHelper.post('/GetOEBList', data)
  },
  // 取得 初期產品規格表 細節
  GetOEBDList(data) {
    return apiHelper.post('/GetOEBDList', data)
  },

  // 取得 初期製造流程圖
  GetOEDList(data) {
    return apiHelper.post('/GetOEDList', data)
  },

  // 取得 企劃審查會議查檢表
  GetOEEList(data) {
    return apiHelper.post('/GetOEEList', data)
  },

  // 取得 初期材料清單BOM
  GetOEFList(data) {
    return apiHelper.post('/GetOEFList', data)
  },

  // 取得 過程流程圖
  GetOEGList(data) {
    return apiHelper.post('/GetOEGList', data)
  },

  // 取得 防誤一覽表
  GetOEHList(data) {
    return apiHelper.post('/GetOEHList', data)
  },

  // 取得 B表
  GetOEIList(data) {
    return apiHelper.post('/GetOEIList', data)
  },

  // 取得 D表
  GetOEJList(data) {
    return apiHelper.post('/GetOEJList', data)
  },

  // 取得 DFMEA
  GetOEKList(data) {
    return apiHelper.post('/GetOEKList', data)
  },

  // 取得 C表
  GetOELList(data) {
    return apiHelper.post('/GetOELList', data)
  },

  // 取得 關鍵及特殊特性清單
  GetOENList(data) {
    return apiHelper.post('/GetOENList', data)
  },

  // 取得 產品規格表
  GetOEOList(data) {
    return apiHelper.post('/GetOEOList', data)
  },

  // 取得 狀態轉移圖+程式流程圖
  GetOEPList(data) {
    return apiHelper.post('/GetOEPList', data)
  },

  // 取得 全功能機能表
  GetOEQList(data) {
    return apiHelper.post('/GetOEQList', data)
  },

  // 取得 正式材料清單(BOM)
  GetOERList(data) {
    return apiHelper.post('/GetOERList', data)
  },

  // 取得 新產品開發提案評估表
  GetOAMList(data) {
    return apiHelper.post('/GetOAMList', data)
  },

  // 取得 產品包裝明細
  GetOESList(data) {
    return apiHelper.post('/GetOESList', data)
  },

  // 取得 管制計畫表
  GetOETList(data) {
    return apiHelper.post('/GetOETList', data)
  },

  // 取得 PFMEA
  GetOEUList(data) {
    return apiHelper.post('/GetOEUList', data)
  },
}