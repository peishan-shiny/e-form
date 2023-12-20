import request from '@/utils/request';

export function searchPerson(data) {
    return request({
        url: '/GetDeptEmp',
        method: 'post',
        data,
    });
}

export function getBranch(data) {
    return request({
        url: '/GetDept',
        method: 'post',
        data,
    });
}

export function GetEmpGroup(data) {
    return request({
        url: '/GetEmpGroup',
        method: 'post',
        data,
    });
}
