import { defineStore } from 'pinia';
import { resError } from '@/utils/base';
import { searchPerson } from '@/apis/baseAPI.js'

export const userStore = defineStore('userStore', {
	state: () => ({
		userData: null as ResUserInfo | null
	}),
	actions: {
		// 向後端拿取人員資料
		async getUserData(data: GetUserInfo) {
			await searchPerson(data).then((response: ResUserInfo[]) => {
				this.userData = response[0];
				// console.log("store使用者資料", this.userData)
			}).catch((error: any) => {
				console.log(error)
				resError("API拿取使用者資料錯誤" + error)
			})

		},
	},
})
