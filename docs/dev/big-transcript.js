!function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function i(t){t.forEach(n)}function o(t){return"function"==typeof t}function r(t,n){return t!=t?n==n:t!==n}function s(t,n){t.appendChild(n)}function c(t,n,e){t.insertBefore(n,e||null)}function a(t){t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function u(t){return document.createTextNode(t)}function d(){return u(" ")}function f(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function p(t,n,e,i){t.style.setProperty(n,e,i?"important":"")}function m(t){const n={};for(const e of t)n[e.name]=e.value;return n}let g;function h(t){g=t}function $(){if(!g)throw new Error("Function called outside component initialization");return g}const b=[],y=[],v=[],E=[],_=Promise.resolve();let x=!1;function T(t){v.push(t)}let w=!1;const k=new Set;function F(){if(!w){w=!0;do{for(let t=0;t<b.length;t+=1){const n=b[t];h(n),C(n.$$)}for(h(null),b.length=0;y.length;)y.pop()();for(let t=0;t<v.length;t+=1){const n=v[t];k.has(n)||(k.add(n),n())}v.length=0}while(b.length);for(;E.length;)E.pop()();x=!1,w=!1,k.clear()}}function C(t){if(null!==t.fragment){t.update(),i(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(T)}}const I=new Set;function L(t,n){-1===t.$$.dirty[0]&&(b.push(t),x||(x=!0,_.then(F)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function S(r,s,c,l,u,d,f=[-1]){const p=g;h(r);const m=r.$$={fragment:null,ctx:null,props:d,update:t,not_equal:u,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:[]),callbacks:e(),dirty:f,skip_bound:!1};let $=!1;if(m.ctx=c?c(r,s.props||{},((t,n,...e)=>{const i=e.length?e[0]:n;return m.ctx&&u(m.ctx[t],m.ctx[t]=i)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](i),$&&L(r,t)),n})):[],m.update(),$=!0,i(m.before_update),m.fragment=!!l&&l(m.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);m.fragment&&m.fragment.l(t),t.forEach(a)}else m.fragment&&m.fragment.c();s.intro&&((b=r.$$.fragment)&&b.i&&(I.delete(b),b.i(y))),function(t,e,r,s){const{fragment:c,on_mount:a,on_destroy:l,after_update:u}=t.$$;c&&c.m(e,r),s||T((()=>{const e=a.map(n).filter(o);l?l.push(...e):i(e),t.$$.on_mount=[]})),u.forEach(T)}(r,s.target,s.anchor,s.customElement),F()}var b,y;h(p)}let z;function A(t,n,e){const i=t.slice();return i[9]=n[e],i}function B(t){let n,e,i,o,r,p,m,g,h=t[9].word+"";return{c(){n=l("div"),e=l("div"),i=d(),o=l("div"),r=u(h),p=u(" "),m=d(),f(e,"class","TransscriptItemBgDiv"),f(o,"class","TransscriptItemContent"),f(n,"class",g=`TranscriptItem ${null!==t[9].entityType?"Entity":""} ${t[9].isFinal?"Final":""} ${t[9].entityType??""}`)},m(t,a){c(t,n,a),s(n,e),s(n,i),s(n,o),s(o,r),s(o,p),s(n,m)},p(t,e){1&e&&h!==(h=t[9].word+"")&&function(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}(r,h),1&e&&g!==(g=`TranscriptItem ${null!==t[9].entityType?"Entity":""} ${t[9].isFinal?"Final":""} ${t[9].entityType??""}`)&&f(n,"class",g)},d(t){t&&a(n)}}}function N(n){let e,i,o,r,u,m,g=n[0],h=[];for(let t=0;t<g.length;t+=1)h[t]=B(A(n,g,t));return{c(){e=l("div"),i=l("div"),i.textContent="Test test",o=d(),r=l("div");for(let t=0;t<h.length;t+=1)h[t].c();this.c=t,p(i,"color","red"),p(r,"margin-bottom","1.5rem"),f(e,"class","BigTranscript")},m(t,a){c(t,e,a),s(e,i),s(e,o),s(e,r);for(let t=0;t<h.length;t+=1)h[t].m(r,null);var l,d,f,p;u||(l=window,d="message",f=n[2],l.addEventListener(d,f,p),m=()=>l.removeEventListener(d,f,p),u=!0)},p(t,[n]){if(1&n){let e;for(g=t[0],e=0;e<g.length;e+=1){const i=A(t,g,e);h[e]?h[e].p(i,n):(h[e]=B(i),h[e].c(),h[e].m(r,null))}for(;e<h.length;e+=1)h[e].d(1);h.length=g.length}},i:t,o:t,d(t){t&&a(e),function(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}(h,t),u=!1,m()}}}function M(t,n,e){const i=$(),o=(t,n)=>{i.dispatchEvent(new CustomEvent(t,{detail:n,composed:!0}))};o("debug","big-transcript.init 1"),o("debug","big-transcript.init 2");let r=[{word:"Initializing",entityType:null,isFinal:!0,serialNumber:1}];const s=t=>{o("debug","big-transcript.onSegmentUpdate 1"),void 0!==t&&(o("debug","big-transcript.onSegmentUpdate 2"),t.isFinal,e(0,r=[]),t.words.forEach((t=>{e(0,r[t.index]={word:t.value,serialNumber:t.index,entityType:null,isFinal:t.isFinal},r)})),t.entities.forEach((t=>{r.slice(t.startPosition,t.endPosition).forEach((n=>{n.entityType=t.type,n.isFinal=t.isFinal}))})),e(0,r=r.flat()))};var c;i.onSegmentUpdate=s,c=()=>{o("debug","big-transcript.onmount 1");const t=t=>s(t.detail);return i.addEventListener("segment-update",t),o("debug","big-transcript.onmount 2"),()=>{cancelAnimationFrame(null),i.removeEventListener("segment-update",t)}},$().$$.on_mount.push(c);return[r,s,t=>{"segment-update"===t.data.type&&s(t.data.segment)}]}"function"==typeof HTMLElement&&(z=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(n).filter(o);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,n,e){this[t]=e}disconnectedCallback(){i(this.$$.on_disconnect)}$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(i(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});customElements.define("big-transcript",class extends z{constructor(t){super(),this.shadowRoot.innerHTML="<style>.BigTranscript{position:relative;user-select:none}.TranscriptItem{position:relative;display:inline-block;margin-left:0.25rem}.Entity{color:cyan}.TransscriptItemContent{z-index:1}.TransscriptItemBgDiv{position:absolute;box-sizing:content-box;width:100%;height:100%;margin:-0.4rem -0.6rem;padding:0.4rem 0.6rem;background-color:#000;z-index:-1}</style>",S(this,{target:this.shadowRoot,props:m(this.attributes),customElement:!0},M,N,r,{}),t&&t.target&&c(t.target,this,t.anchor)}})}();
//# sourceMappingURL=big-transcript.js.map
