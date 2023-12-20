import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
// import qs from 'qs';

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 5000,
	headers: { 'Content-Type': 'application/json' },
	// paramsSerializer: {
	// 	serialize(params) {
	// 		return qs.stringify(params, { allowDots: true });
	// 	},
	// },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		// console.log("response",response)
		if (response.status !== 200) {
			return Promise.reject(service.interceptors.response);
		} else {
			return response.data;
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;
