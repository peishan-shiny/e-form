<template>
  <!-- 附加文件 -->
  <div class="area noPrint">
    <div class="area-row">
      <div class="area-title">附加文件：</div>
      <!-- 建立表單 -->
      <div class="file-list" v-if="model !== 'sign'">
        <p class="file" v-for="item in baseStoreData.file" :key="item.name">
          {{ item.name }}
          <el-icon>
            <DeleteFilled class="delete" @click="deleteFile(item.name)" />
          </el-icon>
        </p>
      </div>
      <!-- 簽核頁面 -->
      <div class="file-list" v-if="model === 'sign'">
        <a v-for="item in dataState.fileData" :key="item.FileName" class="downloadURL"
          @click="downloadFile(item.FilePath)">{{
            item.FileName }}
          <button class="common download-btn">下載附件</button></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type AxiosResponse } from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from "vue-router"
import { storeToRefs } from 'pinia';

import { resError, downloadFile } from '@/utils/base';
import { GetWFP } from '@/apis/baseAPI.js';
import { baseStore } from '@/stores/baseStore';

const baseStoreConfig = baseStore()
const { baseStoreData } = storeToRefs(baseStoreConfig);

const props = defineProps({
  model: { type: String, default: "create" },
  toFileCom: { type: String, default: "Form" }
})

const dataState = ref({
  // 建立日期
  fileData: [] as ResFile[],
})
onMounted(() => {
  if (props.model === "sign") {
    console.log("有進來拿file資料")
    const route = useRoute();
    fetchGetWFP(route.params.formId);
  }
})


// 刪除時commit刪除function
function deleteFile(clickItem: string) {
  baseStoreConfig.deleteFile(clickItem)
}

// 取原表單附件的資料
async function fetchGetWFP(formId: string | string[]) {
  await GetWFP({
    FileId: "", //附檔編號
    FileName: "", //附檔名稱
    FilePath: "", //附檔存放路徑
    WebName: props.toFileCom, //附檔所在網頁名稱
    WebID: formId, //附檔所在 對應表單表編號ID
    ExecID: "",
  }).then(async (response: AxiosResponse<ResFile[]>) => {
    dataState.value.fileData = response.data
    console.log("元件FileCom：", dataState.value.fileData);
  }).catch((error: any) => {
    console.log(error)
    resError("API取原表單附件發生錯誤" + error)
  })
}


</script>