"use strict";(globalThis.webpackChunksen_assets=globalThis.webpackChunksen_assets||[]).push([[455],{48455:(_,n,e)=>{e.a(_,(async _=>{e.r(n),e.d(n,{__wbindgen_json_parse:()=>r.t$,approval_authority_address:()=>r.W,complete_transfer_native_ix:()=>r.kS,complete_transfer_wrapped_ix:()=>r.uZ,complete_transfer_wrapped_meta_ix:()=>r.yQ,emitter_address:()=>r.y0,parse_endpoint_registration:()=>r.Dy,parse_wrapped_meta:()=>r.oF,register_chain_ix:()=>r.dg,spl_meta_address:()=>r.$g,transfer_native_ix:()=>r.uG,transfer_wrapped_ix:()=>r.uQ,upgrade_contract_ix:()=>r.hr,wrapped_address:()=>r.Np,wrapped_meta_address:()=>r.OK});var r=e(99955),a=_([r]);r=(a.then?await a:a)[0]}))},99955:(_,n,e)=>{e.a(_,(async r=>{e.d(n,{uG:()=>m,uQ:()=>p,kS:()=>v,uZ:()=>y,yQ:()=>h,hr:()=>x,dg:()=>k,y0:()=>A,W:()=>O,Np:()=>Q,OK:()=>j,$g:()=>C,oF:()=>E,Dy:()=>I,t$:()=>N});var a=e(50486);_=e.hmd(_);var l=r([a]);a=(l.then?await l:l)[0];var i=new("undefined"===typeof TextDecoder?(0,_.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});i.decode();var t=null;function d(){return null!==t&&t.buffer===a.memory.buffer||(t=new Uint8Array(a.memory.buffer)),t}var o=new Array(32).fill(void 0);o.push(void 0,null,!0,!1);var c=o.length;var g=0,w=new("undefined"===typeof TextEncoder?(0,_.require)("util").TextEncoder:TextEncoder)("utf-8"),b="function"===typeof w.encodeInto?function(_,n){return w.encodeInto(_,n)}:function(_,n){var e=w.encode(_);return n.set(e),{read:_.length,written:e.length}};function u(_,n,e){if(void 0===e){var r=w.encode(_),a=n(r.length);return d().subarray(a,a+r.length).set(r),g=r.length,a}for(var l=_.length,i=n(l),t=d(),o=0;o<l;o++){var c=_.charCodeAt(o);if(c>127)break;t[i+o]=c}if(o!==l){0!==o&&(_=_.slice(o)),i=e(i,l,l=o+3*_.length);var u=d().subarray(i+o,i+l);o+=b(_,u).written}return g=o,i}function s(_,n){var e=n(1*_.length);return d().set(_,e/1),g=_.length,e}function f(_){var n=function(_){return o[_]}(_);return function(_){_<36||(o[_]=c,c=_)}(_),n}function m(_,n,e,r,l,i,t,d,o){var c=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),w=g,b=u(n,a.__wbindgen_malloc,a.__wbindgen_realloc),m=g,p=u(e,a.__wbindgen_malloc,a.__wbindgen_realloc),v=g,y=u(r,a.__wbindgen_malloc,a.__wbindgen_realloc),h=g,x=u(l,a.__wbindgen_malloc,a.__wbindgen_realloc),k=g,T=u(i,a.__wbindgen_malloc,a.__wbindgen_realloc),D=g,$=s(d,a.__wbindgen_malloc),A=g;return f(a.transfer_native_ix(c,w,b,m,p,v,y,h,x,k,T,D,t,$,A,o))}function p(_,n,e,r,l,i,t,d,o,c,w,b){var m=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),p=g,v=u(n,a.__wbindgen_malloc,a.__wbindgen_realloc),y=g,h=u(e,a.__wbindgen_malloc,a.__wbindgen_realloc),x=g,k=u(r,a.__wbindgen_malloc,a.__wbindgen_realloc),T=g,D=u(l,a.__wbindgen_malloc,a.__wbindgen_realloc),$=g,A=u(i,a.__wbindgen_malloc,a.__wbindgen_realloc),O=g,Q=s(d,a.__wbindgen_malloc),j=g,C=s(o,a.__wbindgen_malloc),E=g,I=s(w,a.__wbindgen_malloc),N=g;return f(a.transfer_wrapped_ix(m,p,v,y,h,x,k,T,D,$,A,O,t,Q,j,C,E,c,I,N,b))}function v(_,n,e,r,l){var i=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),t=g,d=u(n,a.__wbindgen_malloc,a.__wbindgen_realloc),o=g,c=u(e,a.__wbindgen_malloc,a.__wbindgen_realloc),w=g,b=u(r,a.__wbindgen_malloc,a.__wbindgen_realloc),m=g,p=s(l,a.__wbindgen_malloc),v=g;return f(a.complete_transfer_native_ix(i,t,d,o,c,w,b,m,p,v))}function y(_,n,e,r,l){var i=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),t=g,d=u(n,a.__wbindgen_malloc,a.__wbindgen_realloc),o=g,c=u(e,a.__wbindgen_malloc,a.__wbindgen_realloc),w=g,b=u(r,a.__wbindgen_malloc,a.__wbindgen_realloc),m=g,p=s(l,a.__wbindgen_malloc),v=g;return f(a.complete_transfer_wrapped_ix(i,t,d,o,c,w,b,m,p,v))}function h(_,n,e,r){var l=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),i=g,t=u(n,a.__wbindgen_malloc,a.__wbindgen_realloc),d=g,o=u(e,a.__wbindgen_malloc,a.__wbindgen_realloc),c=g,w=s(r,a.__wbindgen_malloc),b=g;return f(a.complete_transfer_wrapped_meta_ix(l,i,t,d,o,c,w,b))}function x(_,n,e,r,l){var i=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),t=g,d=u(n,a.__wbindgen_malloc,a.__wbindgen_realloc),o=g,c=u(e,a.__wbindgen_malloc,a.__wbindgen_realloc),w=g,b=u(r,a.__wbindgen_malloc,a.__wbindgen_realloc),m=g,p=s(l,a.__wbindgen_malloc),v=g;return f(a.upgrade_contract_ix(i,t,d,o,c,w,b,m,p,v))}function k(_,n,e,r){var l=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),i=g,t=u(n,a.__wbindgen_malloc,a.__wbindgen_realloc),d=g,o=u(e,a.__wbindgen_malloc,a.__wbindgen_realloc),c=g,w=s(r,a.__wbindgen_malloc),b=g;return f(a.register_chain_ix(l,i,t,d,o,c,w,b))}var T=null;function D(){return null!==T&&T.buffer===a.memory.buffer||(T=new Int32Array(a.memory.buffer)),T}function $(_,n){return d().subarray(_/1,_/1+n)}function A(_){try{var n=a.__wbindgen_add_to_stack_pointer(-16),e=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),r=g;a.emitter_address(n,e,r);var l=D()[n/4+0],i=D()[n/4+1],t=$(l,i).slice();return a.__wbindgen_free(l,1*i),t}finally{a.__wbindgen_add_to_stack_pointer(16)}}function O(_){try{var n=a.__wbindgen_add_to_stack_pointer(-16),e=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),r=g;a.approval_authority_address(n,e,r);var l=D()[n/4+0],i=D()[n/4+1],t=$(l,i).slice();return a.__wbindgen_free(l,1*i),t}finally{a.__wbindgen_add_to_stack_pointer(16)}}function Q(_,n,e,r){try{var l=a.__wbindgen_add_to_stack_pointer(-16),i=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),t=g,d=s(n,a.__wbindgen_malloc),o=g,c=s(r,a.__wbindgen_malloc),w=g;a.wrapped_address(l,i,t,d,o,e,c,w);var b=D()[l/4+0],f=D()[l/4+1],m=$(b,f).slice();return a.__wbindgen_free(b,1*f),m}finally{a.__wbindgen_add_to_stack_pointer(16)}}function j(_,n){try{var e=a.__wbindgen_add_to_stack_pointer(-16),r=u(_,a.__wbindgen_malloc,a.__wbindgen_realloc),l=g,i=s(n,a.__wbindgen_malloc),t=g;a.wrapped_meta_address(e,r,l,i,t);var d=D()[e/4+0],o=D()[e/4+1],c=$(d,o).slice();return a.__wbindgen_free(d,1*o),c}finally{a.__wbindgen_add_to_stack_pointer(16)}}function C(_){try{var n=a.__wbindgen_add_to_stack_pointer(-16),e=s(_,a.__wbindgen_malloc),r=g;a.spl_meta_address(n,e,r);var l=D()[n/4+0],i=D()[n/4+1],t=$(l,i).slice();return a.__wbindgen_free(l,1*i),t}finally{a.__wbindgen_add_to_stack_pointer(16)}}function E(_){var n=s(_,a.__wbindgen_malloc),e=g;return f(a.parse_wrapped_meta(n,e))}function I(_){var n=s(_,a.__wbindgen_malloc),e=g;return f(a.parse_endpoint_registration(n,e))}function N(_,n){var e,r;return function(_){c===o.length&&o.push(o.length+1);var n=c;return c=o[n],o[n]=_,n}(JSON.parse((e=_,r=n,i.decode(d().subarray(e,e+r)))))}}))},50486:(_,n,e)=>{var r=([r])=>e.v(n,_.id,"0fce022de12bcc8ed2c0",{"./nft_bridge_bg.js":{__wbindgen_json_parse:r.t$}});e.a(_,(_=>{var n=_([e(99955)]);return n.then?n.then(r):r(n)}),1)}}]);
//# sourceMappingURL=455.074981f7.chunk.js.map