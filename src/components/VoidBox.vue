<template>
  <div class="sign-box">
    <LoadingGIF v-if="isLoading === true" />
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
              <el-radio-group v-model="signModalData.radio">
                <!-- <el-radio :label="1" disabled></el-radio>
                <br /> -->
                <el-radio :label="2">作廢</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="box-row">
            <div class="box-content-text">簽核密碼</div>
            <div class="box-content-item">
              <el-input type="password" v-model="signModalData.password" required></el-input>
            </div>
          </div>
          <div class="box-row">
            <div class="box-content-text opinion">作廢原因</div>
            <div class="box-content-item">
              <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="signModalData.opinion">
              </el-input>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-black" @click="confirmPassword" :disabled="disabledBtn">
          確認
        </button>
        <button type="button" class="btn btn-red" @click="showVoidBox = 0">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import addFormAPI from "@/apis/addFormAPI";
import baseAPI from "@/apis/baseAPI";
import { Toast } from "@/utils/helper";
import LoadingGIF from "@/components/LoadingGIF.vue";
export default {
  name: "VoidBox",
  components: {
    LoadingGIF,
  },
  props: {
    formContent: {
      type: Object,
      required: true,
    },
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
      showVoidBox: 1,
      // 簽核完成將確認鈕 disabled
      disabledBtn: false,
      // 簽核彈跳窗的資料
      signModalData: {
        radio: 1,
        password: "",
        opinion: "",
      },
      // 表單號碼
      formId: "",
      // 重取全部簽核人員
      all: []
    };
  },
  created() {
    const { formId } = this.$route.params;
    this.formId = formId;
  },
  computed: {
    userData() {
      return this.$store.state.base.userData;
    },
    signer() {
      return this.$store.state.sign.signer;
    },
  },
  watch: {
    showVoidBox: {
      handler: function () {
        this.$emit("handle-show-void-box", this.showVoidBox);
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
    // 點黑底，取消modal
    cancelModal(event) {
      const modal = document.querySelector(".sign-modal");
      if (event.target === modal) {
        this.showVoidBox = 0;
      }
    },
    // 驗證 密碼
    async confirmPassword() {
      if (this.signModalData.password && this.signModalData.opinion) {
        await baseAPI
          .login({
            acc: this.userData.EmpId, //TODO:工號，先代自己工號，上架改成"使用者"非簽核人員工號 this.userData.EmpId
            Pwd: this.signModalData.password, //密碼
          })
          .then((response) => {
            if (response.data === "密碼通過") {
              this.uploadSigner();
            }
          })
          .catch((error) => {
            console.log(error);
            Toast.fire({
              icon: "warning",
              title: "密碼錯誤！",
            });
          });
      } else {
        Toast.fire({
          icon: "warning",
          title: "請填寫密碼及作廢原因！",
        });
      }
    },
    // 上傳作廢人員名單給後端
    async uploadSigner() {
      this.runningCount++;
      const addSigner = []
      addSigner.push({
        FORMNO: this.formId,
        SIGNER: this.userData.EmpId,
        SIGNERNAME: this.userData.EmpName,
        SIGNORDER: this.signer.SIGNORDER,
        STEPNAME: "作廢人員",
        SignGroup: "作廢",
      })
      await baseAPI
        .CountersignAdd(addSigner)
        .then((response) => {
          console.log("作廢人員上傳後端", response);

          if (response.data === "更新完成") {
            this.disabledBtn = true;
            this.$emit("deliver-disabled-btn", true);
          }

        }).then(async () => {
          await this.reAllSign()
          await this.voidSignStatus()
        })
        .then(() => {
          this.runningCount--;
          // 跳出成功訊息
          this.signSuccess();
        })
        .catch((error) => {
          this.runningCount--;
          console.log("人員上傳後端error", error);
          Toast.fire({
            icon: "error",
            title: "新增作廢人員失敗請再試一次或聯絡IT人員",
          });
        });
    },
    // 重新取得全部簽核人員
    async reAllSign() {
      this.runningCount++;
      await baseAPI.getSignStep(this.formId)
        .then(async (response) => {
          console.log("全部簽核人員store", response.data);
          this.all = response.data
        })
        .then(() => {
          this.runningCount--;
        })
        .catch((error) => {
          this.runningCount--;
          console.log("更新簽核狀態-作廢-error", error);
        });
    },
    // 更新簽核狀態 - 作廢
    async voidSignStatus() {
      this.runningCount++;
      await addFormAPI[this.formAllData.updateFormsAPI](this.formAllData.voidSign).then(async (response) => {
        console.log("更新簽核狀態-作廢", response);

        // 如果有確認單的 會多跑這個程序
        if (this.formAllData.clearId) {
          await this.cleanFormId();
        }

        // 更新簽核程序的狀態 => 必須先送作廢的人，再送其他人
        await this.updateSignPerson2();
        await this.updateSignPerson();
        await this.sendMailCreater();

      }).then(() => {
        this.runningCount--;
      }).catch((error) => {
        this.runningCount--;
        console.log("更新簽核狀態-作廢-error", error);
      });
    },
    // 若有確認單 需清除 連結的申請單單號
    async cleanFormId() {
      this.runningCount++;
      await addFormAPI[this.formAllData.updateFormsAPI](this.formAllData.clearId).then(async (response) => {
        console.log("作廢清除", response);

        this.runningCount--;
      }).catch((error) => {
        this.runningCount--;
        console.log("更新簽核狀態-作廢-error", error);
      });
    },
    // 更新簽核人員簽核，判斷簽核順序 > 0 且 簽核結果為0者，非作廢人員SIGNRESULT代5
    async updateSignPerson() {
      for (let i = 0; i < this.all.length; i++) {
        if (
          Number(this.all[i].SIGNORDER) > 0 &&
          Number(this.all[i].SIGNRESULT) === 0 && this.all[i].SignGroup !== "作廢"
        ) {
          console.log("一般人有進", i);
          this.runningCount++;
          await baseAPI
            .signStepUpdate({
              FORMNO: this.formId, //表單單號
              SIGNORDER: this.all[i].SIGNORDER, //簽核順序
              STEPNAME: this.all[i].STEPNAME, //簽核職稱
              SIGNER: this.all[i].SIGNER, //簽核人員代號
              SIGNERNAME: this.all[i].SIGNERNAME, //簽核人員名稱
              ACTUALNAME: this.all[i].ACTUALNAME, //實際簽核人員名稱(EX: 假如財務請假，就會請財務代理人簽核
              ACTUALSIGNER: this.all[i].ACTUALSIGNER, //實際簽核人員代號 是否簽核 未簽核回傳: ""
              SIGNRESULT: 5, //簽核結果 1: 同意, 0: 未簽核, 3: 退簽 , 4: 作廢
              OPINION: "", //簽核意見
              SIGNTIME: "", //簽核時間
              ALLOWCUSTOM: this.all[i].ALLOWCUSTOM, //是否自訂簽核
              SignGroup: this.all[i].SignGroup, //簽核群組
              ISEnable: this.all[i].ISEnable, //是否顯示
              types: 1, //1修改
              ExceId: this.formContent.CreateId
                ? this.formContent.CreateId
                : this.formContent.Empid, //建立人
              Status: "",
            })
            .then((response) => {
              console.log("更新簽核人員-作廢", response);
              this.runningCount--;
            })
            .catch((error) => {
              this.runningCount--;
              console.log("更新簽核人員-作廢-error", error);
            });
        }
      }
    },
    // 更新簽核人員簽核，判斷簽核順序 > 0 且 簽核結果為0者，作廢人員SIGNRESULT代4
    async updateSignPerson2() {
      for (let i = 0; i < this.all.length; i++) {
        if (
          Number(this.all[i].SIGNORDER) > 0 &&
          Number(this.all[i].SIGNRESULT) === 0 && this.all[i].SignGroup === "作廢"
        ) {
          console.log("作廢人有進", i);
          this.runningCount++;
          await baseAPI
            .signStepUpdate({
              FORMNO: this.formId, //表單單號
              SIGNORDER: this.all[i].SIGNORDER, //簽核順序
              STEPNAME: this.all[i].STEPNAME, //簽核職稱
              SIGNER: this.all[i].SIGNER, //簽核人員代號
              SIGNERNAME: this.all[i].SIGNERNAME, //簽核人員名稱
              ACTUALNAME: this.all[i].ACTUALNAME, //實際簽核人員名稱(EX: 假如財務請假，就會請財務代理人簽核
              ACTUALSIGNER: this.all[i].ACTUALSIGNER, //實際簽核人員代號 是否簽核 未簽核回傳: ""
              SIGNRESULT: 4, //簽核結果 1: 同意, 0: 未簽核, 3: 退簽 , 4: 作廢
              OPINION: this.signModalData.opinion, //簽核意見
              SIGNTIME: "", //簽核時間
              ALLOWCUSTOM: this.all[i].ALLOWCUSTOM, //是否自訂簽核
              SignGroup: this.all[i].SignGroup, //簽核群組
              ISEnable: this.all[i].ISEnable, //是否顯示
              types: 1, //1修改
              ExceId: this.formContent.CreateId
                ? this.formContent.CreateId
                : this.formContent.Empid, //建立人
              Status: "",
            })
            .then((response) => {
              console.log("更新簽核人員-作廢", response);
              this.runningCount--;
            })
            .catch((error) => {
              this.runningCount--;
              console.log("更新簽核人員-作廢-error", error);
            });
        }
      }
    },
    // 作廢接發信api 通知建表人員
    async sendMailCreater() {
      this.runningCount++;
      await baseAPI
        .mailSend({
          Empid: this.formContent.Empid, //TODO:工號，先代自己工號，上架改成 建表人員 this.formContent.Empid
          Sub: `作廢通知：${this.formAllData.formName}，表單號碼：${this.formId}`, //主旨
          Messg: `
          可點選網址查看，https://esys.orange-electronic.com/RDDocument/Detail?webId=${this.formAllData.formCodeName}&formN=${this.formAllData.formCodeName2}&formId=${this.formId}`, //直接跳到簽核頁面 上架更改內容

          // 表單列表頁面
          // https://esys.orange-electronic.com/RDDocument/Index?id=${this.formAllData.formCodeName}&formN=index
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
          window.top.location =
            `https://esys.orange-electronic.com/RDDocument/Index?id=${this.formAllData.formCodeName}&formN=index`;
          // this.$router.push(`${this.formAllData.routeList}`);
        }
      });
    },
  },
};
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