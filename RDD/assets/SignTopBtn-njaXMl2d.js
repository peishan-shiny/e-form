import{d as U,s as C,r as P,o as z,a as M,w as O,b as I,k as i,c as a,e as K,f as n,g as d,h as t,l as u,F as X,m as Y,t as m,i as B,j,n as H,_ as Z,z as q,A as J}from"./index-C8i1NBWL.js";import{_ as Q,a as y}from"./電子表單icon_返回-ws5LyveC.js";import{u as W,b as x,s as oo,G as to,r as eo,T as E}from"./userStore-u9qmRA6a.js";import{_ as so}from"./_plugin-vue_export-helper-x3n3nnut.js";const D=""+new URL("電子表單icon_簽核-1Rso1GyZ.png",import.meta.url).href,L=""+new URL("電子表單icon_會簽-UXLYKEgY.png",import.meta.url).href,no=""+new URL("電子表單icon_列印-KAAhOp_S.png",import.meta.url).href,io=""+new URL("電子表單icon_作廢-K7vxgPbE.png",import.meta.url).href,ao=""+new URL("logo-LXrL5TcL.png",import.meta.url).href,r=f=>(q("data-v-8f7a1610"),f=f(),J(),f),lo={class:"sign-top noPrint"},ro={class:"top-button noMobile"},co=["disabled"],uo=r(()=>t("img",{src:D,alt:"",class:"icon"},null,-1)),mo=["disabled"],po=r(()=>t("img",{src:L,alt:"",class:"icon"},null,-1)),fo=["disabled"],go=r(()=>t("img",{src:Q,alt:"",class:"icon"},null,-1)),_o=r(()=>t("img",{src:no,alt:"",class:"icon"},null,-1)),ho=r(()=>t("img",{src:y,alt:"",class:"icon"},null,-1)),bo=["disabled"],vo=r(()=>t("img",{src:io,alt:"",class:"icon"},null,-1)),Co={key:4,class:"area-title"},wo={key:5,class:"file-list"},ko={class:"top-button noPC"},So=["disabled"],Io=r(()=>t("img",{src:D,alt:"",class:"icon"},null,-1)),Bo=[Io],Eo=["disabled"],yo=r(()=>t("img",{src:L,alt:"",class:"icon"},null,-1)),Do=[yo],Lo=r(()=>t("img",{src:y,alt:"",class:"icon"},null,-1)),Ro=[Lo],Go=r(()=>t("a",{href:"https://esys.orange-electronic.com/Default/Index"},[t("img",{src:ao,alt:"",class:"goHome"})],-1)),No={class:"top-content"},$o={class:"area"},Fo={class:"area-row"},To={class:"area-title-33"},Vo={class:"area-title-33"},Ao={class:"area-title-33"},Uo={class:"area-row"},Po={class:"area-title-33"},zo={class:"area-title-33"},Mo={class:"area-title-33"},Oo=U({__name:"SignTopBtn",props:{formContent:{},formAllData:{},disabledBtn:{type:Boolean}},emits:["handle-show-sign-box","handle-show-countersign-box","handle-show-void-box"],setup(f,{emit:R}){const G=H(()=>Z(()=>import("./LoadingGIF-EHAp8heU.js"),__vite__mapDeps([0,1,2,3]),import.meta.url)),w=W(),h=x(),N=oo(),{baseStoreData:b}=C(h);console.log("props.formContent",f.formContent);const v=R,e=P({isLoading:!1,runningCount:0,voidBtn:!1,showSignBox:0,showCountersignBox:0,showVoidBox:0,formId:""});z(()=>{const o=M();console.log("route",o.params),e.value.formId=o.params.formId,w.getUserData({DeptId:"",EmpId:o.params.userId,Company:""}),$()});const{userStoreData:c}=C(w),{signStoreData:g}=C(N);O(()=>e.value.runningCount,o=>{console.log("watch",o),e.value.isLoading=!0,e.value.runningCount===0&&(e.value.isLoading=!1)});async function $(){console.log("確定是否拿到userStoreData",c),e.value.runningCount++,await to({GroupID:"",EmpId:c.value.EmpId}).then(o=>{o.data[0].GroupID==="admin"&&(console.log("此人員有權限作廢"),e.value.voidBtn=!0),e.value.runningCount--}).catch(o=>{e.value.runningCount--,console.log(o),eo("API判斷是否有作廢權發生錯誤")})}function k(){e.value.showSignBox=1,v("handle-show-sign-box",e.value.showSignBox)}function S(){e.value.showCountersignBox=1,v("handle-show-countersign-box",e.value.showCountersignBox)}function F(){e.value.voidBtn?(e.value.showVoidBox=1,v("handle-show-void-box",e.value.showVoidBox)):E.fire({icon:"warning",title:"無權限作廢"})}function T(o){const s=o.target.files;let p=0;for(let _=0;_<s.length;_++)p=p+s[_].size;console.log("fileSize",p),p<4e6?h.updateFile(s):E.fire({icon:"warning",title:"檔案大小太大無法上傳！"})}function V(o){h.deleteFile(o)}function A(){console.log("列印"),window.print()}return(o,s)=>{const p=I("DeleteFilled"),_=I("el-icon");return i(),a("div",lo,[e.value.isLoading===!0?(i(),K(n(G),{key:0})):d("",!0),t("div",ro,[(o.formContent.status==="簽核中"||o.formContent.status==="簽核中")&&n(g).signer.SIGNER===n(c).EmpId?(i(),a("button",{key:0,class:"top-btn action",onClick:s[0]||(s[0]=l=>k()),disabled:o.disabledBtn},[uo,u(" 簽核表單 ")],8,co)):d("",!0),(o.formContent.status==="簽核中"||o.formContent.status==="簽核中")&&n(g).signer.SIGNER===n(c).EmpId?(i(),a("button",{key:1,class:"top-btn action",onClick:s[1]||(s[1]=l=>S()),disabled:o.disabledBtn},[po,u(" 會簽(意見徵詢) ")],8,mo)):d("",!0),(o.formContent.status==="簽核中"||o.formContent.status==="簽核中")&&n(g).signer.SIGNER===n(c).EmpId?(i(),a("button",{key:2,class:"top-btn common",onClick:s[2]||(s[2]=l=>o.$refs.fileDOM.click()),disabled:o.disabledBtn},[t("input",{ref:"fileDOM",onChange:T,type:"file",multiple:"",class:"input-file"},null,544),go,u(" 加入簽核附件 ")],8,fo)):d("",!0),t("button",{class:"top-btn common",onClick:A},[_o,u(" 列印 ")]),t("button",{class:"top-btn common",onClick:s[3]||(s[3]=l=>o.$router.back())},[ho,u(" 返回列表 ")]),e.value.voidBtn?(i(),a("button",{key:3,class:"top-btn common",onClick:F,disabled:o.disabledBtn},[vo,u(" 作廢 ")],8,bo)):d("",!0),n(b).file.length>0?(i(),a("div",Co,"簽核人員上傳文件：")):d("",!0),n(b).file.length>0?(i(),a("div",wo,[(i(!0),a(X,null,Y(n(b).file,l=>(i(),a("p",{class:"file",key:l.name},[u(m(l.name)+" ",1),B(_,null,{default:j(()=>[B(p,{class:"delete",onClick:Xo=>V(l.name)},null,8,["onClick"])]),_:2},1024)]))),128))])):d("",!0)]),t("div",ko,[(o.formContent.status==="簽核中"||o.formContent.status==="簽核中")&&n(g).signer.SIGNER===n(c).EmpId?(i(),a("button",{key:0,class:"top-btn mobile-action",onClick:s[4]||(s[4]=l=>k()),disabled:o.disabledBtn},Bo,8,So)):d("",!0),(o.formContent.status==="簽核中"||o.formContent.status==="簽核中")&&n(g).signer.SIGNER===n(c).EmpId?(i(),a("button",{key:1,class:"top-btn mobile-action",onClick:s[5]||(s[5]=l=>S()),disabled:o.disabledBtn},Do,8,Eo)):d("",!0),t("button",{class:"top-btn mobile-common",onClick:s[6]||(s[6]=l=>o.$router.back())},Ro),Go]),t("div",No,[t("div",$o,[t("div",Fo,[t("div",To,"表單編號："+m(e.value.formId),1),t("div",Vo,"建立日期："+m(o.formContent.CreateDate),1),t("div",Ao,"簽核狀態："+m(o.formContent.status),1)]),t("div",Uo,[t("div",Po,"公司別："+m(o.formContent.Company),1),t("div",zo,"部門："+m(o.formContent.DeptName),1),t("div",Mo,"建檔人員："+m(o.formContent.EmpName),1)])])])])}}}),qo=so(Oo,[["__scopeId","data-v-8f7a1610"]]);export{qo as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./LoadingGIF-EHAp8heU.js","./_plugin-vue_export-helper-x3n3nnut.js","./index-C8i1NBWL.js","./index-BaElX5cx.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}