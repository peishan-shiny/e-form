<template>
  <div class="countersign-box">
    <LoadingGIF v-if="isLoading === true" />
    <!-- 會簽 彈跳視窗 -->
    <div class="countersign-modal" @click="cancelModal">
      <div class="box">
        <div class="box-title">會簽人員</div>
        <input class="display" type="text" v-model="countersignValue" disabled />
        <div class="box-content-Countersign">
          <ul class="branch-group">
            <!-- 接api拿部門資料，v-for跑 -->
            <li class="branch" v-for="branch in branchs" :key="branch.DeptId">
              <input class="branchs" type="checkbox" :id="branch.DeptId" name="branchs" :value="branch.DeptName"
                @change="changePersons(branch.DeptId, branch.DeptName)" />
              <i class="el-icon-caret-right arrow"></i>
              <label :for="branch.DeptId" class="branch-name">{{
                branch.DeptName
              }}</label>

              <ul class="person-group">
                <!-- 接api拿部門人員資料，v-for跑 -->
                <li class="person" v-for="person in personOptions" :key="person.EmpId">
                  <div>
                    <input type="checkbox" :id="person.EmpId" name="persons" :value="{
                      SIGNERNAME: person.EmpName,
                      SIGNER: person.EmpId,
                      order: person.Title[0] + person.Title[1],
                    }" v-model="countersign" />
                    <label :for="person.EmpId">{{ person.EmpName }}</label>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <button type="button" class="btn btn-black" @click="submitCountersign" :disabled="disabledBtn">
          確認
        </button>
        <button type="button" class="btn btn-red" @click="showCountersignBox = 0">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import baseAPI from "@/apis/baseAPI";
import { Toast } from "@/utils/helper";
import LoadingGIF from "@/components/LoadingGIF.vue";
export default {
  name: "CountersignBox",
  components: {
    LoadingGIF,
  },
  props: {
    formAllData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // 送出表單的等待畫面
      isLoading: false,
      // 計數api有幾個在執行
      runningCount: 0,
      showCountersignBox: 1,
      // 簽核完成將確認鈕 disabled
      disabledBtn: false,
      // 接api拿部門人員資料
      personOptions: [],
      // 被選中的會簽人員
      countersign: [],
      countersignValue: [],
      // 表單號碼
      formId: "",
      // 簽核完，取下一個簽核人員
      nextSigner: {},
    };
  },
  created() {
    const { formId } = this.$route.params;
    this.formId = formId;
  },
  computed: {
    branchs() {
      return this.$store.state.base.branchs;
    },
    signer() {
      return this.$store.state.sign.signer;
    },
  },
  watch: {
    showCountersignBox: {
      handler: function () {
        this.$emit("handle-show-countersign-box", this.showCountersignBox);
      },
    },
    countersign: {
      handler: function (n, o) {
        console.log(n, o);
        this.countersignValue = [];
        for (let i = 0; i < n.length; i++) {
          this.countersignValue.push(n[i].SIGNERNAME);
        }
      },
    },
    // 監聽計數，看裡面是否還有api再執行，若沒有將this.isLoading 改 false;
    runningCount: {
      handler: function () {
        if (this.runningCount === 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
        }
      },
    },
  },
  methods: {
    // 當部門資料改變 取人員資料
    async changePersons(DeptId, DeptName) {
      const node = document.querySelectorAll(".branchs");
      // console.log("會簽事件", node);
      for (let i = 0; i < node.length; i++) {
        if (node[i].value === DeptName) {
          node[i].checked = true;
        } else {
          node[i].checked = false;
        }
      }

      await this.$store.dispatch("base/fetchPersonData", DeptId);
      this.personOptions = this.$store.state.base.persons;
    },
    // 點黑底，取消modal
    cancelModal(event) {
      const modal = document.querySelector(".countersign-modal");
      if (event.target === modal) {
        this.showCountersignBox = 0;
      }
    },
    // 送出 會簽人員
    async submitCountersign() {
      try {
        // 先排序
        this.countersign.sort(function (a, b) {
          return a.order - b.order
        })
        console.log("排序後", this.countersign)
        // 再上傳
        if (this.countersign.length > 0) {
          this.runningCount++;
          this.countersign.forEach((item) => {
            item.FORMNO = this.formId;
            item.SIGNORDER = this.signer.SIGNORDER;
            item.STEPNAME = "會簽";
            item.SignGroup = "簽核";
          });
          baseAPI
            .CountersignAdd(this.countersign)
            .then(async (response) => {
              console.log("新增會簽人員", response);
              if (response.data === "更新完成") {
                this.disabledBtn = true;
                this.$emit("deliver-disabled-btn", true);
              }

              // 如果會簽有人，取得下一個簽核人員，發信通知用
              if (this.countersignValue.length > 0) {
                await this.fetchNextSigner(this.formId);
              }
            })
            .then(() => {
              this.runningCount--;
              // 跳出成功訊息
              this.signSuccess();
            })
            .catch((error) => {
              this.runningCount--;
              Toast.fire({
                icon: "error",
                title: "上傳失敗請再試一次",
              });
              console.log(error);
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 簽核完成，取得 下一個簽核人員，發信通知使用
    async fetchNextSigner(formId) {
      this.runningCount++;
      await baseAPI
        .getSignStepNext(formId)
        .then(async (response) => {
          this.nextSigner = {};
          this.nextSigner = response.data[0];
          console.log("下一個簽核人員", this.nextSigner);
          this.runningCount--;

          //發信給下一個簽核人員
          if (this.nextSigner) {
            await this.sendMail();
          } else {
            //如果沒有下一個簽核人員，代表簽核完成，接簽核狀態更新api
            await this.finishSignStatus();
          }
        })
        .catch((error) => {
          console.log(error, "取得簽核人員發生錯誤！");
          this.runningCount--;
          Toast.fire({
            icon: "warning",
            title: "無法取得資料，請聯絡IT人員！",
          });
        });
    },
    // 接發信api
    async sendMail() {
      this.runningCount++;
      await baseAPI
        .mailSend({
          Empid: this.nextSigner.SIGNER, //TODO:工號，先代自己工號，上架改成下一個簽核人員工號 this.nextSigner.SIGNER
          Sub: `簽核通知：${this.formAllData.formName}，表單號碼：${this.formId}`, //主旨
          Messg: `
          請協助進行表單號碼：${this.formId} 簽核作業！
          可點選網址查看，https://esys.orange-electronic.com/Eform/List`, //內文 上架更改內容
        })
        .then((response) => {
          console.log("發信", response);
          this.runningCount--;
        })
        .catch((error) => {
          console.log("發信-error", error);
          this.runningCount--;
        });
    },
    // 成功 彈跳視窗，並轉跳至待簽核表單
    signSuccess() {
      const Swal = require("sweetalert2");
      Swal.fire({
        title: "成功送出",
        confirmButtonColor: "#333",
        confirmButtonText: "確認",
      }).then((resule) => {
        console.log(resule);
        if (resule.value) {
          // TODO:上線下面這行打開，第2行註解
          window.top.location = "https://esys.orange-electronic.com/Eform/List";
          // this.$router.push(`${this.formAllData.routeList}`);
        }
      });
    },
  },
};
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