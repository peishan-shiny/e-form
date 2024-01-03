<template>
  <div class="sign-box">
    <LoadingGIF v-if="dataState.isLoading === true" />
    <!-- 簽核 彈跳視窗 -->
    <div class="sign-modal" @click="cancelModal">
      <div class="box">
        <div class="box-title">表單簽核</div>
        <div class="box-info">
          <p class="box-info-text">● 簽核選擇不同意，請填寫簽核意見！</p>
          <p class="box-info-text">
            ● If you do not agree,please fill in the opintion!
          </p>
        </div>
        <div class="box-content">
          <div class="box-row">
            <div class="box-content-text">簽核決定</div>
            <div class="box-content-item">
              <el-radio-group v-model="dataState.signModalData.radio">
                <el-radio :label="1">同意</el-radio>
                <br />
                <el-radio :label="2">不同意，請填寫意見</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="box-row">
            <div class="box-content-text">簽核密碼</div>
            <div class="box-content-item">
              <el-input type="password" v-model="dataState.signModalData.password" required></el-input>
            </div>
          </div>
          <div class="box-row">
            <div class="box-content-text opinion">簽核意見</div>
            <div class="box-content-item">
              <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="dataState.signModalData.opinion">
              </el-input>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-black" @click="confirmChoice" :disabled="dataState.disabledBtn">
          確認
        </button>
        <button type="button" class="btn btn-red" @click="dataState.showSignBox = 0">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, ref, watch, defineEmits } from 'vue';
import { resError, Toast, } from '@/utils/base';
import { Login } from '@/apis/baseAPI.js'

// 引入组件
const LoadingGIF = defineAsyncComponent(() => import('@/components/LoadingGIF.vue'));
// 引入store
import { signStore } from '@/stores/signStore'
const signStoreConfig = signStore()
const { signStoreData } = storeToRefs(signStoreConfig)
// 傳至父件
const emit = defineEmits(['handle-show-sign-box', 'submit-sign'])

const dataState = ref({
  // 送出表單的等待畫面
  isLoading: false,
  // 計數api有幾個在執行
  runningCount: 0,
  showSignBox: 1,
  // 簽核完成將確認鈕 disabled
  disabledBtn: false,
  // 簽核彈跳窗的資料
  signModalData: {
    radio: 1,
    password: "",
    opinion: "",
  },

})

// 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
watch(() => dataState.value.runningCount, (newValue) => {
  console.log("watch", newValue)
  dataState.value.isLoading = true;
  if (dataState.value.runningCount === 0) {
    dataState.value.isLoading = false;
  }
})

watch(() => dataState.value.showSignBox, (newValue) => {
  console.log("watch", newValue)
  emit("handle-show-sign-box", dataState.value.showSignBox);
})
// 驗證欄位
function confirmChoice() {
  dataState.value.disabledBtn = true
  if (dataState.value.signModalData.password) {
    if (dataState.value.signModalData.radio === 1) {
      confirmPassword()
    } else if (dataState.value.signModalData.radio === 2 && dataState.value.signModalData.opinion !== "") {
      confirmPassword()
    } else {
      dataState.value.disabledBtn = false
      Toast.fire({
        icon: "warning",
        title: "若不同意請填寫意見",
      });
    }
  } else {
    dataState.value.disabledBtn = false
    Toast.fire({
      icon: "warning",
      title: "請填寫密碼！",
    });
  }
}

// 驗證 密碼
async function confirmPassword() {
  dataState.value.runningCount++;
  await Login({
    acc: signStoreData.value.signer.SIGNER, //TODO:工號，先代自己工號，上架改成下一個簽核人員工號 signStoreData.value.signer.SIGNER
    Pwd: dataState.value.signModalData.password, //密碼
  })
    .then((response: any) => {
      if (response.data === "密碼通過") {
        emit('submit-sign', dataState.value.signModalData)
        dataState.value.runningCount--;
      }
    })
    .catch((error: any) => {
      dataState.value.disabledBtn = false
      dataState.value.runningCount--;
      console.log(error)
      resError("密碼錯誤")
    })

}

// 點黑底，取消modal
function cancelModal(event: any) {
  const modal = document.querySelector(".sign-modal");
  if (event.target === modal) {
    dataState.value.showSignBox = 0;
  }
}

</script>

<style lang="scss" scoped>
* {
  font-family: "微軟正黑體";
}

.el-radio {
  padding: 0.25rem;
}

.btn {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}

/* 彈跳窗 */
.sign-modal {
  position: fixed;
  /* 固定定位 */
  z-index: 100;
  /* 设置在顶层 */
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);

  .box {
    width: 25%;
    min-width: 400px;
    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    background-color: var(--white);
    border: 1px solid var(--white);
    border-radius: 0.5rem;
    padding: 1rem;

    .box-title {
      text-align: center;
      background-color: var(--sec-color);
      padding: 0.5rem;
    }

    .box-info {
      background-color: #ffdac7;
      padding: 0.5rem;

      .box-info-text {
        font-size: 13px;
        padding: 0.25rem;
      }
    }

    .box-content {
      border: 1px solid var(--gray-border);

      .box-row {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--gray-border);

        .box-content-text {
          background-color: var(--gray-border);
          padding: 2rem 0.5rem;
          white-space: nowrap;
        }

        .box-content-item {
          padding: 0.5rem;
          width: 100%;
        }

        .opinion {
          padding: 4rem 0.5rem;
        }
      }
    }
  }
}

@media screen and (max-width: 912px) {
  .sign-modal {
    .box {
      width: 75%;
      min-width: 300px;

      .box-content {
        width: 100%;
        border: 1px solid var(--gray-border);

        .box-row {
          all: unset;
          display: flex;
          flex-direction: column;

          .box-content-text {
            all: unset;
            background-color: var(--gray-border);
            padding: 0.5rem 0.5rem;
          }

          .box-content-item {
            padding: 0.5rem;
          }

          .opinion {
            all: unset;
            background-color: var(--gray-border);
            padding: 0.5rem 0.5rem;
          }
        }
      }
    }
  }
}
</style>