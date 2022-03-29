"use strict";(globalThis.webpackChunksen_assets=globalThis.webpackChunksen_assets||[]).push([[182],{60980:(e,t,s)=>{s.d(t,{Z:()=>i});var a=s(63805);const n={spltAddress:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",splataAddress:"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"},r={devnet:{...n,node:"https://api.devnet.solana.com",sntrAddress:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",sntrPoolAddress:"3EUPL7YQLbU6DNU5LZeQeHPXTf1MigJ2yASXA9rH5Ku4",swapAddress:"4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF",taxmanAddress:"8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9"},testnet:{...n,node:"https://api.testnet.solana.com",sntrAddress:"",sntrPoolAddress:"",swapAddress:"",taxmanAddress:""},mainnet:{...n,node:"https://sentre.genesysgo.net",sntrAddress:"SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M",sntrPoolAddress:"Aa3WZX7Xunfebp2MuAcz9CNw8TYTDL7mVrmb11rjyVm6",swapAddress:"SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV",taxmanAddress:"9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e"}};const d="sen_assets",l={[d]:{url:"https://descartesnetwork.github.io/sen-assets/index.js",appId:d,name:"Sen Assets",author:{name:"Sentre",email:"hi@sentre.io"},tags:"dapps,sentre".split(",").map((e=>e.trim())),description:"To manage your SPL tokens by many advanced functions",verified:!1}},o={development:{defaultAppId:d,extra:l,senreg:"https://descartesnetwork.github.io/senreg/register.json"},staging:{defaultAppId:d,extra:l,senreg:"https://descartesnetwork.github.io/senreg/register.json"},production:{defaultAppId:d,extra:{},senreg:"https://descartesnetwork.github.io/senreg/register.json"}},c={devnet:{baseURL:"https://stat-dev.sentre.io"},testnet:{baseURL:"https://stat-dev.sentre.io"},mainnet:{baseURL:"https://stat.sentre.io"}},i={sol:r[a.ef],register:o[a.OB],stat:c[a.ef]}},64182:(e,t,s)=>{s.r(t),s.d(t,{AccountProvider:()=>x,MintProvider:()=>Z,PoolProvider:()=>f,UIProvider:()=>o,WalletProvider:()=>m,useAccount:()=>I,useMint:()=>W,usePool:()=>y,useUI:()=>u,useWallet:()=>v,withAccount:()=>k,withMint:()=>R,withPool:()=>h,withUI:()=>i,withWallet:()=>C});var a=s(92950),n=s(99019),r=s(87358),d=s(45263);const l=(0,a.createContext)({}),o=e=>{let{children:t,appId:s,style:o={},antd:c=!1}=e;const{ui:i}=(0,r.Qy)((e=>e)),u=(0,a.useMemo)((()=>({ui:i})),[i]),p=c?{getPopupContainer:()=>document.getElementById(s),..."object"===typeof c?c:{}}:void 0;return(0,d.jsx)(l.Provider,{value:u,children:(0,d.jsx)("section",{id:s,style:{height:"100%",backgroundColor:"transparent",...o},children:p?(0,d.jsx)(n.ConfigProvider,{...p,children:t}):t})})},c=e=>{let{children:t}=e;return(0,d.jsx)(l.Consumer,{children:e=>a.Children.map(t,(t=>(0,a.cloneElement)(t,{...e})))})},i=e=>{class t extends a.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,d.jsx)(c,{children:(0,d.jsx)(e,{ref:t,...s})})}}return(0,a.forwardRef)(((e,s)=>(0,d.jsx)(t,{...e,ref:s})))},u=()=>(0,a.useContext)(l),p=(0,a.createContext)({}),f=e=>{let{children:t}=e;const{pools:s}=(0,r.Qy)((e=>e)),n=(0,a.useMemo)((()=>({pools:s})),[s]);return(0,d.jsx)(p.Provider,{value:n,children:t})},w=e=>{let{children:t}=e;return(0,d.jsx)(p.Consumer,{children:e=>a.Children.map(t,(t=>(0,a.cloneElement)(t,{...e})))})},h=e=>{class t extends a.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,d.jsx)(w,{children:(0,d.jsx)(e,{ref:t,...s})})}}return(0,a.forwardRef)(((e,s)=>(0,d.jsx)(t,{...e,ref:s})))},y=()=>(0,a.useContext)(p),g=(0,a.createContext)({}),m=e=>{let{children:t}=e;const{wallet:s}=(0,r.Qy)((e=>e)),n=(0,a.useMemo)((()=>({wallet:s})),[s]);return(0,d.jsx)(g.Provider,{value:n,children:t})},A=e=>{let{children:t}=e;return(0,d.jsx)(g.Consumer,{children:e=>a.Children.map(t,(t=>(0,a.cloneElement)(t,{...e})))})},C=e=>{class t extends a.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,d.jsx)(A,{children:(0,d.jsx)(e,{ref:t,...s})})}}return(0,a.forwardRef)(((e,s)=>(0,d.jsx)(t,{...e,ref:s})))},v=()=>(0,a.useContext)(g),b=(0,a.createContext)({}),x=e=>{let{children:t}=e;const{accounts:s}=(0,r.Qy)((e=>e)),n=(0,a.useMemo)((()=>({accounts:s})),[s]);return(0,d.jsx)(b.Provider,{value:n,children:t})},j=e=>{let{children:t}=e;return(0,d.jsx)(b.Consumer,{children:e=>a.Children.map(t,(t=>(0,a.cloneElement)(t,{...e})))})},k=e=>{class t extends a.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,d.jsx)(j,{children:(0,d.jsx)(e,{ref:t,...s})})}}return(0,a.forwardRef)(((e,s)=>(0,d.jsx)(t,{...e,ref:s})))},I=()=>(0,a.useContext)(b);var P=s(95418),T=s(33015);const S=new(s(67289).Z),E=(0,a.createContext)({}),Z=e=>{let{children:t}=e;const s=(0,r.u5)(),{mints:n,pools:l}=(0,r.Qy)((e=>e)),o=(0,a.useCallback)((async function(){return await s((0,T.ih)(...arguments)).unwrap()}),[s]),c=(0,a.useCallback)((async e=>{var t;if(!P.account.isAddress(e))throw new Error("Invalid mint address");const s=await S.findByAddress(e);if(null!==s&&void 0!==s&&s.decimals)return s.decimals;if(Object.values(l).findIndex((t=>{let{mint_lpt:s}=t;return s===e}))>=0)return 9;const a=await o({address:e});if(null!==(t=a[e])&&void 0!==t&&t.decimals)return a[e].decimals;throw new Error("Cannot find mint decimals")}),[o,l]),i=(0,a.useMemo)((()=>({mints:n,getMint:o,getDecimals:c,tokenProvider:S})),[n,o,c]);return(0,d.jsx)(E.Provider,{value:i,children:t})},O=e=>{let{children:t}=e;return(0,d.jsx)(E.Consumer,{children:e=>a.Children.map(t,(t=>(0,a.cloneElement)(t,{...e})))})},R=e=>{class t extends a.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,d.jsx)(O,{children:(0,d.jsx)(e,{ref:t,...s})})}}return(0,a.forwardRef)(((e,s)=>(0,d.jsx)(t,{...e,ref:s})))},W=()=>(0,a.useContext)(E)},65090:(e,t,s)=>{s.d(t,{ZP:()=>i});var a=s(19289),n=s(95418);const r="accounts",d=(0,a.createAsyncThunk)(`${r}/getAccounts`,(async e=>{let{owner:t}=e;if(!n.account.isAddress(t))throw new Error("Invalid owner/wallet address");const{splt:s}=window.sentre,a=n.account.fromAddress(t),{value:r}=await s.connection.getTokenAccountsByOwner(a,{programId:s.spltProgramId});let d={};return r.forEach((e=>{let{pubkey:t,account:{data:a}}=e;const n=t.toBase58(),r=s.parseAccountData(a);return d[n]=r})),d})),l=(0,a.createAsyncThunk)(`${r}/getAccount`,(async(e,t)=>{let{address:s}=e,{getState:a}=t;if(!n.account.isAddress(s))throw new Error("Invalid account address");const{accounts:{[s]:r}}=a();if(r)return{[s]:r};const{splt:d}=window.sentre;return{[s]:await d.getAccountData(s)}})),o=(0,a.createAsyncThunk)(`${r}/upsetAccount`,(async e=>{let{address:t,data:s}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");if(!s)throw new Error("Data is empty");return{[t]:s}})),c=(0,a.createAsyncThunk)(`${r}/deleteAccount`,(async e=>{let{address:t}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");return{address:t}})),i=(0,a.createSlice)({name:r,initialState:{},reducers:{},extraReducers:e=>{e.addCase(d.fulfilled,((e,t)=>{let{payload:s}=t;return s})).addCase(l.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(o.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(c.fulfilled,((e,t)=>{let{payload:s}=t;delete e[s.address]}))}}).reducer},5105:(e,t,s)=>{s.d(t,{ZP:()=>i});var a=s(19289),n=s(95418),r=s(3007);const d="flags",l=(0,a.createAsyncThunk)("flags/loadVisited",(async(e,t)=>{let{getState:s}=t;const{wallet:{address:a}}=s();if(!n.account.isAddress(a))throw new Error("Wallet is not connected yet");const d=new r.Z(a).createInstance("sentre");return{visited:await d.getItem("visited")||!1}})),o=(0,a.createAsyncThunk)("flags/updateVisited",(async(e,t)=>{let{getState:s}=t;const{wallet:{address:a}}=s();if(!n.account.isAddress(a))throw new Error("Wallet is not connected yet");const d=new r.Z(a).createInstance("sentre");return await d.setItem("visited",e),{visited:e}})),c=(0,a.createAsyncThunk)("flags/updateLoading",(async e=>({loading:e}))),i=(0,a.createSlice)({name:d,initialState:{visited:!0,loading:!0},reducers:{},extraReducers:e=>{e.addCase(l.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(o.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(c.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)}))}}).reducer},87358:(e,t,s)=>{s.d(t,{u5:()=>y,Qy:()=>g});var a=s(55754),n=s(19289),r=s(70103),d=s(85912),l=s(87482),o=s(5105),c=s(58851),i=s(21028),u=s(65090),p=s(33015),f=s(92871),w=s(33361),h=s(51865);(0,a.createStoreHook)(r.RootContext);const y=(0,a.createDispatchHook)(r.RootContext),g=(0,a.createSelectorHook)(r.RootContext);(0,n.configureStore)({middleware:e=>e(d.h),devTools:(0,d.$)("sentre"),reducer:{ui:l.ZP,flags:o.ZP,page:c.ZP,wallet:i.ZP,accounts:u.ZP,mints:p.ZP,pools:f.ZP,search:w.ZP,walkthrough:h.ZP}})},33015:(e,t,s)=>{s.d(t,{ih:()=>d,ZP:()=>c});var a=s(19289),n=s(95418);const r="mints",d=(0,a.createAsyncThunk)("mints/getMint",(async(e,t)=>{let{address:s,force:a=!1}=e,{getState:r}=t;if(!n.account.isAddress(s))throw new Error("Invalid mint address");if(!a){const{accounts:{[s]:e}}=r();if(e)return{[s]:e}}const{splt:d}=window.sentre;return{[s]:await d.getMintData(s)}})),l=(0,a.createAsyncThunk)("mints/upsetMint",(async e=>{let{address:t,data:s}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");if(!s)throw new Error("Data is empty");return{[t]:s}})),o=(0,a.createAsyncThunk)("mints/deleteMint",(async e=>{let{address:t}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");return{address:t}})),c=(0,a.createSlice)({name:r,initialState:{},reducers:{},extraReducers:e=>{e.addCase(d.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(l.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(o.fulfilled,((e,t)=>{let{payload:s}=t;delete e[s.address]}))}}).reducer},58851:(e,t,s)=>{s.d(t,{ZP:()=>m});var a=s(19289),n=s(95418),r=s(3007),d=s(60980);const{register:{senreg:l,extra:o}}=d.Z,c=(e,t)=>t&&Array.isArray(t)?t.filter((t=>e[t])):[],i="page",u={register:{},appIds:[]},p=(0,a.createAsyncThunk)("page/loadRegister",(async()=>({register:{...await(async()=>{try{const e=await fetch(l);return await e.json()}catch(e){return{}}})(),...o}}))),f=(0,a.createAsyncThunk)("page/installManifest",(async(e,t)=>{let{getState:s}=t;const{wallet:{address:a},page:{appIds:r,register:d}}=s();if(!n.account.isAddress(a))throw new Error("Wallet is not connected yet.");if(r.includes(e.appId))throw new Error("Cannot run sandbox for an installed application.");const l=[...r];l.push(e.appId);const o={...d};return o[e.appId]=e,{appIds:l,register:o}})),w=(0,a.createAsyncThunk)("page/loadPage",(async(e,t)=>{let{getState:s}=t;const{wallet:{address:a},page:{register:d}}=s();if(!n.account.isAddress(a))throw new Error("Wallet is not connected yet.");const l=new r.Z(a).createInstance("sentre");return{appIds:c(d,await l.getItem("appIds")||u.appIds)}})),h=(0,a.createAsyncThunk)("page/updatePage",(async(e,t)=>{let{getState:s}=t;const{wallet:{address:a},page:{register:d}}=s();if(!n.account.isAddress(a))throw new Error("Wallet is not connected yet.");e=c(d,e);const l=new r.Z(a).createInstance("sentre");return await l.setItem("appIds",e),{appIds:e}})),y=(0,a.createAsyncThunk)("page/installApp",(async(e,t)=>{let{getState:s}=t;const{wallet:{address:a},page:{appIds:d}}=s();if(!n.account.isAddress(a))throw new Error("Wallet is not connected yet.");if(d.includes(e))return{};const l=[...d];l.push(e);const o=new r.Z(a).createInstance("sentre");return await o.setItem("appIds",l),{appIds:l}})),g=(0,a.createAsyncThunk)("page/uninstallApp",(async(e,t)=>{let{getState:s}=t;const{wallet:{address:a},page:{appIds:d}}=s();if(!n.account.isAddress(a))throw new Error("Wallet is not connected yet.");if(!d.includes(e))return{};const l=d.filter((t=>t!==e)),o=new r.Z(a),c=o.createInstance("sentre");return await c.setItem("appIds",l),await o.dropInstance(e),{appIds:l}})),m=(0,a.createSlice)({name:i,initialState:u,reducers:{},extraReducers:e=>{e.addCase(p.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(f.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(w.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(h.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(y.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(g.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)}))}}).reducer},92871:(e,t,s)=>{s.d(t,{ZP:()=>u});var a=s(19289),n=s(95418),r=s(60980);const{sol:{taxmanAddress:d}}=r.Z,l="pools",o=(0,a.createAsyncThunk)("pools/getPools",(async()=>{const{swap:e}=window.sentre,t=await e.connection.getProgramAccounts(e.swapProgramId,{filters:[{dataSize:257},{memcmp:{bytes:d,offset:65}}]});let s={};return t.forEach((t=>{let{pubkey:a,account:{data:n}}=t;const r=a.toBase58(),d=e.parsePoolData(n);s[r]=d})),s})),c=(0,a.createAsyncThunk)("pools/getPool",(async(e,t)=>{let{address:s}=e,{getState:a}=t;if(!n.account.isAddress(s))throw new Error("Invalid pool address");const{pools:{[s]:r}}=a();if(r)return{[s]:r};const{swap:d}=window.sentre;return{[s]:await d.getPoolData(s)}})),i=(0,a.createAsyncThunk)("pools/upsetPool",(async e=>{let{address:t,data:s}=e;if(!n.account.isAddress(t))throw new Error("Invalid pool address");if(!s)throw new Error("Data is empty");return{[t]:s}})),u=(0,a.createSlice)({name:l,initialState:{},reducers:{},extraReducers:e=>{e.addCase(o.fulfilled,((e,t)=>{let{payload:s}=t;return s})).addCase(c.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(i.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)}))}}).reducer},33361:(e,t,s)=>{s.d(t,{ZP:()=>o});var a=s(19289);const n="search",r=(0,a.createAsyncThunk)("search/setValue",(async e=>({value:e}))),d=(0,a.createAsyncThunk)("search/setLoading",(async e=>({loading:e}))),l=(0,a.createAsyncThunk)("search/setDisabled",(async e=>({disabled:e}))),o=(0,a.createSlice)({name:n,initialState:{value:"",loading:!1,disabled:!1},reducers:{},extraReducers:e=>{e.addCase(r.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(d.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(l.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)}))}}).reducer},87482:(e,t,s)=>{s.d(t,{ZP:()=>u});var a=s(19289);const n=()=>{const e=window.innerWidth;return e<576?"xs":e<768?"sm":e<992?"md":e<1200?"lg":e<1400?"xl":"xxl"},r="ui",d={theme:window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark",width:window.innerWidth,infix:n(),touchable:"ontouchstart"in window||navigator.maxTouchPoints>0,visibleActionCenter:!1,visibleInstaller:!1},l=(0,a.createAsyncThunk)("ui/setTheme",(async e=>({theme:e}))),o=(0,a.createAsyncThunk)("ui/resize",(async()=>({width:window.innerWidth,infix:n()}))),c=(0,a.createAsyncThunk)("ui/setVisibleActionCenter",(async e=>({visibleActionCenter:e}))),i=(0,a.createAsyncThunk)("ui/setVisibleInstaller",(async e=>({visibleInstaller:e}))),u=(0,a.createSlice)({name:r,initialState:d,reducers:{},extraReducers:e=>{e.addCase(l.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(o.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(c.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(i.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)}))}}).reducer},51865:(e,t,s)=>{s.d(t,{ZP:()=>o});var a=s(19289);let n;!function(e){e[e.Default=0]="Default",e[e.NewComer=1]="NewComer"}(n||(n={}));const r="walkthrough",d={type:n.Default,run:!1,step:0},l=(0,a.createAsyncThunk)(`${r}/setWalkthrough`,(async e=>({...e}))),o=(0,a.createSlice)({name:r,initialState:d,reducers:{},extraReducers:e=>{e.addCase(l.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)}))}}).reducer},21028:(e,t,s)=>{s.d(t,{ZP:()=>w});var a=s(19289),n=s(95418),r=s(60980);const d=async e=>{const{sol:{node:t,spltAddress:s,splataAddress:a,swapAddress:d}}=r.Z;window.sentre={wallet:e,lamports:new n.Lamports(t),splt:new n.SPLT(s,a,t),swap:new n.Swap(d,s,a,t)}},l="wallet",o={visible:!1,address:"",lamports:BigInt(0)},c=(0,a.createAsyncThunk)("wallet/openWallet",(async()=>({visible:!0}))),i=(0,a.createAsyncThunk)("wallet/closeWallet",(async()=>({visible:!1}))),u=(0,a.createAsyncThunk)("wallet/connectWallet",(async e=>{if(!e)throw new Error("Invalid wallet instance");await d(e);const t=await e.getAddress(),s=await window.sentre.lamports.getLamports(t);return{address:t,lamports:BigInt(s),visible:!1}})),p=(0,a.createAsyncThunk)("wallet/updateWallet",(async e=>{let{lamports:t}=e;return{lamports:t}})),f=(0,a.createAsyncThunk)("wallet/disconnectWallet",(async()=>{await(async()=>{var e;null!==(e=window.sentre)&&void 0!==e&&e.wallet&&window.sentre.wallet.disconnect(),await d(void 0)})(),window.location.reload()})),w=(0,a.createSlice)({name:l,initialState:o,reducers:{},extraReducers:e=>{e.addCase(c.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(i.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(u.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(p.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)})).addCase(f.fulfilled,((e,t)=>{let{payload:s}=t;Object.assign(e,s)}))}}).reducer}}]);
//# sourceMappingURL=182.c58e38a8.chunk.js.map