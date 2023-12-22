<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <el-backtop :right="50" :bottom="80">
    <img src="@/assets/black/電子表單icon_返回頂端.png" style="height: 50px;
        width: 50px;">
  </el-backtop>
  <RouterView />
</template>
