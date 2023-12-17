import { defineStore } from 'pinia';
import baseAPI from '@/apis/baseAPI.js'

export const userStore = defineStore('userStore', {
	state:() => ({
		userData: {
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
		},
	}),
  actions: {
		// 向後端拿取人員資料
		async getUserData(data:GetUserInfo){
      await baseAPI.searchPerson(data).then((response:UserInfo)=>{
        this.userData = response.data[0];
        console.log("store",this.userData)
      })
			
		},
	},
})
