import{d as f,s as h,r as g,w as V,b as l,k as B,c as D,h as a,i as d,j as u,l as M,z as S,A as k}from"./index-C8i1NBWL.js";import{u as C,L as y,r as I,T}from"./userStore-u9qmRA6a.js";import{_ as E}from"./_plugin-vue_export-helper-x3n3nnut.js";const i=n=>(S("data-v-fb5d6375"),n=n(),k(),n),N={class:"sign-box"},U={class:"box"},q=i(()=>a("div",{class:"box-title"},"表單作廢",-1)),z={class:"box-content"},L={class:"box-row"},P=i(()=>a("div",{class:"box-content-text"},"簽核決定",-1)),R={class:"box-content-item"},j={class:"box-row"},A=i(()=>a("div",{class:"box-content-text"},"簽核密碼",-1)),$={class:"box-content-item"},F={class:"box-row"},G=i(()=>a("div",{class:"box-content-text opinion"},"作廢原因",-1)),H={class:"box-content-item"},J=["disabled"],K=f({__name:"VoidBox",emits:["handle-show-void-box","submit-void"],setup(n,{emit:_}){const p=C(),{userStoreData:v}=h(p),c=_,o=g({showVoidBox:1,disabledBtn:!1,signModalData:{radio:2,password:"",opinion:""}});V(()=>o.value.showVoidBox,s=>{console.log("watch",s),c("handle-show-void-box",o.value.showVoidBox)});function m(s){const t=document.querySelector(".sign-modal");s.target===t&&(o.value.showVoidBox=0)}async function b(){o.value.disabledBtn=!0,o.value.signModalData.password&&o.value.signModalData.opinion&&o.value.signModalData.radio?await y({acc:v.value.EmpId,Pwd:o.value.signModalData.password}).then(s=>{s.data==="密碼通過"&&c("submit-void",o.value.signModalData)}).catch(s=>{o.value.disabledBtn=!1,console.log(s),I("密碼錯誤")}):(o.value.disabledBtn=!1,T.fire({icon:"warning",title:"請填寫密碼及作廢原因！"}))}return(s,t)=>{const x=l("el-radio"),w=l("el-radio-group"),r=l("el-input");return B(),D("div",N,[a("div",{class:"sign-modal",onClick:m},[a("div",U,[q,a("div",z,[a("div",L,[P,a("div",R,[d(w,{modelValue:o.value.signModalData.radio,"onUpdate:modelValue":t[0]||(t[0]=e=>o.value.signModalData.radio=e)},{default:u(()=>[d(x,{label:2},{default:u(()=>[M("作廢")]),_:1})]),_:1},8,["modelValue"])])]),a("div",j,[A,a("div",$,[d(r,{type:"password",modelValue:o.value.signModalData.password,"onUpdate:modelValue":t[1]||(t[1]=e=>o.value.signModalData.password=e),required:""},null,8,["modelValue"])])]),a("div",F,[G,a("div",H,[d(r,{type:"textarea",autosize:{minRows:5},modelValue:o.value.signModalData.opinion,"onUpdate:modelValue":t[2]||(t[2]=e=>o.value.signModalData.opinion=e)},null,8,["modelValue"])])])]),a("button",{type:"button",class:"btn btn-black",onClick:b,disabled:o.value.disabledBtn}," 確認 ",8,J),a("button",{type:"button",class:"btn btn-red",onClick:t[3]||(t[3]=e=>o.value.showVoidBox=0)}," 取消 ")])])])}}}),X=E(K,[["__scopeId","data-v-fb5d6375"]]);export{X as default};