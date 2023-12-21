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
//建表人上傳附件
export function UploadFormData(data) {
    return request({
        url: '/UploadFormData',
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}
