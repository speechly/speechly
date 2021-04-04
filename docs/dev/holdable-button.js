!function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function i(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e}function c(t,e){t.appendChild(e)}function s(t,e,n){t.insertBefore(e,n||null)}function a(t){t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function u(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function d(t){return document.createTextNode(t)}function f(){return d(" ")}function p(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function g(t,e,n){e in t?t[e]=n:h(t,e,n)}function m(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}function v(t){const e={};for(const n of t)e[n.name]=n.value;return e}let w;function b(t){w=t}function $(){if(!w)throw new Error("Function called outside component initialization");return w}const y=[],x=[],C=[],k=[],N=Promise.resolve();let M=!1;function E(t){C.push(t)}let S=!1;const z=new Set;function _(){if(!S){S=!0;do{for(let t=0;t<y.length;t+=1){const e=y[t];b(e),L(e.$$)}for(b(null),y.length=0;x.length;)x.pop()();for(let t=0;t<C.length;t+=1){const e=C[t];z.has(e)||(z.add(e),e())}C.length=0}while(y.length);for(;k.length;)k.pop()();M=!1,S=!1,z.clear()}}function L(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const B=new Set;const P="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function D(t,e){-1===t.$$.dirty[0]&&(y.push(t),M||(M=!0,N.then(_)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function A(r,c,s,l,u,d,f=[-1]){const p=w;b(r);const h=r.$$={fragment:null,ctx:null,props:d,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:[]),callbacks:n(),dirty:f,skip_bound:!1};let g=!1;if(h.ctx=s?s(r,c.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return h.ctx&&u(h.ctx[t],h.ctx[t]=o)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](o),g&&D(r,t)),e})):[],h.update(),g=!0,o(h.before_update),h.fragment=!!l&&l(h.ctx),c.target){if(c.hydrate){const t=function(t){return Array.from(t.childNodes)}(c.target);h.fragment&&h.fragment.l(t),t.forEach(a)}else h.fragment&&h.fragment.c();c.intro&&((m=r.$$.fragment)&&m.i&&(B.delete(m),m.i(v))),function(t,n,r,c){const{fragment:s,on_mount:a,on_destroy:l,after_update:u}=t.$$;s&&s.m(n,r),c||E((()=>{const n=a.map(e).filter(i);l?l.push(...n):o(n),t.$$.on_mount=[]})),u.forEach(E)}(r,c.target,c.anchor,c.customElement),_()}var m,v;b(p)}let R;function F(e){let n,o,i,r,l,d,f,p;return{c(){n=u("svg"),o=u("defs"),i=u("linearGradient"),r=u("stop"),l=u("stop"),d=u("g"),f=u("path"),p=u("path"),this.c=t,h(r,"stop-color","var(--gradient-stop1)"),h(r,"offset","0%"),h(l,"stop-color","var(--gradient-stop2)"),h(l,"offset","100%"),h(i,"x1","50%"),h(i,"y1","0%"),h(i,"x2","50%"),h(i,"y2","100%"),h(i,"id","a"),h(f,"d","M46 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z"),h(f,"fill","#FFF"),h(p,"d","M46 0C20.595 0 0 20.595 0 46s20.595 46 46 46 46-20.595 46-46S71.405 0 46 0zm0 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z"),h(p,"fill","url(#a)"),h(d,"fill","none"),h(d,"fillrule","nonzero"),h(n,"class","buttonFrameEl"),h(n,"viewBox","0 0 92 92"),h(n,"xmlns","http://www.w3.org/2000/svg")},m(t,e){s(t,n,e),c(n,o),c(o,i),c(i,r),c(i,l),c(n,d),c(d,f),c(d,p)},p:t,i:t,o:t,d(t){t&&a(n)}}}"function"==typeof HTMLElement&&(R=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(e).filter(i);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,n){this[t]=n}disconnectedCallback(){o(this.$$.on_disconnect)}$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});function H(t){let e,n,o,i;return{c(){e=u("svg"),n=u("g"),o=u("path"),i=u("rect"),h(o,"d","M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"),h(i,"x","20"),h(i,"y","1"),h(i,"width","16"),h(i,"height","37"),h(i,"rx","8"),h(n,"fill","#000"),h(n,"fillrule","evenodd"),h(e,"class","buttonIconEl"),h(e,"viewBox","0 0 56 56"),h(e,"xmlns","http://www.w3.org/2000/svg")},m(t,r){s(t,e,r),c(e,n),c(n,o),c(n,i)},d(t){t&&a(e)}}}function T(t){let e,n,o,i;return{c(){e=u("svg"),n=u("g"),o=u("path"),i=u("path"),h(o,"d","M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"),h(o,"fillrule","nonzero"),h(i,"d","M37 13.081V31a8 8 0 11-16 0v-1.919l16-16zM26 1a8 8 0 018 8v1.319L18 26.318V9a8 8 0 018-8zM37.969 7.932l3.74-7.35 3.018 2.625zM39.654 10.608l7.531-3.359.695 3.94z"),h(n,"fill","#000"),h(n,"fillrule","evenodd"),h(e,"class","buttonIconEl"),h(e,"viewBox","0 0 56 56"),h(e,"xmlns","http://www.w3.org/2000/svg")},m(t,r){s(t,e,r),c(e,n),c(n,o),c(n,i)},d(t){t&&a(e)}}}function V(t){let e,n,o,i;return{c(){e=u("svg"),n=u("g"),o=u("path"),i=u("path"),h(o,"d","M36 14.828V30a8 8 0 01-15.961.79l15.96-15.962zM28 1a8 8 0 018 8v.172L20 25.173V9a8 8 0 018-8z"),h(i,"d","M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"),h(n,"fill","#000"),h(n,"fillrule","nonzero"),h(e,"class","buttonIconEl"),h(e,"viewBox","0 0 56 56"),h(e,"xmlns","http://www.w3.org/2000/svg")},m(t,r){s(t,e,r),c(e,n),c(n,o),c(n,i)},d(t){t&&a(e)}}}function I(t){let e,n,o,i;return{c(){e=u("svg"),n=u("g"),o=u("path"),i=u("rect"),h(o,"d","M52 28c0 13.255-10.745 24-24 24S4 41.255 4 28c0-8.921 4.867-16.705 12.091-20.842l1.984 3.474C12.055 14.08 8 20.566 8 28c0 11.046 8.954 20 20 20s20-8.954 20-20c0-7.434-4.056-13.92-10.075-17.368L39.91 7.16C47.133 11.296 52 19.079 52 28z"),h(o,"fillrule","nonzero"),h(i,"x","24"),h(i,"y","1"),h(i,"width","8"),h(i,"height","23"),h(i,"rx","4"),h(n,"fill","#000"),h(n,"fillrule","evenodd"),h(e,"class","buttonIconEl"),h(e,"viewBox","0 0 56 56"),h(e,"xmlns","http://www.w3.org/2000/svg")},m(t,r){s(t,e,r),c(e,n),c(n,o),c(n,i)},d(t){t&&a(e)}}}function j(e){let n,o,i,r,c=("mic"==e[0]||"loading"==e[0])&&H(),l=("failed"==e[0]||"nobrowsersupport"==e[0])&&T(),u="noaudioconsent"==e[0]&&V(),p=("poweron"==e[0]||"connecting"==e[0])&&I();return{c(){c&&c.c(),n=f(),l&&l.c(),o=f(),u&&u.c(),i=f(),p&&p.c(),r=d(""),this.c=t},m(t,e){c&&c.m(t,e),s(t,n,e),l&&l.m(t,e),s(t,o,e),u&&u.m(t,e),s(t,i,e),p&&p.m(t,e),s(t,r,e)},p(t,[e]){"mic"==t[0]||"loading"==t[0]?c||(c=H(),c.c(),c.m(n.parentNode,n)):c&&(c.d(1),c=null),"failed"==t[0]||"nobrowsersupport"==t[0]?l||(l=T(),l.c(),l.m(o.parentNode,o)):l&&(l.d(1),l=null),"noaudioconsent"==t[0]?u||(u=V(),u.c(),u.m(i.parentNode,i)):u&&(u.d(1),u=null),"poweron"==t[0]||"connecting"==t[0]?p||(p=I(),p.c(),p.m(r.parentNode,r)):p&&(p.d(1),p=null)},i:t,o:t,d(t){c&&c.d(t),t&&a(n),l&&l.d(t),t&&a(o),u&&u.d(t),t&&a(i),p&&p.d(t),t&&a(r)}}}function G(t,e,n){let{icon:o="mic"}=e;return t.$$set=t=>{"icon"in t&&n(0,o=t.icon)},[o]}customElements.define("mic-frame",class extends R{constructor(t){super(),this.shadowRoot.innerHTML="<style>svg{position:absolute;width:100%;height:100%;pointer-events:auto;user-select:none;cursor:pointer;transform:rotate(var(--fx-rotation));-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none !important;-webkit-user-select:none !important}</style>",A(this,{target:this.shadowRoot,props:v(this.attributes),customElement:!0},null,F,r,{}),t&&t.target&&s(t.target,this,t.anchor)}});function O(e){let n,o,i,r,l,d,f,p;return{c(){n=u("svg"),o=u("defs"),i=u("linearGradient"),r=u("stop"),l=u("stop"),d=u("filter"),f=u("feGaussianBlur"),p=u("circle"),this.c=t,h(r,"stop-color","var(--gradient-stop1)"),h(r,"offset","0%"),h(l,"stop-color","var(--gradient-stop2)"),h(l,"offset","100%"),h(i,"x1","50%"),h(i,"y1","10%"),h(i,"x2","50%"),h(i,"y2","100%"),h(i,"id","a"),h(f,"stdDeviation","18"),h(f,"in","SourceGraphic"),h(d,"x","-35%"),h(d,"y","-35%"),h(d,"width","170%"),h(d,"height","170%"),h(d,"filterUnits","objectBoundingBox"),h(d,"id","b"),h(p,"filter","url(#b)"),h(p,"cx","124"),h(p,"cy","124"),h(p,"r","79"),h(p,"fill","url(#a)"),h(p,"fillrule","evenodd"),h(n,"viewBox","0 0 246 246"),h(n,"xmlns","http://www.w3.org/2000/svg")},m(t,e){s(t,n,e),c(n,o),c(o,i),c(i,r),c(i,l),c(o,d),c(d,f),c(n,p)},p:t,i:t,o:t,d(t){t&&a(n)}}}customElements.define("mic-icon",class extends R{constructor(t){super(),this.shadowRoot.innerHTML="<style>svg{position:absolute;width:60%;height:60%;top:50%;left:50%;transform:translate(-50%, -50%);pointer-events:none;transition:0.25s}</style>",A(this,{target:this.shadowRoot,props:v(this.attributes),customElement:!0},G,j,r,{icon:0}),t&&(t.target&&s(t.target,this,t.anchor),t.props&&(this.$set(t.props),_()))}static get observedAttributes(){return["icon"]}get icon(){return this.$$.ctx[0]}set icon(t){this.$set({icon:t}),_()}});customElements.define("mic-fx",class extends R{constructor(t){super(),this.shadowRoot.innerHTML="<style>svg{top:-75%;left:-75%;height:250%;width:250%;position:absolute;pointer-events:none;transform:rotate(var(--fx-rotation))}</style>",A(this,{target:this.shadowRoot,props:v(this.attributes),customElement:!0},null,O,r,{}),t&&t.target&&s(t.target,this,t.anchor)}});var q,U,J,K,Q,W=(function(t,e){var n;Object.defineProperty(e,"__esModule",{value:!0}),(n=e.ClientState||(e.ClientState={}))[n.Failed=0]="Failed",n[n.NoBrowserSupport=1]="NoBrowserSupport",n[n.NoAudioConsent=2]="NoAudioConsent",n[n.Disconnected=3]="Disconnected",n[n.Disconnecting=4]="Disconnecting",n[n.Connecting=5]="Connecting",n[n.Connected=6]="Connected",n[n.Starting=7]="Starting",n[n.Stopping=8]="Stopping",n[n.Recording=9]="Recording"}(q={exports:{}},q.exports),q.exports);!function(t){t.Poweron="poweron",t.Connecting="connecting",t.Ready="ready",t.Listening="listening",t.Loading="loading",t.Failed="failed",t.NoBrowserSupport="nobrowsersupport",t.NoAudioConsent="noaudioconsent"}(U||(U={})),function(t){t.Poweron="poweron",t.Mic="mic",t.Error="error",t.Denied="denied"}(J||(J={})),function(t){t.Hold="hold",t.Click="click",t.Noninteractive="noninteractive"}(K||(K={})),function(t){t.None="none",t.Connecting="connecting",t.Busy="busy"}(Q||(Q={}));const X={[W.ClientState.Disconnected]:{icon:J.Poweron,behaviour:K.Click,effect:Q.None},[W.ClientState.Disconnecting]:{icon:J.Poweron,behaviour:K.Noninteractive,effect:Q.Connecting},[W.ClientState.Connecting]:{icon:J.Poweron,behaviour:K.Noninteractive,effect:Q.Connecting},[W.ClientState.Connected]:{icon:J.Mic,behaviour:K.Hold,effect:Q.None},[W.ClientState.Starting]:{icon:J.Mic,behaviour:K.Hold,effect:Q.Connecting},[W.ClientState.Recording]:{icon:J.Mic,behaviour:K.Hold,effect:Q.None},[W.ClientState.Stopping]:{icon:J.Mic,behaviour:K.Noninteractive,effect:Q.Busy},[W.ClientState.Failed]:{icon:J.Error,behaviour:K.Click,effect:Q.None},[W.ClientState.NoBrowserSupport]:{icon:J.Error,behaviour:K.Click,effect:Q.None},[W.ClientState.NoAudioConsent]:{icon:J.Denied,behaviour:K.Click,effect:Q.None},[U.Poweron]:{icon:J.Poweron,behaviour:K.Click,effect:Q.None},[U.Connecting]:{icon:J.Poweron,behaviour:K.Noninteractive,effect:Q.Connecting},[U.Ready]:{icon:J.Mic,behaviour:K.Hold,effect:Q.None},[U.Listening]:{icon:J.Mic,behaviour:K.Hold,effect:Q.None},[U.Loading]:{icon:J.Mic,behaviour:K.Noninteractive,effect:Q.Busy},[U.Failed]:{icon:J.Error,behaviour:K.Click,effect:Q.None},[U.NoBrowserSupport]:{icon:J.Error,behaviour:K.Click,effect:Q.None},[U.NoAudioConsent]:{icon:J.Denied,behaviour:K.Click,effect:Q.None}},{window:Y}=P;function Z(e){let n,i,r,u,d,h,v,w,b;return{c(){n=l("main"),i=l("mic-fx"),r=f(),u=l("mic-frame"),d=f(),h=l("mic-icon"),this.c=t,m(i,"opacity",e[6][1]),m(i,"transform","rotate("+e[3][1]+"deg)"),g(h,"icon",v=e[7].icon),m(h,"opacity",e[5][1]),m(n,"width",e[0]),m(n,"height",e[0]),m(n,"transform","scale("+e[4][1]+")"),m(n,"--gradient-stop1",e[1]),m(n,"--gradient-stop2",e[2]),m(n,"--fx-rotation",e[3][1]+"deg")},m(t,o){s(t,n,o),c(n,i),c(n,r),c(n,u),c(n,d),c(n,h),w||(b=[p(Y,"mouseup",e[9]),p(Y,"keydown",e[10]),p(Y,"keyup",e[11]),p(n,"mousedown",e[8]),p(n,"touchstart",e[8]),p(n,"dragstart",e[8]),p(n,"mouseup",e[9]),p(n,"touchend",e[9],{passive:!0}),p(n,"dragend",e[9])],w=!0)},p(t,[e]){64&e&&m(i,"opacity",t[6][1]),8&e&&m(i,"transform","rotate("+t[3][1]+"deg)"),128&e&&v!==(v=t[7].icon)&&g(h,"icon",v),32&e&&m(h,"opacity",t[5][1]),1&e&&m(n,"width",t[0]),1&e&&m(n,"height",t[0]),16&e&&m(n,"transform","scale("+t[4][1]+")"),2&e&&m(n,"--gradient-stop1",t[1]),4&e&&m(n,"--gradient-stop2",t[2]),8&e&&m(n,"--fx-rotation",t[3][1]+"deg")},i:t,o:t,d(t){t&&a(n),w=!1,o(b)}}}function tt(t,e,n){let{icon:o=U.Poweron}=e,{capturekey:i=" "}=e,{size:r="6rem"}=e,{gradientstop1:c="#15e8b5"}=e,{gradientstop2:s="#4fa1f9"}=e,a=!1,l=0,u=[0,0],d=[0,0],f=[1,1],p=[0,0],h=X[o],g=null,m=0,v=0;const w=$(),b=(t,e)=>{w.dispatchEvent(new CustomEvent(t,{detail:e,composed:!0}))};!function(t){$().$$.on_mount.push(t)}((()=>{n(4,d[0]=1,d);let t=null;const e=()=>{m=v,v=(new Date).getTime();const o=v-m;h.effect===Q.Connecting&&n(5,f[0]=.25*Math.cos(v/2500*Math.PI*2)+.25,f),h.effect===Q.Busy&&n(5,f[0]=.25*Math.cos(v/1e3*Math.PI*2)+.25,f),n(4,d=C(d,.2,o)),n(5,f=C(f,.08,o)),n(6,p=C(p,.08,o)),n(3,u=C([u[0]+2.5,u[1]],.05,o)),t=requestAnimationFrame(e)};return e(),()=>cancelAnimationFrame(t)}));const y=t=>{t.preventDefault(),t.stopPropagation(),a||(n(14,a=!0),l=Date.now(),n(4,d[0]=1.35,d),n(6,p[0]=1,p),k(),h.behaviour===K.Click&&(n(3,u[0]+=720,u),null===g&&(g=window.setTimeout((()=>{n(6,p[0]=0,p),n(4,d[0]=0,d),g=null}),500))),w.onholdstart&&w.onholdstart(),b("holdstart"))},x=()=>{if(a){n(4,d[0]=1,d),n(6,p[0]=0,p),n(14,a=!1);const t={timeMs:Date.now()-l};k(),null!==g&&window.clearTimeout(g),w.onholdend&&w.onholdend(t),b("holdend",t)}},C=(t,e,n)=>(e=Math.pow(e,1e3/60/n),[t[0],t[1]=t[1]*(1-e)+t[0]*e]),k=(t=5)=>{void 0!==navigator.vibrate&&navigator.vibrate(t)};return t.$$set=t=>{"icon"in t&&n(12,o=t.icon),"capturekey"in t&&n(13,i=t.capturekey),"size"in t&&n(0,r=t.size),"gradientstop1"in t&&n(1,c=t.gradientstop1),"gradientstop2"in t&&n(2,s=t.gradientstop2)},t.$$.update=()=>{20480&t.$$.dirty&&(a||(t=>{if(h!==t)switch(n(7,h=t),t.icon){case J.Mic:n(5,f[0]=1,f)}})(X[o]))},[r,c,s,u,d,f,p,h,y,x,t=>{i&&t.key===i&&(t.repeat?(t.preventDefault(),t.stopPropagation()):y(t))},t=>{t.key===i&&x()},o,i,a]}customElements.define("holdable-button",class extends R{constructor(t){super(),this.shadowRoot.innerHTML="<style>main{position:relative;user-select:none}</style>",A(this,{target:this.shadowRoot,props:v(this.attributes),customElement:!0},tt,Z,r,{icon:12,capturekey:13,size:0,gradientstop1:1,gradientstop2:2}),t&&(t.target&&s(t.target,this,t.anchor),t.props&&(this.$set(t.props),_()))}static get observedAttributes(){return["icon","capturekey","size","gradientstop1","gradientstop2"]}get icon(){return this.$$.ctx[12]}set icon(t){this.$set({icon:t}),_()}get capturekey(){return this.$$.ctx[13]}set capturekey(t){this.$set({capturekey:t}),_()}get size(){return this.$$.ctx[0]}set size(t){this.$set({size:t}),_()}get gradientstop1(){return this.$$.ctx[1]}set gradientstop1(t){this.$set({gradientstop1:t}),_()}get gradientstop2(){return this.$$.ctx[2]}set gradientstop2(t){this.$set({gradientstop2:t}),_()}})}();
//# sourceMappingURL=holdable-button.js.map
