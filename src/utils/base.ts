import Swal from 'sweetalert2'

// api回應有error
export function resError(data: any) {
  // 跳出視窗
  Swal.fire({
    icon: "error",
    title: "資料回應錯誤，請聯絡IT人員！",
    text: data,
    confirmButtonColor: "#333",
    confirmButtonText: "確認",
  })
}

// 轉跳帶簽核頁面
export function pushWaitSignPage(data: string) {
  Swal.fire({
    title: "成功送出",
    confirmButtonColor: "#333",
    confirmButtonText: "確認",
  }).then((resule) => {
    console.log(resule);
    if (resule.value) {
      // 轉跳到各表單搜尋頁面
      (window.top as any).location =
        `https://esys.orange-electronic.com/ODF/RDN?id=${data}`;
      // `https://esys.orange-electronic.com/RDDocument/Index?id=${data}&formN=index`;
    }
  });
}

// null或undefined 提示
export const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 2500
})

// 產生當下日期
export function createDate() {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y + "/" + m + "/" + d;
}

// 下載功能，拿取表單的附件
export function downloadFile(filePath: string) {
  window.open(
    "https://orangeapitest.orange-electronic.com/api" + "/Download?file=" + filePath
  );
}

