<template>
  <div class="countersign-box">
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
// 引入store
import { baseStore } from '@/stores/baseStore'
const baseStoreConfig = baseStore()
const { baseStoreData } = storeToRefs(baseStoreConfig)

// 傳至父件
const emit = defineEmits(['handle-show-countersign-box', 'submit-countersign'])

const dataState = ref({
  showCountersignBox: 1,
  // 簽核完成將確認鈕 disabled
  disabledBtn: false,
  // 接api拿部門人員資料
  personOptions: [] as ResUserInfo[],
  // 被選中的會簽人員
  countersign: [] as SetCountersign[],
  countersignValue: [] as string[],
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