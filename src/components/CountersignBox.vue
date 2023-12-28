<template>
  <div class="countersign-box">
    <LoadingGIF v-if="dataState.isLoading === true" />
    <!-- 會簽 彈跳視窗 -->
    <div class="countersign-modal" @click="cancelModal">
      <div class="box">
        <div class="box-title">會簽人員</div>
        <input class="display" type="text" v-model="dataState.countersignValue" disabled />
        <div class="box-content-Countersign">
          <ul class="branch-group">
            <!-- 接api拿部門資料，v-for跑 -->
            <li class="branch" v-for="branch in baseStoreData.branchs" :key="branch.DeptId">
              <input class="branchs" type="checkbox" :id="branch.DeptId" name="branchs" :value="branch.DeptName"
                @change="changePersons(branch.DeptId, branch.DeptName)" />

              <CaretRight style="width: 1em" />
              <label :for="branch.DeptId" class="branch-name">{{
                branch.DeptName
              }}</label>

              <ul class="person-group">
                <!-- 接api拿部門人員資料，v-for跑 -->
                <li class="person" v-for="person in dataState.personOptions" :key="person.EmpId">
                  <div>
                    <input type="checkbox" :id="person.EmpId" name="persons" :value="{
                      SIGNERNAME: person.EmpName,
                      SIGNER: person.EmpId,
                      order: person.Title[0] + person.Title[1],
                    }" v-model="dataState.countersign" />
                    <label :for="person.EmpId">{{ person.EmpName }}</label>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <button type="button" class="btn btn-black" @click="submitCountersign" :disabled="dataState.disabledBtn">
          確認
        </button>
        <button type="button" class="btn btn-red" @click="dataState.showCountersignBox = 0">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, ref, watch, defineEmits } from 'vue';
// 引入组件
const LoadingGIF = defineAsyncComponent(() => import('@/components/LoadingGIF.vue'));
// 引入store
import { baseStore } from '@/stores/baseStore'
const baseStoreConfig = baseStore()
const { baseStoreData } = storeToRefs(baseStoreConfig)

// 傳至父件
const emit = defineEmits(['handle-show-countersign-box', 'submit-countersign'])

const dataState = ref({
  // 送出表單的等待畫面
  isLoading: false,
  // 計數api有幾個在執行
  runningCount: 0,
  showCountersignBox: 1,
  // 簽核完成將確認鈕 disabled
  disabledBtn: false,
  // 接api拿部門人員資料
  personOptions: [] as ResUserInfo[],
  // 被選中的會簽人員
  countersign: [] as SetCountersign[],
  countersignValue: [] as string[],
})

// 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
watch(() => dataState.value.runningCount, (newValue) => {
  console.log("watch", newValue)
  dataState.value.isLoading = true;
  if (dataState.value.runningCount === 0) {
    dataState.value.isLoading = false;
  }
})

watch(() => dataState.value.showCountersignBox, (newValue) => {
  console.log("watch", newValue)
  emit("handle-show-countersign-box", dataState.value.showCountersignBox);
})

watch(() => dataState.value.countersign, (newValue) => {
  console.log("watch", newValue)
  dataState.value.countersignValue = [];
  for (let i = 0; i < newValue.length; i++) {
    dataState.value.countersignValue.push(newValue[i].SIGNERNAME);
  }
})

// 點黑底，取消modal
function cancelModal(event: any) {
  const modal = document.querySelector(".countersign-modal");
  if (event.target === modal) {
    dataState.value.showCountersignBox = 0;
  }
}

// 當部門資料改變 取人員資料
async function changePersons(DeptId: string, DeptName: string) {
  const nodes = document.querySelectorAll(".branchs");

  nodes.forEach((node: any) => {
    // 這裡可能需要根據你的實際情況來獲取每個元素的值，例如 node.value
    const nodeValue = node.value;

    // 使用 trim() 函數清除可能存在的空格
    if (nodeValue === DeptName) {
      node.checked = true;
    } else {
      node.checked = false;
    }

  });

  // 改變人員
  dataState.value.personOptions = baseStoreData.value.allPersons.filter(item => item.DeptId === DeptId)
}


function submitCountersign() {
  dataState.value.disabledBtn = true
  emit('submit-countersign', dataState.value.countersign)
}

// 簽核完成，取得 下一個簽核人員，發信通知使用
// async fetchNextSigner(formId) {
//   this.runningCount++;
//   await baseAPI
//     .getSignStepNext(formId)
//     .then(async (response) => {
//       this.nextSigner = {};
//       this.nextSigner = response.data[0];
//       console.log("下一個簽核人員", this.nextSigner);
//       this.runningCount--;

//       //發信給下一個簽核人員
//       if (this.nextSigner) {
//         await this.sendMail();
//       } else {
//         //如果沒有下一個簽核人員，代表簽核完成，接簽核狀態更新api
//         await this.finishSignStatus();
//       }
//     })
//     .catch((error) => {
//       console.log(error, "取得簽核人員發生錯誤！");
//       this.runningCount--;
//       Toast.fire({
//         icon: "warning",
//         title: "無法取得資料，請聯絡IT人員！",
//       });
//     });
// },
// 接發信api
// async sendMail() {
//   this.runningCount++;
//   await baseAPI
//     .mailSend({
//       Empid: this.nextSigner.SIGNER, //TODO:工號，先代自己工號，上架改成下一個簽核人員工號 this.nextSigner.SIGNER
//       Sub: `簽核通知：${this.formAllData.formName}，表單號碼：${this.formId}`, //主旨
//       Messg: `
//       請協助進行表單號碼：${this.formId} 簽核作業！
//       可點選網址查看，https://esys.orange-electronic.com/Eform/List`, //內文 上架更改內容
//     })
//     .then((response) => {
//       console.log("發信", response);
//       this.runningCount--;
//     })
//     .catch((error) => {
//       console.log("發信-error", error);
//       this.runningCount--;
//     });
// },
// 成功 彈跳視窗，並轉跳至待簽核表單
// signSuccess() {
//   const Swal = require("sweetalert2");
//   Swal.fire({
//     title: "成功送出",
//     confirmButtonColor: "#333",
//     confirmButtonText: "確認",
//   }).then((resule) => {
//     console.log(resule);
//     if (resule.value) {
//       // TODO:上線下面這行打開，第2行註解
//       window.top.location = "https://esys.orange-electronic.com/Eform/List";
//       // this.$router.push(`${this.formAllData.routeList}`);
//     }
//   });
// },
</script>

<style lang="scss" scoped>
.countersign-modal {
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

    .display {
      margin: 1rem 0;
    }

    .box-content-Countersign {
      max-height: 50vh;
      overflow-y: auto;

      .branch-group {
        .branch {
          margin: 1rem 0;

          .branchs {
            visibility: hidden;
            position: absolute;

            &:checked~.arrow {
              transform: rotate(90deg);
            }

            &:checked~.person-group {
              display: block;
              transform: scale(1, 1);
            }
          }

          .branch-name {
            cursor: pointer;
          }

          .person-group {
            display: none;
            transform: scale(0, 0);

            .person {
              margin: 1rem 0;
              margin-left: 1rem;
            }
          }
        }
      }
    }
  }
}
</style>