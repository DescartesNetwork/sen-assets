(globalThis.webpackChunksen_assets=globalThis.webpackChunksen_assets||[]).push([[58],{14058:(e,n,r)=>{"use strict";var t,_={};_.__wbindgen_placeholder__=e.exports;var a=r(58404),i=a.TextEncoder,l=a.TextDecoder,o=new Array(32).fill(void 0);function c(e){return o[e]}o.push(void 0,null,!0,!1);var s=0,d=null;function g(){return null!==d&&d.buffer===t.memory.buffer||(d=new Uint8Array(t.memory.buffer)),d}var u=new i("utf-8"),f="function"===typeof u.encodeInto?function(e,n){return u.encodeInto(e,n)}:function(e,n){var r=u.encode(e);return n.set(r),{read:e.length,written:r.length}};function b(e,n,r){if(void 0===r){var t=u.encode(e),_=n(t.length);return g().subarray(_,_+t.length).set(t),s=t.length,_}for(var a=e.length,i=n(a),l=g(),o=0;o<a;o++){var c=e.charCodeAt(o);if(c>127)break;l[i+o]=c}if(o!==a){0!==o&&(e=e.slice(o)),i=r(i,a,a=o+3*e.length);var d=g().subarray(i+o,i+a);o+=f(e,d).written}return s=o,i}var w=null;function h(){return null!==w&&w.buffer===t.memory.buffer||(w=new Int32Array(t.memory.buffer)),w}var v=o.length;function m(e){var n=c(e);return function(e){e<36||(o[e]=v,v=e)}(e),n}var p=new l("utf-8",{ignoreBOM:!0,fatal:!0});function x(e){v===o.length&&o.push(o.length+1);var n=v;return v=o[n],o[n]=e,n}function y(e,n){var r=n(1*e.length);return g().set(e,r/1),s=e.length,r}function A(e,n){return g().subarray(e/1,e/1+n)}p.decode(),e.exports.post_message_ix=function(e,n,r,_,a,i,l){var o=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),c=s,d=b(n,t.__wbindgen_malloc,t.__wbindgen_realloc),g=s,u=b(r,t.__wbindgen_malloc,t.__wbindgen_realloc),f=s,w=b(_,t.__wbindgen_malloc,t.__wbindgen_realloc),h=s,v=y(i,t.__wbindgen_malloc),p=s,x=b(l,t.__wbindgen_malloc,t.__wbindgen_realloc),A=s;return m(t.post_message_ix(o,c,d,g,u,f,w,h,a,v,p,x,A))},e.exports.post_vaa_ix=function(e,n,r,_){var a=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),i=s,l=b(n,t.__wbindgen_malloc,t.__wbindgen_realloc),o=s,c=b(r,t.__wbindgen_malloc,t.__wbindgen_realloc),d=s,g=y(_,t.__wbindgen_malloc),u=s;return m(t.post_vaa_ix(a,i,l,o,c,d,g,u))},e.exports.update_guardian_set_ix=function(e,n,r){var _=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),a=s,i=b(n,t.__wbindgen_malloc,t.__wbindgen_realloc),l=s,o=y(r,t.__wbindgen_malloc),c=s;return m(t.update_guardian_set_ix(_,a,i,l,o,c))},e.exports.set_fees_ix=function(e,n,r){var _=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),a=s,i=b(n,t.__wbindgen_malloc,t.__wbindgen_realloc),l=s,o=y(r,t.__wbindgen_malloc),c=s;return m(t.set_fees_ix(_,a,i,l,o,c))},e.exports.transfer_fees_ix=function(e,n,r){var _=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),a=s,i=b(n,t.__wbindgen_malloc,t.__wbindgen_realloc),l=s,o=y(r,t.__wbindgen_malloc),c=s;return m(t.transfer_fees_ix(_,a,i,l,o,c))},e.exports.upgrade_contract_ix=function(e,n,r,_){var a=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),i=s,l=b(n,t.__wbindgen_malloc,t.__wbindgen_realloc),o=s,c=b(r,t.__wbindgen_malloc,t.__wbindgen_realloc),d=s,g=y(_,t.__wbindgen_malloc),u=s;return m(t.upgrade_contract_ix(a,i,l,o,c,d,g,u))},e.exports.verify_signatures_ix=function(e,n,r,_,a,i){var l=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),o=s,c=b(n,t.__wbindgen_malloc,t.__wbindgen_realloc),d=s,g=b(a,t.__wbindgen_malloc,t.__wbindgen_realloc),u=s,f=y(i,t.__wbindgen_malloc),w=s;return m(t.verify_signatures_ix(l,o,c,d,r,x(_),g,u,f,w))},e.exports.guardian_set_address=function(e,n){try{var r=t.__wbindgen_add_to_stack_pointer(-16),_=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),a=s;t.guardian_set_address(r,_,a,n);var i=h()[r/4+0],l=h()[r/4+1],o=A(i,l).slice();return t.__wbindgen_free(i,1*l),o}finally{t.__wbindgen_add_to_stack_pointer(16)}},e.exports.parse_guardian_set=function(e){var n=y(e,t.__wbindgen_malloc),r=s;return m(t.parse_guardian_set(n,r))},e.exports.state_address=function(e){try{var n=t.__wbindgen_add_to_stack_pointer(-16),r=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),_=s;t.state_address(n,r,_);var a=h()[n/4+0],i=h()[n/4+1],l=A(a,i).slice();return t.__wbindgen_free(a,1*i),l}finally{t.__wbindgen_add_to_stack_pointer(16)}},e.exports.parse_state=function(e){var n=y(e,t.__wbindgen_malloc),r=s;return m(t.parse_state(n,r))},e.exports.fee_collector_address=function(e){try{var n=t.__wbindgen_add_to_stack_pointer(-16),r=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),_=s;t.fee_collector_address(n,r,_);var a=h()[n/4+0],i=h()[n/4+1],l=A(a,i).slice();return t.__wbindgen_free(a,1*i),l}finally{t.__wbindgen_add_to_stack_pointer(16)}},e.exports.claim_address=function(e,n){try{var r=t.__wbindgen_add_to_stack_pointer(-16),_=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),a=s,i=y(n,t.__wbindgen_malloc),l=s;t.claim_address(r,_,a,i,l);var o=h()[r/4+0],c=h()[r/4+1],d=A(o,c).slice();return t.__wbindgen_free(o,1*c),d}finally{t.__wbindgen_add_to_stack_pointer(16)}},e.exports.parse_posted_message=function(e){var n=y(e,t.__wbindgen_malloc),r=s;return m(t.parse_posted_message(n,r))},e.exports.parse_vaa=function(e){var n=y(e,t.__wbindgen_malloc),r=s;return m(t.parse_vaa(n,r))},e.exports.__wbindgen_json_serialize=function(e,n){var r=c(n),_=b(JSON.stringify(void 0===r?null:r),t.__wbindgen_malloc,t.__wbindgen_realloc),a=s;h()[e/4+1]=a,h()[e/4+0]=_},e.exports.__wbindgen_object_drop_ref=function(e){m(e)},e.exports.__wbindgen_json_parse=function(e,n){var r,t;return x(JSON.parse((r=e,t=n,p.decode(g().subarray(r,r+t)))))};var C=r(71633).join("/","bridge_bg.wasm"),k=r(16477).readFileSync(C),j=new WebAssembly.Module(k),O=new WebAssembly.Instance(j,_);t=O.exports,e.exports.__wasm=t},71633:e=>{"use strict";function n(e){if("string"!==typeof e)throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}function r(e,n){for(var r,t="",_=0,a=-1,i=0,l=0;l<=e.length;++l){if(l<e.length)r=e.charCodeAt(l);else{if(47===r)break;r=47}if(47===r){if(a===l-1||1===i);else if(a!==l-1&&2===i){if(t.length<2||2!==_||46!==t.charCodeAt(t.length-1)||46!==t.charCodeAt(t.length-2))if(t.length>2){var o=t.lastIndexOf("/");if(o!==t.length-1){-1===o?(t="",_=0):_=(t=t.slice(0,o)).length-1-t.lastIndexOf("/"),a=l,i=0;continue}}else if(2===t.length||1===t.length){t="",_=0,a=l,i=0;continue}n&&(t.length>0?t+="/..":t="..",_=2)}else t.length>0?t+="/"+e.slice(a+1,l):t=e.slice(a+1,l),_=l-a-1;a=l,i=0}else 46===r&&-1!==i?++i:i=-1}return t}var t={resolve:function(){for(var e,t="",_=!1,a=arguments.length-1;a>=-1&&!_;a--){var i;a>=0?i=arguments[a]:(void 0===e&&(e=process.cwd()),i=e),n(i),0!==i.length&&(t=i+"/"+t,_=47===i.charCodeAt(0))}return t=r(t,!_),_?t.length>0?"/"+t:"/":t.length>0?t:"."},normalize:function(e){if(n(e),0===e.length)return".";var t=47===e.charCodeAt(0),_=47===e.charCodeAt(e.length-1);return 0!==(e=r(e,!t)).length||t||(e="."),e.length>0&&_&&(e+="/"),t?"/"+e:e},isAbsolute:function(e){return n(e),e.length>0&&47===e.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var e,r=0;r<arguments.length;++r){var _=arguments[r];n(_),_.length>0&&(void 0===e?e=_:e+="/"+_)}return void 0===e?".":t.normalize(e)},relative:function(e,r){if(n(e),n(r),e===r)return"";if((e=t.resolve(e))===(r=t.resolve(r)))return"";for(var _=1;_<e.length&&47===e.charCodeAt(_);++_);for(var a=e.length,i=a-_,l=1;l<r.length&&47===r.charCodeAt(l);++l);for(var o=r.length-l,c=i<o?i:o,s=-1,d=0;d<=c;++d){if(d===c){if(o>c){if(47===r.charCodeAt(l+d))return r.slice(l+d+1);if(0===d)return r.slice(l+d)}else i>c&&(47===e.charCodeAt(_+d)?s=d:0===d&&(s=0));break}var g=e.charCodeAt(_+d);if(g!==r.charCodeAt(l+d))break;47===g&&(s=d)}var u="";for(d=_+s+1;d<=a;++d)d!==a&&47!==e.charCodeAt(d)||(0===u.length?u+="..":u+="/..");return u.length>0?u+r.slice(l+s):(l+=s,47===r.charCodeAt(l)&&++l,r.slice(l))},_makeLong:function(e){return e},dirname:function(e){if(n(e),0===e.length)return".";for(var r=e.charCodeAt(0),t=47===r,_=-1,a=!0,i=e.length-1;i>=1;--i)if(47===(r=e.charCodeAt(i))){if(!a){_=i;break}}else a=!1;return-1===_?t?"/":".":t&&1===_?"//":e.slice(0,_)},basename:function(e,r){if(void 0!==r&&"string"!==typeof r)throw new TypeError('"ext" argument must be a string');n(e);var t,_=0,a=-1,i=!0;if(void 0!==r&&r.length>0&&r.length<=e.length){if(r.length===e.length&&r===e)return"";var l=r.length-1,o=-1;for(t=e.length-1;t>=0;--t){var c=e.charCodeAt(t);if(47===c){if(!i){_=t+1;break}}else-1===o&&(i=!1,o=t+1),l>=0&&(c===r.charCodeAt(l)?-1===--l&&(a=t):(l=-1,a=o))}return _===a?a=o:-1===a&&(a=e.length),e.slice(_,a)}for(t=e.length-1;t>=0;--t)if(47===e.charCodeAt(t)){if(!i){_=t+1;break}}else-1===a&&(i=!1,a=t+1);return-1===a?"":e.slice(_,a)},extname:function(e){n(e);for(var r=-1,t=0,_=-1,a=!0,i=0,l=e.length-1;l>=0;--l){var o=e.charCodeAt(l);if(47!==o)-1===_&&(a=!1,_=l+1),46===o?-1===r?r=l:1!==i&&(i=1):-1!==r&&(i=-1);else if(!a){t=l+1;break}}return-1===r||-1===_||0===i||1===i&&r===_-1&&r===t+1?"":e.slice(r,_)},format:function(e){if(null===e||"object"!==typeof e)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return function(e,n){var r=n.dir||n.root,t=n.base||(n.name||"")+(n.ext||"");return r?r===n.root?r+t:r+e+t:t}("/",e)},parse:function(e){n(e);var r={root:"",dir:"",base:"",ext:"",name:""};if(0===e.length)return r;var t,_=e.charCodeAt(0),a=47===_;a?(r.root="/",t=1):t=0;for(var i=-1,l=0,o=-1,c=!0,s=e.length-1,d=0;s>=t;--s)if(47!==(_=e.charCodeAt(s)))-1===o&&(c=!1,o=s+1),46===_?-1===i?i=s:1!==d&&(d=1):-1!==i&&(d=-1);else if(!c){l=s+1;break}return-1===i||-1===o||0===d||1===d&&i===o-1&&i===l+1?-1!==o&&(r.base=r.name=0===l&&a?e.slice(1,o):e.slice(l,o)):(0===l&&a?(r.name=e.slice(1,i),r.base=e.slice(1,o)):(r.name=e.slice(l,i),r.base=e.slice(l,o)),r.ext=e.slice(i,o)),l>0?r.dir=e.slice(0,l-1):a&&(r.dir="/"),r},sep:"/",delimiter:":",win32:null,posix:null};t.posix=t,e.exports=t},16477:()=>{}}]);
//# sourceMappingURL=58.1b72fd65.chunk.js.map