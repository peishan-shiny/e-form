<template>
  <!-- 簽核部分 -->
  <div class="sign-content">
    <div class="area-process">簽核流程</div>
    <table class="table-process">
      <tr class="table-title">
        <th class="title-order">順序</th>
        <th class="title-unit">簽核程序</th>
        <th class="title-personnel">簽核人員</th>
        <th class="title-signatureFile">簽名檔</th>
        <th class="title-status">簽核狀態</th>
        <th class="title-time">簽核時間</th>
        <th class="title-suggestion">意見</th>
        <th class="title-file noPrint">附件</th>
      </tr>
      <!-- 這邊簽核順序接api -->
      <tr class="table-row" v-for="item in signStoreData.signStep" :key="item.SIGNORDER">
        <td class="order-value">{{ item.SIGNORDER }}</td>
        <td class="unit-value">
          {{ item.STEPNAME }}
        </td>
        <td class="personnel-value">{{ item.SIGNERNAME }}</td>
        <td class="signatureFile-value">
          <img class="signPicture" :src="dataState.signPicture + item.SIGNER + '.png'" alt=""
            v-if="!(item.SIGNRESULT === 5 || item.SIGNRESULT === 0)" />
        </td>
        <td class="status-value">
          <label v-if="item.SIGNRESULT === 1">{{
            item.SIGNRESULT === 1 ? "同意" : "待簽核"
          }}</label>
          <label v-if="item.SIGNRESULT === 2">{{
            item.SIGNRESULT === 2 ? "不同意" : "待簽核"
          }}</label>
          <label v-if="item.SIGNRESULT === 4">{{
            item.SIGNRESULT === 4 ? "作廢" : " "
          }}</label>
        </td>
        <td class="time-value">
          <span v-if="!(item.SIGNRESULT === 5)">{{ item.SIGNTIME?.split('T')[0] }}</span>
        </td>
        <td class="suggestion-value">
          {{ !item.OPINION ? " " : item.OPINION }}
        </td>
        <td class="file-value noPrint">
          <div class="signFile-list" v-for="fileItem in signStoreData.signFile" :key="fileItem.FileName">
            <a class="downloadURLSign" v-if="fileItem.SIGNORDER == item.SIGNORDER"
              @click="downloadFile(fileItem.FilePath)">{{ fileItem.FileName }}
              <button class="common">下載附件</button></a>
          </div>
        </td>
      </tr>
    </table>
    <div class="area-process" v-if="signStoreData.executorStep?.length > 0">會辦人員</div>
    <table class="table-process" v-if="signStoreData.executorStep?.length > 0">
      <tr class="table-title">
        <th class="title-order">順序</th>
        <th class="title-unit">簽核程序</th>
        <th class="title-personnel">簽核人員</th>
        <th class="title-signatureFile">簽名檔</th>
        <th class="title-status">簽核狀態</th>
        <th class="title-time">簽核時間</th>
        <th class="title-suggestion">意見</th>
        <th class="title-file noPrint">附件</th>
      </tr>
      <!-- 這邊簽核順序接api -->
      <tr class="table-row" v-for="item in signStoreData.executorStep" :key="item.SIGNORDER">
        <td class="order-value">{{ item.SIGNORDER }}</td>
        <td class="unit-value">
          {{ item.STEPNAME }}
        </td>
        <td class="personnel-value">{{ item.SIGNERNAME }}</td>
        <td class="signatureFile-value">
          <img class="signPicture" :src="dataState.signPicture + item.SIGNER + '.png'" alt=""
            v-if="!(item.SIGNRESULT === 5 || item.SIGNRESULT === 0)" />
        </td>
        <td class="status-value">
          <label v-if="item.SIGNRESULT === 1">{{
            item.SIGNRESULT === 1 ? "同意" : "待簽核"
          }}</label>
          <label v-if="item.SIGNRESULT === 2">{{
            item.SIGNRESULT === 2 ? "不同意" : "待簽核"
          }}</label>
          <label v-if="item.SIGNRESULT === 4">{{
            item.SIGNRESULT === 4 ? "作廢" : " "
          }}</label>
        </td>
        <td class="time-value">
          <span v-if="!(item.SIGNRESULT === 5)">{{ item.SIGNTIME }}</span>
        </td>
        <td class="suggestion-value">
          {{ !item.OPINION ? " " : item.OPINION }}
        </td>
        <td class="file-value noPrint">
          <div class="signFile-list" v-for="fileItem in signStoreData.signFile" :key="fileItem.FileName">
            <a class="downloadURLSign" v-if="fileItem.SIGNORDER == item.SIGNORDER"
              @click="downloadFile(fileItem.FilePath)">{{ fileItem.FileName }}
              <button class="common">下載附件</button></a>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { downloadFile } from '@/utils/base';

// 引入store
import { signStore } from '@/stores/signStore'
const signStoreConfig = signStore()
const { signStoreData } = storeToRefs(signStoreConfig)

const dataState = ref({
  signPicture: "https://esys.orange-electronic.com/Image/SignerPicture/",
})
// created() { },
// computed: {
//   signStep() {
//     return this.$store.state.sign.signStep;
//   },
//   executorStep() {
//     return this.$store.state.sign.executorStep;
//   },
// }
</script>

<style lang="scss" scoped>
* {
  font-family: "微軟正黑體";
  box-sizing: border-box;
}

/* 簽核部分 */
.sign-content {
  overflow-x: scroll;

  .area-process {
    min-width: 850px;
    width: 100%;
    background-color: var(--sec-color);
    text-align: center;
    padding: 0.75rem 0;
  }

  .table-process {
    min-width: 850px;
    width: 100%;
    border-top: 0;
    border-bottom: 0;

    tr {
      text-align: center;

      th {
        padding: 0.75rem 0;
        border: 1px solid var(--gray-border);
      }

      .title-order,
      .title-file {
        width: 50px;
      }

      .title-unit,
      .title-personnel,
      .title-status {
        width: 100px;
      }

      .title-signatureFile,
      .title-time {
        width: 120px;
      }

      .title-suggestion {
        width: 450px;
      }

      td {
        border: 1px solid var(--gray-border);
        vertical-align: middle;
        padding: 0.75rem 0;
      }

      .file-value {
        .signFile-list {
          display: flex;
          flex-direction: column;

          .downloadURLSign {
            margin: 0.5rem 0;
          }
        }
      }
    }

    .table-title {
      background-color: var(--gray-background);
    }
  }
}

@media print {
  .noPrint {
    display: none;
  }
}
</style>