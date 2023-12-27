import request from '@/utils/request';

// 查詢人員
export function searchPerson(data) {
    return request({
        url: '/GetDeptEmp',
        method: 'post',
        data,
    });
}
//查詢部門
export function getBranch(data) {
    return request({
        url: '/GetDept',
        method: 'post',
        data,
    });
}
//查詢群組
export function GetEmpGroup(data) {
    return request({
        url: '/GetEmpGroup',
        method: 'post',
        data,
    });
}
//原表單上傳附件
export function UploadFormData(data) {
    return request({
        url: '/UploadFormData',
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

//取原表單附件
export function GetWFP(data) {
    return request({
        url: '/GetWFP',
        method: 'post',
        data
    });
}

// 上傳簽核附件
export function UploadSignFormData(data) {
    return request({
        url: '/UploadSignFormData',
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

//取簽核人附件
export function GetSignWFP(data) {
    return request({
        url: '/GetSignWFP',
        method: 'post',
        data
    });
}

// 取簽核順序
export function GetSignStep(formId) {
    return request({
        url: `/GetSignStep/${formId}`,
        method: 'post',
    });
}

// 取得下一個簽核人員
export function GetSignStepNext(formId) {
    return request({
        url: `/GetSignStepNext/${formId}`,
        method: 'post',
    });
}

// 發信
export function MailSend(data) {
    return request({
        url: '/MailSend',
        method: 'post',
        data,
    });
}

// 取ModelNO
export function GetElno(number) {
    return request({
        url: `/GetElno/${number}`,
        method: 'post',
    });
}

// 簽核時密碼驗證
export function Login(data) {
    return request({
        url: `/Login`,
        method: 'post',
        data,
    });
}

// 確定簽核
export function SignStepupdate(data) {
    return request({
        url: `/SignStepupdate`,
        method: 'post',
        data,
    });
}
