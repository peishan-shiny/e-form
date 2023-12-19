import { defineStore } from 'pinia';
import baseAPI from '@/apis/baseAPI.js'

export const userStore = defineStore('userStore', {
	state: () => ({
		userData: null as UserInfo | null
	}),
	actions: {
		// 向後端拿取人員資料
		async getUserData(data: GetUserInfo) {
			await baseAPI.searchPerson(data).then((response: ResUserInfo) => {
				this.userData = response.data[0];
				console.log("store使用者資料", this.userData)
			})

		},
	},
})
