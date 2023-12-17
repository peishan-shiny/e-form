import { apiHelper } from '@/utils/helper'

export default {
    // 查詢人員
    searchPerson(data) {
        return apiHelper.post('/GetDeptEmp', data)
    },

    // 取得部門下拉式資料
    getBranch(data) {
        return apiHelper.post('/GetDept', data)
    },

    // 上傳附件
    uploadFile(data) {
        return apiHelper.post('/UploadFormData', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    // 查詢附件
    downloadFile(data) {
        return apiHelper.post('/GetWFP', data)
    },

    // 上傳簽核附件
    uploadSignFile(data) {
        return apiHelper.post('/UploadSignFormData', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    // 查詢簽核附件
    downloadSignFile(data) {
        return apiHelper.post('/GetSignWFP', data)
    },

    // 取得簽核順序
    getSignStep(formId) {
        return apiHelper.post(`/GetSignStep/${formId}`)
    },

    // 自訂簽核人員
    SignStepAdd(data) {
        return apiHelper.post('/SignStepAdd', data)
    },

    // 取得下一個簽核人員
    getSignStepNext(formId) {
        return apiHelper.post(`/GetSignStepNext/${formId}`)
    },

    // 確定簽核
    signStepUpdate(data) {
        return apiHelper.post('/SignStepupdate', data)
    },

    // 發信
    mailSend(data) {
        return apiHelper.post('/MailSend', data)
    },

    // 增加會簽人員
    CountersignAdd(data) {
        return apiHelper.post('/CountersignAdd', data)
    },

    // 更改簽核狀態
    RDAStatusUPDATE(data) {
        return apiHelper.post('', data)
    },

    // 簽核時密碼驗證
    login(data) {
        return apiHelper.post('/Login', data)
    },

    // 限制作廢人員，取GroupID
    GetEmpGroup(data) {
        return apiHelper.post('/GetEmpGroup', data)
    },

    // 從ERP取資料
    GetBom(data) {
        return apiHelper.post('/GetBom', data)
    },

    //取國家
    GetArea(data) {
        return apiHelper.post('/GetArea', data)
    }


}