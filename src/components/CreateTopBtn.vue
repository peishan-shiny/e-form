<template>
  <div class="create-top">
    <!-- 按鈕 -->
    <div class="top-button">
      <button class="top-btn action" @click="$emit('callShowBox')" :disabled="formId !== ''">
        <img src="@/assets/white/電子表單icon_送簽.png" alt="" class="icon" />
        送簽表單
      </button>
      <button @click="($refs.fileDOM as any).click()" class="top-btn common">
        <input ref="fileDOM" @change="handleFileChange" type="file" multiple class="input-file" />
        <img src="@/assets/black/電子表單icon_附加檔案.png" alt="" class="icon" />
        附加文件
      </button>
      <button class="top-btn common" @click="$router.back()">
        <img src="@/assets/black/電子表單icon_返回.png" alt="" class="icon" />
        返回列表
      </button>
    </div>
    <!-- 第一區塊 -->
    <div class="top-content">
      <div class="area">
        <div class="area-row">
          <div class="area-title area-col-3">
            表單編號：
            <span></span>
          </div>
          <div class="area-title area-col-3">
            建立日期：
            <span>{{ dataState.today }}</span>
          </div>
          <div class="area-title area-col-3">
            簽核狀態：
            <span>未簽核</span>
          </div>
        </div>
        <div class="area-row">
          <div class="area-title area-col-3">
            公司別：
            <span>{{ userStoreData.ResourcesName }}</span>
          </div>
          <div class="area-title area-col-3">
            部門：
            <span>{{ userStoreData.DeptName }}</span>
          </div>
          <div class="area-title area-col-3">
            建檔人員：
            <span>{{ userStoreData.EmpName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Toast, createDate } from '@/utils/base';
import { userStore } from '@/stores/userStore';
import { baseStore } from '@/stores/baseStore';

const props = defineProps<{
  formId?: string
}>()
console.log("-formId", props.formId)

const userStoreConfig = userStore()
const { userStoreData } = storeToRefs(userStoreConfig);

const baseStoreConfig = baseStore()

const dataState = ref({
  // 建立日期
  today: "",
})

const fileDOM = ref(null)


onMounted(() => {
  dataState.value.today = createDate();
})

// 上傳附件顯示在網頁上
function handleFileChange(e: any) {
  const fileList = e.target.files;
  let fileSize = 0;
  for (let i = 0; i < fileList.length; i++) {
    fileSize = fileSize + fileList[i].size;
  }
  console.log("fileSize", fileSize);

  if (fileSize < 4000000) {
    baseStoreConfig.updateFile(fileList)
  } else {
    Toast.fire({
      icon: "warning",
      title: "檔案大小太大無法上傳！",
    });
  }
}

</script>

<style lang="scss" scoped>
* {
  font-family: "微軟正黑體";
  box-sizing: border-box;
}

.top-button {
  display: flex;

  .top-btn {
    display: flex;
    align-items: center;
    margin-right: 1rem;

    .input-file {
      display: none;
    }
  }
}

.icon {
  height: 24px;
}
</style>