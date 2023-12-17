<template>
  <div class="about">
    <h1>{{ userData.EmpName }}</h1>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { userStore } from '@/stores/userStore';
import { useRoute } from "vue-router"

//設定 路由query的方法
const data = useRoute();
data.query.Empid = "222010" 

const { query } = useRoute();
console.log(query)

// 取路由params的方法
// const { params }  = useRoute();
// console.log(data,params.id)




const userStoreConfig = userStore();
userStoreConfig.getUserData({
  DeptId: "", //部門代號
  EmpId: "222010", //工號
  Company: "" //公司
})

const { userData } = storeToRefs(userStoreConfig);

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
