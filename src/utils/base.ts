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

