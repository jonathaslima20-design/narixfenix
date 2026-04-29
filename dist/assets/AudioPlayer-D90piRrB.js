import{c as g}from"./index-DNpoyfDm.js";import{j as s}from"./motion-D_fRN-r8.js";import{r as t}from"./react-vendor-wlP46pXh.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=g("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=g("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=g("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=g("Pause",[["rect",{width:"4",height:"16",x:"6",y:"4",key:"iffhe4"}],["rect",{width:"4",height:"16",x:"14",y:"4",key:"sjin7j"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=g("Play",[["polygon",{points:"5 3 19 12 5 21 5 3",key:"191637"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=g("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);function P(){const i=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];for(const n of i)if(typeof MediaRecorder<"u"&&MediaRecorder.isTypeSupported(n))return n;return"audio/webm"}function D(){const[i,n]=t.useState("idle"),[v,c]=t.useState(0),[w,u]=t.useState(null),l=t.useRef(null),m=t.useRef([]),h=t.useRef(0),d=t.useRef(null),y=t.useRef(null),x=t.useRef(null),o=t.useCallback(()=>{d.current&&(d.current.getTracks().forEach(r=>r.stop()),d.current=null),y.current!=null&&(window.clearInterval(y.current),y.current=null)},[]);t.useEffect(()=>()=>{o()},[o]);const p=t.useCallback(async()=>{var r;if(u(null),i!=="idle")return!1;if(!((r=navigator.mediaDevices)!=null&&r.getUserMedia))return u("Gravação não suportada neste navegador"),!1;try{n("requesting");const a=await navigator.mediaDevices.getUserMedia({audio:!0});d.current=a;const b=P(),R=new MediaRecorder(a,{mimeType:b});return m.current=[],R.ondataavailable=k=>{k.data&&k.data.size>0&&m.current.push(k.data)},R.onstop=()=>{const k=Math.max(1,Math.round((performance.now()-h.current)/1e3)),j=new Blob(m.current,{type:b});o(),n("idle"),c(0);const M=x.current;x.current=null,M&&M({blob:j,mimeType:b,durationSeconds:k})},l.current=R,h.current=performance.now(),R.start(),n("recording"),c(0),y.current=window.setInterval(()=>{c(Math.floor((performance.now()-h.current)/1e3))},250),!0}catch(a){return o(),n("idle"),u(a instanceof Error?a.message:"Permissão negada"),!1}},[o,i]),e=t.useCallback(()=>new Promise(r=>{const a=l.current;if(!a||a.state==="inactive"){r(null);return}x.current=r,n("processing"),a.stop()}),[]),f=t.useCallback(()=>{const r=l.current;x.current=null,r&&r.state!=="inactive"?(r.onstop=()=>{o(),n("idle"),c(0)},r.stop()):(o(),n("idle"),c(0))},[o]);return{state:i,elapsed:v,error:w,start:p,stop:e,cancel:f}}function T(i){const n=Math.max(0,Math.floor(i)),v=Math.floor(n/60),c=n%60;return`${v}:${c.toString().padStart(2,"0")}`}function U({src:i,durationSeconds:n,variant:v,uploading:c}){const w=t.useRef(null),[u,l]=t.useState(!1),[m,h]=t.useState(0),[d,y]=t.useState(n??0);t.useEffect(()=>{const e=w.current;if(!e)return;function f(){e&&h(e.currentTime)}function r(){e&&isFinite(e.duration)&&e.duration>0&&y(e.duration)}function a(){l(!1),h(0)}return e.addEventListener("timeupdate",f),e.addEventListener("loadedmetadata",r),e.addEventListener("ended",a),()=>{e.removeEventListener("timeupdate",f),e.removeEventListener("loadedmetadata",r),e.removeEventListener("ended",a)}},[]);async function x(){const e=w.current;if(e)if(u)e.pause(),l(!1);else try{await e.play(),l(!0)}catch{l(!1)}}const o=d>0?Math.min(100,m/d*100):0,p=v==="out";return s.jsxs("div",{className:`flex items-center gap-2.5 min-w-[200px] ${p?"text-white":"text-white/90"}`,children:[s.jsx("audio",{ref:w,src:i,preload:"metadata"}),s.jsx("button",{onClick:x,type:"button",className:`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${p?"bg-white/20 hover:bg-white/30":"bg-emerald-600 text-white hover:bg-emerald-700"}`,"aria-label":u?"Pausar":"Reproduzir",children:u?s.jsx(L,{size:14}):s.jsx(N,{size:14,className:"ml-0.5"})}),s.jsxs("div",{className:"flex-1 flex flex-col gap-1",children:[s.jsx("div",{className:"flex items-center gap-0.5 h-6",children:Array.from({length:26}).map((e,f)=>{const r=f/26*100<=o,a=[7,10,13,9,15,11,8,14,12,10,16,9,11,14,8,13,10,15,11,9,12,14,10,8,13,11],b=a[f%a.length];return s.jsx("span",{className:`inline-block w-0.5 rounded-full transition-colors ${r?p?"bg-white":"bg-emerald-600":p?"bg-white/40":"bg-white/30"}`,style:{height:`${b}px`}},f)})}),s.jsxs("div",{className:`flex items-center justify-between text-[10px] ${p?"text-white/70":"text-white/55"}`,children:[s.jsx("span",{className:"tabular-nums",children:T(u||m>0?m:d)}),c?s.jsx(E,{size:10,className:"opacity-70 animate-spin"}):s.jsx(S,{size:10,className:"opacity-70"})]})]})]})}export{U as A,I,S as M,N as P,A as T,T as f,D as u};
