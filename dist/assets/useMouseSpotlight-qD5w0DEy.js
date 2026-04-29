import{c}from"./index-CAbpQkax.js";import{r as l}from"./react-vendor-DNUI7Q3h.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=c("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=c("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);function x(){l.useEffect(()=>{let r=50,s=30,n=50,i=30,e=0,t=!0;const a=u=>{r=u.clientX/window.innerWidth*100,s=u.clientY/window.innerHeight*100},o=()=>{t&&(n+=(r-n)*.06,i+=(s-i)*.06,document.documentElement.style.setProperty("--mx",`${n}%`),document.documentElement.style.setProperty("--my",`${i}%`),e=requestAnimationFrame(o))},m=()=>{document.hidden?(t=!1,cancelAnimationFrame(e)):(t=!0,e=requestAnimationFrame(o))};return window.addEventListener("mousemove",a),document.addEventListener("visibilitychange",m),e=requestAnimationFrame(o),()=>{t=!1,window.removeEventListener("mousemove",a),document.removeEventListener("visibilitychange",m),cancelAnimationFrame(e)}},[])}export{f as L,v as M,x as u};
