import{r}from"./react-vendor-wlP46pXh.js";import{c as d,u as _,s as c,C as F}from"./index-CpE48Z_K.js";import{S as M,T as L,F as A}from"./thermometer-D7LeDq_q.js";import{C as O}from"./clock-JpsNijVQ.js";import{Z as E}from"./zap-DWfMAOpD.js";import{T as H}from"./trending-up-CYcGyPxJ.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=d("Award",[["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}],["path",{d:"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11",key:"em7aur"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=d("CircleDot",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=d("Handshake",[["path",{d:"m11 17 2 2a1 1 0 1 0 3-3",key:"efffak"}],["path",{d:"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",key:"9pr0kb"}],["path",{d:"m21 3 1 11h-2",key:"1tisrp"}],["path",{d:"M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3",key:"1uvwmv"}],["path",{d:"M3 4h8",key:"1ep09j"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=d("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=d("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=d("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=d("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=d("ThumbsUp",[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z",key:"y3tblf"}]]),k=[{key:"cold",label:"Frio",color:"bg-sky-100 text-sky-700",icon:"Snowflake",position:0},{key:"warm",label:"Morno",color:"bg-amber-100 text-amber-700",icon:"Thermometer",position:1},{key:"hot",label:"Quente",color:"bg-red-100 text-red-700",icon:"Flame",position:2},{key:"closed",label:"Fechado",color:"bg-teal-100 text-teal-700",icon:"Check",position:3}];function W(){const{user:e}=_(),[s,l]=r.useState([]),[m,u]=r.useState(!0),i=r.useCallback(async()=>{if(!e)return;const{data:t}=await c.from("lead_categories").select("*").eq("user_id",e.id).order("position",{ascending:!0});t&&t.length>0?l(t):l(k.map((a,n)=>({...a,id:`default-${n}`,user_id:e.id}))),u(!1)},[e]);r.useEffect(()=>{i()},[i]),r.useEffect(()=>{if(!e)return;const t=Math.random().toString(36).slice(2,8),a=c.channel(`lead_categories_changes_${t}`).on("postgres_changes",{event:"*",schema:"public",table:"lead_categories",filter:`user_id=eq.${e.id}`},()=>{i()}).subscribe();return()=>{c.removeChannel(a)}},[e,i]);const p=r.useCallback(async(t,a,n)=>{if(!e)return;const o=t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");if(!o||s.find(y=>y.key===o))return;const g=s.length,{data:h}=await c.from("lead_categories").insert({user_id:e.id,key:o,label:t,color:a,icon:n,position:g}).select().maybeSingle();h&&l(y=>[...y,h])},[e,s]),f=r.useCallback(async(t,a)=>{if(!e)return;await c.from("leads").update({category:a,updated_at:new Date().toISOString()}).eq("user_id",e.id).eq("category",t),await c.from("lead_categories").delete().eq("user_id",e.id).eq("key",t);const n=s.filter(o=>o.key!==t);l(n.map((o,g)=>({...o,position:g})));for(let o=0;o<n.length;o++)n[o].position!==o&&await c.from("lead_categories").update({position:o}).eq("id",n[o].id)},[e,s]),w=r.useCallback(async(t,a)=>{e&&(l(n=>n.map(o=>o.key===t?{...o,label:a}:o)),await c.from("lead_categories").update({label:a,updated_at:new Date().toISOString()}).eq("user_id",e.id).eq("key",t))},[e]),S=r.useCallback(async(t,a)=>{e&&(l(n=>n.map(o=>o.key===t?{...o,color:a}:o)),await c.from("lead_categories").update({color:a,updated_at:new Date().toISOString()}).eq("user_id",e.id).eq("key",t))},[e]),q=r.useCallback(async(t,a)=>{e&&(l(n=>n.map(o=>o.key===t?{...o,icon:a}:o)),await c.from("lead_categories").update({icon:a,updated_at:new Date().toISOString()}).eq("user_id",e.id).eq("key",t))},[e]),T=r.useCallback(async t=>{if(!e)return;const a=t.map((n,o)=>({...n,position:o}));l(a);for(const n of a)await c.from("lead_categories").update({position:n.position,updated_at:new Date().toISOString()}).eq("id",n.id)},[e]),I=r.useCallback(async()=>{if(!e)return;await c.from("lead_categories").delete().eq("user_id",e.id);const t=k.map(a=>({user_id:e.id,key:a.key,label:a.label,color:a.color,icon:a.icon,position:a.position}));await c.from("lead_categories").insert(t),await i()},[e,i]),x=r.useCallback(t=>{var a;return((a=s.find(n=>n.key===t))==null?void 0:a.label)??t},[s]),D=r.useCallback(t=>{var a;return((a=s.find(n=>n.key===t))==null?void 0:a.color)??"bg-gray-100 text-gray-700"},[s]),v=r.useCallback(t=>{var a;return((a=s.find(n=>n.key===t))==null?void 0:a.icon)??"CircleDot"},[s]);return{categories:s,loading:m,addCategory:p,deleteCategory:f,updateCategoryLabel:w,updateCategoryColor:S,updateCategoryIcon:q,reorderCategories:T,resetToDefaults:I,getLabelForKey:x,getColorForKey:D,getIconForKey:v,refetch:i}}const G=[{name:"Snowflake",component:M},{name:"Thermometer",component:L},{name:"Flame",component:A},{name:"Check",component:F},{name:"Star",component:z},{name:"Target",component:K},{name:"Clock",component:O},{name:"Heart",component:N},{name:"Zap",component:E},{name:"Shield",component:Z},{name:"Award",component:$},{name:"TrendingUp",component:H},{name:"Handshake",component:U},{name:"ThumbsUp",component:j},{name:"CircleDot",component:b}],C={};for(const e of G)C[e.name]=e.component;function X(e){return C[e]||b}function Y(){const{user:e}=_(),[s,l]=r.useState([]),[m,u]=r.useState(!0),i=r.useCallback(async()=>{if(!(e!=null&&e.id))return;const{data:p}=await c.from("whatsapp_instances").select("*").eq("user_id",e.id).order("created_at",{ascending:!0});l(p??[]),u(!1)},[e==null?void 0:e.id]);return r.useEffect(()=>{i()},[i]),r.useEffect(()=>{if(!(e!=null&&e.id))return;const p=`user-instances-${e.id}-${Math.random().toString(36).slice(2,8)}`,f=c.channel(p).on("postgres_changes",{event:"*",schema:"public",table:"whatsapp_instances",filter:`user_id=eq.${e.id}`},()=>{i()}).subscribe();return()=>{c.removeChannel(f)}},[e==null?void 0:e.id,i]),{instances:s,loading:m,refresh:i}}function ee(e){var s;return((s=e.label)==null?void 0:s.trim())||e.phone_number||e.instance_name||"Instância"}export{G as I,z as S,Y as a,ee as i,X as r,W as u};
