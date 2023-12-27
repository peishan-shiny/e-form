// import { ref } from 'vue';
import { type AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { resError } from '@/utils/base';
import { searchPerson } from '@/apis/baseAPI.js'

export const userStore = defineStore('userStore', {
	state: () => ({
		userStoreData: {
			DeptId: "",
			DeptName: "",
			DeptName_E: "",
			EmpId: "",
			EmpName: "",
			ResourcesId: "",
			ResourcesName: "",
			ResourcesName_E: "",
			Compose: "",
			FullName: "",
			Title: "",
			Language: "",
			Email: "",
			type: ""
		}
	}),
	actions: {
		// 向後端拿取人員資料
		async getUserData(data: GetUserInfo) {
			await searchPerson(data).then((response: AxiosResponse<ResUserInfo[]>) => {
				this.userStoreData = response.data[0];
				console.log("store使用者資料", this.userStoreData)
			}).catch((error: any) => {
				console.log(error)
				resError("API拿取使用者資料錯誤" + error)
			})

		},
	},
})
