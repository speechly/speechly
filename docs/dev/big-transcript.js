!function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function o(){return Object.create(null)}function i(t){t.forEach(n)}function s(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e}const c="undefined"!=typeof window;let a=c?()=>window.performance.now():()=>Date.now(),l=c?t=>requestAnimationFrame(t):t;const f=new Set;function u(t){f.forEach((e=>{e.c(t)||(f.delete(e),e.f())})),0!==f.size&&l(u)}function d(t){let e;return 0===f.size&&l(u),{promise:new Promise((n=>{f.add(e={c:t,f:n})})),abort(){f.delete(e)}}}function h(t,e){t.appendChild(e)}function m(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function g(t){return document.createElement(t)}function $(t){return document.createTextNode(t)}function v(){return $(" ")}function y(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function _(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}function b(t,e,n){t.classList[n?"add":"remove"](e)}function w(t){const e={};for(const n of t)e[n.name]=n.value;return e}const E=new Set;let x,T=0;function k(t,e,n,o,i,s,r,c=0){const a=16.666/o;let l="{\n";for(let t=0;t<=1;t+=a){const o=e+(n-e)*s(t);l+=100*t+`%{${r(o,1-o)}}\n`}const f=l+`100% {${r(n,1-n)}}\n}`,u=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(f)}_${c}`,d=t.ownerDocument;E.add(d);const h=d.__svelte_stylesheet||(d.__svelte_stylesheet=d.head.appendChild(g("style")).sheet),m=d.__svelte_rules||(d.__svelte_rules={});m[u]||(m[u]=!0,h.insertRule(`@keyframes ${u} ${f}`,h.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${u} ${o}ms linear ${i}ms 1 both`,T+=1,u}function z(t,e){const n=(t.style.animation||"").split(", "),o=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),i=n.length-o.length;i&&(t.style.animation=o.join(", "),T-=i,T||l((()=>{T||(E.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),E.clear())})))}function C(t){x=t}function F(){if(!x)throw new Error("Function called outside component initialization");return x}const P=[],L=[],A=[],S=[],I=Promise.resolve();let M=!1;function O(t){A.push(t)}let D=!1;const R=new Set;function B(){if(!D){D=!0;do{for(let t=0;t<P.length;t+=1){const e=P[t];C(e),j(e.$$)}for(C(null),P.length=0;L.length;)L.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];R.has(e)||(R.add(e),e())}A.length=0}while(P.length);for(;S.length;)S.pop()();M=!1,D=!1,R.clear()}}function j(t){if(null!==t.fragment){t.update(),i(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(O)}}let N;function H(){return N||(N=Promise.resolve(),N.then((()=>{N=null}))),N}function q(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const U=new Set;let G;function J(t,e){t&&t.i&&(U.delete(t),t.i(e))}function K(t,e,n,o){if(t&&t.o){if(U.has(t))return;U.add(t),G.c.push((()=>{U.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}const Q={duration:0};function V(n,o,i){let r,c,l=o(n,i),f=!1,u=0;function h(){r&&z(n,r)}function m(){const{delay:o=0,duration:i=300,easing:s=e,tick:m=t,css:p}=l||Q;p&&(r=k(n,0,1,i,o,s,p,u++)),m(0,1);const g=a()+o,$=g+i;c&&c.abort(),f=!0,O((()=>q(n,!0,"start"))),c=d((t=>{if(f){if(t>=$)return m(1,0),q(n,!0,"end"),h(),f=!1;if(t>=g){const e=s((t-g)/i);m(e,1-e)}}return f}))}let p=!1;return{start(){p||(z(n),s(l)?(l=l(),H().then(m)):m())},invalidate(){p=!1},end(){f&&(h(),f=!1)}}}function W(t,e){-1===t.$$.dirty[0]&&(P.push(t),M||(M=!0,I.then(B)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function X(e,r,c,a,l,f,u=[-1]){const d=x;C(e);const h=e.$$={fragment:null,ctx:null,props:f,update:t,not_equal:l,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:o(),dirty:u,skip_bound:!1};let m=!1;if(h.ctx=c?c(e,r.props||{},((t,n,...o)=>{const i=o.length?o[0]:n;return h.ctx&&l(h.ctx[t],h.ctx[t]=i)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](i),m&&W(e,t)),n})):[],h.update(),m=!0,i(h.before_update),h.fragment=!!a&&a(h.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);h.fragment&&h.fragment.l(t),t.forEach(p)}else h.fragment&&h.fragment.c();r.intro&&J(e.$$.fragment),function(t,e,o,r){const{fragment:c,on_mount:a,on_destroy:l,after_update:f}=t.$$;c&&c.m(e,o),r||O((()=>{const e=a.map(n).filter(s);l?l.push(...e):i(e),t.$$.on_mount=[]})),f.forEach(O)}(e,r.target,r.anchor,r.customElement),B()}C(d)}let Y;function Z(t){return function(e,n){if(!e.hasOwnProperty("ownerDocument")){Object.defineProperty(e,"ownerDocument",{get:function(){return e.parentElement}});let t=e;for(;t.parentElement;)t=t.parentElement;e.parentElement.head=t}return t(e,n)}}function tt(t){return t<.5?4*t*t*t:.5*Math.pow(2*t-2,3)+1}"function"==typeof HTMLElement&&(Y=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(n).filter(s);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,n){this[t]=n}disconnectedCallback(){i(this.$$.on_disconnect)}$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});const et=[0,1];function nt(t,e,n,o){if(e<n)return t[0];if(e>o)return t[t.length-1];let i=(o-n)/(t.length-1);if(i<=0)return t[0];let s=(e-n)/i,r=Math.floor(s),c=Math.ceil(s),a=s-r;return(1-a)*t[r]+a*t[c]}function ot(t,e,n){const o=t.slice();return o[15]=e[n],o}function it(n){let o,r,c,l,f=n[4],u=[];for(let t=0;t<f.length;t+=1)u[t]=st(ot(n,f,t));return{c(){o=g("div");for(let t=0;t<u.length;t+=1)u[t].c();_(o,"margin-bottom","1.5rem")},m(t,e){m(t,o,e);for(let t=0;t<u.length;t+=1)u[t].m(o,null);l=!0},p(t,e){if(528&e){let n;for(f=t[4],n=0;n<f.length;n+=1){const i=ot(t,f,n);u[n]?(u[n].p(i,e),J(u[n],1)):(u[n]=st(i),u[n].c(),J(u[n],1),u[n].m(o,null))}for(;n<u.length;n+=1)u[n].d(1);u.length=f.length}},i(t){if(!l){for(let t=0;t<f.length;t+=1)J(u[t]);O((()=>{c&&c.end(1),r||(r=V(o,n[6],{})),r.start()})),l=!0}},o(f){r&&r.invalidate(),c=function(n,o,r){let c,l=o(n,r),f=!0;const u=G;function h(){const{delay:o=0,duration:s=300,easing:r=e,tick:h=t,css:m}=l||Q;m&&(c=k(n,1,0,s,o,r,m));const p=a()+o,g=p+s;O((()=>q(n,!1,"start"))),d((t=>{if(f){if(t>=g)return h(0,1),q(n,!1,"end"),--u.r||i(u.c),!1;if(t>=p){const e=r((t-p)/s);h(1-e,e)}}return f}))}return u.r+=1,s(l)?H().then((()=>{l=l(),h()})):h(),{end(t){t&&l.tick&&l.tick(1,0),f&&(c&&z(n,c),f=!1)}}}(o,n[6],{delay:2e3}),l=!1},d(t){t&&p(o),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(u,t),t&&c&&c.end()}}}function st(e){let n,o,i,s,r,c,a,l,f,u=e[15].word+"";return{c(){n=g("div"),o=g("div"),s=v(),r=g("div"),c=$(u),a=$(" "),l=v(),y(o,"class","TransscriptItemBgDiv"),y(r,"class","TransscriptItemContent"),y(n,"class",f="TranscriptItem "+e[9](e[15])),b(n,"Entity",null!==e[15].entityType),b(n,"Final",e[15].isFinal)},m(t,e){m(t,n,e),h(n,o),h(n,s),h(n,r),h(r,c),h(r,a),h(n,l)},p(t,e){16&e&&u!==(u=t[15].word+"")&&function(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}(c,u),16&e&&f!==(f="TranscriptItem "+t[9](t[15]))&&y(n,"class",f),16&e&&b(n,"Entity",null!==t[15].entityType),16&e&&b(n,"Final",t[15].isFinal)},i(t){i||O((()=>{i=V(o,e[7],{}),i.start()}))},o:t,d(t){t&&p(n)}}}function rt(e){let n,o,s,r,c,a,l,f=e[5]&&it(e);return{c(){n=g("main"),o=g("div"),f&&f.c(),s=v(),r=g("link"),this.c=t,y(o,"class","BigTranscript"),_(n,"--voffset",e[1]),_(n,"--hoffset",e[2]),_(n,"--fontsize",e[3]),b(n,"placementTop","top"===e[0]),y(r,"href","https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700&display=swap"),y(r,"rel","stylesheet")},m(t,i){var u,d,p,g;m(t,n,i),h(n,o),f&&f.m(o,null),m(t,s,i),h(document.head,r),c=!0,a||(u=window,d="message",p=e[10],u.addEventListener(d,p,g),l=()=>u.removeEventListener(d,p,g),a=!0)},p(t,[e]){t[5]?f?(f.p(t,e),32&e&&J(f,1)):(f=it(t),f.c(),J(f,1),f.m(o,null)):f&&(G={r:0,c:[],p:G},K(f,1,1,(()=>{f=null})),G.r||i(G.c),G=G.p),(!c||2&e)&&_(n,"--voffset",t[1]),(!c||4&e)&&_(n,"--hoffset",t[2]),(!c||8&e)&&_(n,"--fontsize",t[3]),1&e&&b(n,"placementTop","top"===t[0])},i(t){c||(J(f),c=!0)},o(t){K(f),c=!1},d(t){t&&p(n),f&&f.d(),t&&p(s),p(r),a=!1,l()}}}function ct(t,e,n){let{placement:o}=e,{voffset:i="3rem"}=e,{hoffset:s="2rem"}=e,{fontsize:r="1.5rem"}=e;const c=F(),a=Z(((t,{delay:e=0,duration:n=400})=>({delay:e,duration:n,easing:tt,css:t=>`\n        opacity: ${nt(et,t,0,1)};\n        max-height: ${10*nt(et,t,0,.6)}rem;\n        margin-bottom: ${1.5*nt(et,t,0,.6)}rem;\n      `}))),l=Z(((t,{delay:e=0,duration:n=350})=>({delay:e,duration:n,css:t=>`\n        max-width: ${10*nt(et,t,0,1)}rem;\n      `})));let f=[],u=!1;const d=t=>{void 0!==t&&(n(5,u=!t.isFinal),n(4,f=[]),t.words.forEach((t=>{n(4,f[t.index]={word:t.value,serialNumber:t.index,entityType:null,isFinal:t.isFinal},f)})),t.entities.forEach((t=>{for(let e=t.startPosition+1;e<t.endPosition;e++)delete f[e];n(4,f[t.startPosition].word=t.value,f),n(4,f[t.startPosition].entityType=t.type,f),n(4,f[t.startPosition].isFinal=t.isFinal,f)})),n(4,f=f.flat()))};c.onSegmentUpdate=d;const h=t=>{var e,n;e="debug",n="big-transcript.ping 1",c.dispatchEvent(new CustomEvent(e,{detail:n,composed:!0}))};var m;m=()=>{const t=t=>d(t.detail);return c.addEventListener("speechsegment",t),c.addEventListener("ping",h),()=>{cancelAnimationFrame(null),c.removeEventListener("ping",h),c.removeEventListener("speechsegment",t)}},F().$$.on_mount.push(m);return t.$$set=t=>{"placement"in t&&n(0,o=t.placement),"voffset"in t&&n(1,i=t.voffset),"hoffset"in t&&n(2,s=t.hoffset),"fontsize"in t&&n(3,r=t.fontsize)},[o,i,s,r,f,u,a,l,d,t=>t.entityType||"",t=>{"speechsegment"===t.data.type&&d(t.data.segment)}]}customElements.define("big-transcript",class extends Y{constructor(t){super(),this.shadowRoot.innerHTML="<style>.BigTranscript{position:relative;user-select:none;font-family:'Saira Condensed', sans-serif;text-transform:uppercase;color:#fff;font-size:var(--fontsize);line-height:120%}.TranscriptItem{position:relative;display:inline-block;margin-left:0.25em}.Entity{color:cyan}.TransscriptItemContent{z-index:1}.TransscriptItemBgDiv{position:absolute;box-sizing:content-box;width:100%;height:100%;margin:-0.4rem -0.6rem;padding:0.4rem 0.6rem;background-color:#000;z-index:-1}.placementTop{position:fixed;top:0;left:0;right:0;bottom:0;margin:var(--voffset) var(--hoffset) 0 var(--hoffset);z-index:50;pointer-events:none}</style>",X(this,{target:this.shadowRoot,props:w(this.attributes),customElement:!0},ct,rt,r,{placement:0,voffset:1,hoffset:2,fontsize:3}),t&&(t.target&&m(t.target,this,t.anchor),t.props&&(this.$set(t.props),B()))}static get observedAttributes(){return["placement","voffset","hoffset","fontsize"]}get placement(){return this.$$.ctx[0]}set placement(t){this.$set({placement:t}),B()}get voffset(){return this.$$.ctx[1]}set voffset(t){this.$set({voffset:t}),B()}get hoffset(){return this.$$.ctx[2]}set hoffset(t){this.$set({hoffset:t}),B()}get fontsize(){return this.$$.ctx[3]}set fontsize(t){this.$set({fontsize:t}),B()}})}();
//# sourceMappingURL=big-transcript.js.map
