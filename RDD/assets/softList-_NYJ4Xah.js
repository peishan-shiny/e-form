import{d as U,u as Y,a as F,r as T,s as $,o as O,w as B,b as c,c as m,e as h,f as g,g as M,h as n,i as t,j as u,k as i,R as q,l as C,F as D,m as V,n as j,_ as K}from"./index-C8i1NBWL.js";import{b as z,u as H,r as y,G as J,a as Q,T as W}from"./userStore-u9qmRA6a.js";import{G as R}from"./getListAPI-o9mlSGCe.js";const X=""+new URL("電子表單icon_建立表單-0oTo261l.png",import.meta.url).href,Z=""+new URL("電子表單icon_搜尋-fKai2N2q.png",import.meta.url).href,ee={class:"content"},ae=n("p",{class:"title"},"軟體申請單",-1),te={class:"list-form"},le=n("div",{class:"top-btn"},[n("img",{src:X,alt:"",class:"icon"}),C(" 建立表單 ")],-1),oe={class:"block-search"},se={class:"search-row"},ne={class:"search-area"},re=n("div",{class:"search-title"},"建立日期",-1),ue=n("div",{class:"search-title"},"~",-1),ie={class:"search-row"},de={class:"search-area"},ce=n("div",{class:"search-title"},"申請人員",-1),pe={class:"search-area"},me=n("div",{class:"search-title"},"表單狀態",-1),he=n("img",{src:Z,alt:"",class:"icon"},null,-1),De=U({__name:"softList",setup(ve){const I=j(()=>K(()=>import("./LoadingGIF-EHAp8heU.js"),__vite__mapDeps([0,1,2,3]),import.meta.url)),E=Y(),L=location.href;console.log("網址",L);const{query:v}=F();console.log(v);let p="";typeof v.Empid=="string"&&(p=v.Empid);const e=T({isLoading:!1,runningCount:0,startDate:"",endDate:"",branchValue:"",personOptions:[],personValue:"",statusOptions:[{value:1,label:"簽核中"},{value:2,label:"完簽"},{value:3,label:"退簽"},{value:4,label:"作廢"}],statusValue:"",searchResult:[],searchLimit:"",formAllData:{routeCreate:"soft-create",routeSign:"soft-sign",signPath:"/soft/sign/",createPath:"/soft/create/",searchFormsAPI:"GetRDDList",id:"RDDID"}}),_=z();_.getBranchData({DeptId:"",DeptName:""}),_.getPersonData({DeptId:"",EmpId:"",Company:""});const{baseStoreData:w}=$(_);H().getUserData({DeptId:"",EmpId:p,Company:""}),O(()=>{N(p)}),B(()=>e.value.runningCount,()=>{e.value.isLoading=!0,e.value.runningCount===0&&(e.value.isLoading=!1)});async function k(o){e.value.personValue="",e.value.personOptions=w.value.allPersons.filter(a=>a.DeptId===o)}async function S(){let o="";e.value.endDate&&(o=Q(e.value.endDate)),e.value.runningCount++,await R({Formno:"",status:e.value.statusValue,Coid:"",DeptId:e.value.branchValue,Startdt:e.value.startDate,Enddt:o.toString(),Createid:e.value.searchLimit,type:"0"}).then(a=>{a.data==null?W.fire({icon:"warning",title:"此條件查無資料！"}):e.value.personValue?e.value.searchResult=a.data.filter(s=>{if(s.Empid===e.value.personValue)return s.CreateDate=s.CreateDate.split(" ")[0],s}):e.value.searchResult=a.data.map(s=>(s.CreateDate=s.CreateDate.split(" ")[0],s)),e.value.runningCount--}).catch(a=>{e.value.runningCount--,console.log(a),y("查詢表單發生錯誤")})}async function N(o){console.log("有抓到使用者id",o),e.value.runningCount++,await R({status:"1",type:"0"}).then(a=>{console.log("所有尚未簽核資料",a),a.data==null?console.log("目前無待簽核表單"):(e.value.searchResult=a.data.filter(s=>(s.CreateDate=s.CreateDate.split(" ")[0],s.SIGNER==o)),console.log("為使用者簽核的資料",e.value.searchResult))}).then(async()=>{await x(o),e.value.runningCount--}).catch(a=>{e.value.runningCount--,console.log(a),y("查詢待簽核表單發生錯誤")})}async function x(o){await J({GroupID:"",EmpId:o}).then(a=>{console.log("人員群組",a.data);const s=a.data;for(let d of s)if(d.GroupID==="admin"||d.EmpId==="222010"){e.value.searchLimit="";return}e.value.searchLimit=o})}function G(o){console.log(`${e.value.formAllData.signPath}${o[e.value.formAllData.id]}/${p}`),E.push(`${e.value.formAllData.signPath}${o[e.value.formAllData.id]}/${p}`)}function A({rowIndex:o}){if(o===0)return"black-row"}return(o,a)=>{const s=c("el-date-picker"),d=c("el-col"),f=c("el-option"),b=c("el-select"),r=c("el-table-column"),P=c("el-table");return i(),m("div",ee,[e.value.isLoading===!0?(i(),h(g(I),{key:0})):M("",!0),ae,n("div",te,[t(g(q),{class:"action",to:"/soft/create"},{default:u(()=>[le]),_:1}),n("div",oe,[n("div",se,[t(d,{xs:24,sm:24,md:12},{default:u(()=>[n("div",ne,[re,t(s,{modelValue:e.value.startDate,"onUpdate:modelValue":a[0]||(a[0]=l=>e.value.startDate=l),type:"date",class:"date-input","value-format":"YYYY-MM-DD",placeholder:"建立周期(起)"},null,8,["modelValue"]),C("     "),ue,t(s,{modelValue:e.value.endDate,"onUpdate:modelValue":a[1]||(a[1]=l=>e.value.endDate=l),type:"date","value-format":"YYYY-MM-DD",placeholder:"建立周期(迄)"},null,8,["modelValue"])])]),_:1})]),n("div",ie,[t(d,{xs:24,sm:24,md:12},{default:u(()=>[n("div",de,[ce,t(b,{modelValue:e.value.branchValue,"onUpdate:modelValue":a[2]||(a[2]=l=>e.value.branchValue=l),onChange:a[3]||(a[3]=l=>k(e.value.branchValue)),placeholder:"部門","no-data-text":"無數據",clearable:""},{default:u(()=>[(i(!0),m(D,null,V(g(w).branchs,l=>(i(),h(f,{key:l.DeptId,value:l.DeptId,label:l.DeptName},null,8,["value","label"]))),128))]),_:1},8,["modelValue"]),t(b,{modelValue:e.value.personValue,"onUpdate:modelValue":a[4]||(a[4]=l=>e.value.personValue=l),class:"ml-1 mr-3",placeholder:"人員","no-data-text":"請先選部門",clearable:""},{default:u(()=>[(i(!0),m(D,null,V(e.value.personOptions,l=>(i(),h(f,{key:l.EmpId,value:l.EmpId,label:l.EmpName},null,8,["value","label"]))),128))]),_:1},8,["modelValue"])])]),_:1}),t(d,{xs:24,sm:24,md:6},{default:u(()=>[n("div",pe,[me,t(b,{modelValue:e.value.statusValue,"onUpdate:modelValue":a[5]||(a[5]=l=>e.value.statusValue=l),placeholder:"不拘",clearable:""},{default:u(()=>[(i(!0),m(D,null,V(e.value.statusOptions,l=>(i(),h(f,{label:l.label,key:l.value,value:l.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),_:1}),t(d,{xs:24,sm:24,md:6},{default:u(()=>[n("button",{class:"search-btn btn-black",onClick:S},[he,C(" 查詢表單 ")])]),_:1})])]),t(P,{border:"","max-height":"500","empty-text":"暫無數據",style:{width:"100%"},data:e.value.searchResult,"header-cell-style":{color:"white"},"header-row-class-name":A,onRowClick:G,"default-sort":{prop:"number",order:"descending"}},{default:u(()=>[t(r,{type:"index",label:"項次",width:"80",sortable:""}),t(r,{prop:"CreateDate",label:"建立日期",width:"100"}),t(r,{prop:e.value.formAllData.id,label:"表單號碼","min-width":"130",sortable:""},null,8,["prop"]),t(r,{prop:"applyReason",label:"申請原因","min-width":"100"}),t(r,{prop:"applyArea",label:"申請地區","min-width":"100"}),t(r,{prop:"applyType",label:"申請類別","min-width":"100"}),t(r,{prop:"programName",label:"程式名稱","min-width":"100"}),t(r,{prop:"programV",label:"程式版號","min-width":"100"}),t(r,{prop:"SVNV",label:"SVN版號","min-width":"100"}),t(r,{prop:"EmpName",label:"申請人員","min-width":"100"}),t(r,{prop:"status",label:"表單狀態","min-width":"100"}),t(r,{prop:"NextSIGNER",label:"待簽人員","min-width":"150"})]),_:1},8,["data"])])])}}});export{De as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./LoadingGIF-EHAp8heU.js","./_plugin-vue_export-helper-x3n3nnut.js","./index-C8i1NBWL.js","./index-BaElX5cx.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}