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
      <!-- <div class="file-list" v-if="model === 'sign'">
        <a v-for="item in fileData" :key="item.FileName" class="downloadURL" @click="downloadFile(item.FilePath)">{{
          item.FileName }}
          <button class="common download-btn">下載附件</button></a>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
// import baseAPI from "@/apis/baseAPI";
import { baseStore } from '@/stores/baseStore';

const baseStoreConfig = baseStore()
const { baseStoreData } = storeToRefs(baseStoreConfig);

const props = defineProps({
  model: { type: String, default: "create" },
  toFileCom: { type: String, default: "Form" }
})

const dataState = ref({
  // 建立日期
  fileData: [],
})

// 刪除時commit刪除function
function deleteFile(clickItem: string) {
  baseStoreConfig.deleteFile(clickItem)
}

// 拿取原表單附件的資料
// async function fetchFile(formId) {
//   try {
//     const response = await baseAPI.downloadFile({
//       FileId: "", //附檔編號
//       FileName: "", //附檔名稱
//       FilePath: "", //附檔存放路徑
//       WebName: props.toFileCom, //附檔所在網頁名稱
//       WebID: formId, //附檔所在 對應表單表編號ID
//       ExecID: "",
//     });
//     this.fileData = response.data;
//     console.log("拿取原附件", this.fileData);

//     // 優化原附件的檔名顯示
//   } catch (error) {
//     console.log(error);
//     Toast.fire({
//       icon: "warning",
//       title: "無法取得附件資料，請聯絡IT人員！",
//     });
//   }
// }
// 下載功能，拿取表單的附件
// function downloadFile(filePath) {
//   window.open(
//     baseURLAPI + "/Download?file=" + filePath
//   );
// }

</script>