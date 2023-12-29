<template>
  <div class="sign-box">
    <!-- 簽核 彈跳視窗 -->
    <div class="sign-modal" @click="cancelModal">
      <div class="box">
        <div class="box-title">表單作廢</div>
        <!-- <div class="box-info">
          <p class="box-info-text">● 簽核選擇不同意，請填寫簽核意見！</p>
          <p class="box-info-text">
            ● If you do not agree,please fill in the opintion!
          </p>
        </div> -->
        <div class="box-content">
          <div class="box-row">
            <div class="box-content-text">簽核決定</div>
            <div class="box-content-item">
              <el-radio-group v-model="dataState.signModalData.radio">
                <!-- <el-radio :label="1" disabled></el-radio>
                <br /> -->
                <el-radio :label="2">作廢</el-radio>
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
            <div class="box-content-text opinion">作廢原因</div>
            <div class="box-content-item">
              <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="dataState.signModalData.opinion">
              </el-input>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-black" @click="confirmPassword" :disabled="dataState.disabledBtn">
          確認
        </button>
        <button type="button" class="btn btn-red" @click="dataState.showVoidBox = 0">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch, defineEmits } from 'vue';
import { resError, Toast, } from '@/utils/base';
import { Login } from '@/apis/baseAPI.js'
// 引入store
import {userStore} from '@/stores/userStore';
const userStoreConfig = userStore()
const {userStoreData} = storeToRefs(userStoreConfig)

const emit = defineEmits(['handle-show-void-box', 'submit-void'])

const dataState = ref({
      showVoidBox: 1,
      // 簽核完成將確認鈕 disabled
      disabledBtn: false,
      // 簽核彈跳窗的資料
      signModalData: {
        radio:2,
        password: "",
        opinion: "",
      },
    })

watch(() => dataState.value.showVoidBox, (newValue) => {
  console.log("watch", newValue)
  emit("handle-show-void-box", dataState.value.showVoidBox);
})

// 點黑底，取消modal
function cancelModal(event:any) {
  const modal = document.querySelector(".sign-modal");
  if (event.target === modal) {
    dataState.value.showVoidBox = 0;
  }
}

// 驗證 密碼
async function confirmPassword() {
  dataState.value.disabledBtn = true
  if (dataState.value.signModalData.password && dataState.value.signModalData.opinion && dataState.value.signModalData.radio) {
    await Login({
        acc: "222010", //TODO:工號，先代自己工號，上架改成"使用者"非簽核人員工號 userStoreData.value.EmpId
        Pwd: dataState.value.signModalData.password, //密碼
      })
      .then((response:any) => {
        if (response.data === "密碼通過") {
          emit('submit-void', dataState.value.signModalData)
        }
      })
      .catch((error:any) => {
        dataState.value.disabledBtn = false
        console.log(error)
        resError("密碼錯誤")
      });
  } else {
    dataState.value.disabledBtn = false
    Toast.fire({
      icon: "warning",
      title: "請填寫密碼及作廢原因！",
    });
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