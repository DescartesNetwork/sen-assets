"use strict";(globalThis.webpackChunksen_assets=globalThis.webpackChunksen_assets||[]).push([[358],{60980:(e,t,a)=>{a.d(t,{Z:()=>o});var s=a(63805);const n={spltAddress:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",splataAddress:"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"},r={devnet:{...n,node:"https://api.devnet.solana.com",sntrAddress:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",sntrPoolAddress:"3EUPL7YQLbU6DNU5LZeQeHPXTf1MigJ2yASXA9rH5Ku4",swapAddress:"4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF",taxmanAddress:"8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9"},testnet:{...n,node:"https://api.testnet.solana.com",sntrAddress:"",sntrPoolAddress:"",swapAddress:"",taxmanAddress:""},mainnet:{...n,node:"https://sentre.genesysgo.net",sntrAddress:"SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M",sntrPoolAddress:"Aa3WZX7Xunfebp2MuAcz9CNw8TYTDL7mVrmb11rjyVm6",swapAddress:"SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV",taxmanAddress:"9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e"}};const d="sen_assets",l={[d]:{url:"https://descartesnetwork.github.io/sen-assets/index.js",appId:d,name:"Sen Assets",author:{name:"Sentre",email:"hi@sentre.io"},tags:"dapps,sentre".split(",").map((e=>e.trim())),description:"To manage your SPL tokens by many advanced functions",verified:!1}},c={development:{defaultAppId:d,extra:l,senreg:"https://descartesnetwork.github.io/senreg/register.json"},staging:{defaultAppId:d,extra:l,senreg:"https://descartesnetwork.github.io/senreg/register.json"},production:{defaultAppId:d,extra:{},senreg:"https://descartesnetwork.github.io/senreg/register.json"}},i={devnet:{baseURL:"https://stat-dev.sentre.io"},testnet:{baseURL:"https://stat-dev.sentre.io"},mainnet:{baseURL:"https://stat.sentre.io"}},o={sol:r[s.ef],register:c[s.OB],stat:i[s.ef]}},65090:(e,t,a)=>{a.d(t,{T8:()=>d,E5:()=>c,ZP:()=>o});var s=a(19289),n=a(95418);const r="accounts",d=(0,s.createAsyncThunk)(`${r}/getAccounts`,(async e=>{let{owner:t}=e;if(!n.account.isAddress(t))throw new Error("Invalid owner/wallet address");const{splt:a}=window.sentre,s=n.account.fromAddress(t),{value:r}=await a.connection.getTokenAccountsByOwner(s,{programId:a.spltProgramId});let d={};return r.forEach((e=>{let{pubkey:t,account:{data:s}}=e;const n=t.toBase58(),r=a.parseAccountData(s);return d[n]=r})),d})),l=(0,s.createAsyncThunk)(`${r}/getAccount`,(async(e,t)=>{let{address:a}=e,{getState:s}=t;if(!n.account.isAddress(a))throw new Error("Invalid account address");const{accounts:{[a]:r}}=s();if(r)return{[a]:r};const{splt:d}=window.sentre;return{[a]:await d.getAccountData(a)}})),c=(0,s.createAsyncThunk)(`${r}/upsetAccount`,(async e=>{let{address:t,data:a}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");if(!a)throw new Error("Data is empty");return{[t]:a}})),i=(0,s.createAsyncThunk)(`${r}/deleteAccount`,(async e=>{let{address:t}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");return{address:t}})),o=(0,s.createSlice)({name:r,initialState:{},reducers:{},extraReducers:e=>{e.addCase(d.fulfilled,((e,t)=>{let{payload:a}=t;return a})).addCase(l.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(c.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(i.fulfilled,((e,t)=>{let{payload:a}=t;delete e[a.address]}))}}).reducer},5105:(e,t,a)=>{a.d(t,{fL:()=>l,Z9:()=>c,Xt:()=>i,ZP:()=>o});var s=a(19289),n=a(95418),r=a(3007);const d="flags",l=(0,s.createAsyncThunk)("flags/loadVisited",(async(e,t)=>{let{getState:a}=t;const{wallet:{address:s}}=a();if(!n.account.isAddress(s))throw new Error("Wallet is not connected yet");const d=new r.Z(s).createInstance("sentre");return{visited:await d.getItem("visited")||!1}})),c=(0,s.createAsyncThunk)("flags/updateVisited",(async(e,t)=>{let{getState:a}=t;const{wallet:{address:s}}=a();if(!n.account.isAddress(s))throw new Error("Wallet is not connected yet");const d=new r.Z(s).createInstance("sentre");return await d.setItem("visited",e),{visited:e}})),i=(0,s.createAsyncThunk)("flags/updateLoading",(async e=>({loading:e}))),o=(0,s.createSlice)({name:d,initialState:{visited:!0,loading:!0},reducers:{},extraReducers:e=>{e.addCase(l.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(c.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(i.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)}))}}).reducer},87358:(e,t,a)=>{a.d(t,{u5:()=>y,Qy:()=>h,ZP:()=>m});var s=a(55754),n=a(19289),r=a(70103),d=a(85912),l=a(87482),c=a(5105),i=a(58851),o=a(21028),u=a(65090),p=a(33015),w=a(92871),f=a(33361),g=a(51865);(0,s.createStoreHook)(r.RootContext);const y=(0,s.createDispatchHook)(r.RootContext),h=(0,s.createSelectorHook)(r.RootContext),A=(0,n.configureStore)({middleware:e=>e(d.h),devTools:(0,d.$)("sentre"),reducer:{ui:l.ZP,flags:c.ZP,page:i.ZP,wallet:o.ZP,accounts:u.ZP,mints:p.ZP,pools:w.ZP,search:f.ZP,walkthrough:g.ZP}}),m=179==a.j?A:null},33015:(e,t,a)=>{a.d(t,{ih:()=>d,ZP:()=>i});var s=a(19289),n=a(95418);const r="mints",d=(0,s.createAsyncThunk)("mints/getMint",(async(e,t)=>{let{address:a,force:s=!1}=e,{getState:r}=t;if(!n.account.isAddress(a))throw new Error("Invalid mint address");if(!s){const{accounts:{[a]:e}}=r();if(e)return{[a]:e}}const{splt:d}=window.sentre;return{[a]:await d.getMintData(a)}})),l=(0,s.createAsyncThunk)("mints/upsetMint",(async e=>{let{address:t,data:a}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");if(!a)throw new Error("Data is empty");return{[t]:a}})),c=(0,s.createAsyncThunk)("mints/deleteMint",(async e=>{let{address:t}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");return{address:t}})),i=(0,s.createSlice)({name:r,initialState:{},reducers:{},extraReducers:e=>{e.addCase(d.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(l.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(c.fulfilled,((e,t)=>{let{payload:a}=t;delete e[a.address]}))}}).reducer},58851:(e,t,a)=>{a.d(t,{Xg:()=>p,mw:()=>w,ij:()=>f,T$:()=>g,eI:()=>y,qS:()=>h,ZP:()=>A});var s=a(19289),n=a(95418),r=a(3007),d=a(60980);const{register:{senreg:l,extra:c}}=d.Z,i=(e,t)=>t&&Array.isArray(t)?t.filter((t=>e[t])):[],o="page",u={register:{},appIds:[]},p=(0,s.createAsyncThunk)("page/loadRegister",(async()=>({register:{...await(async()=>{try{const e=await fetch(l);return await e.json()}catch(e){return{}}})(),...c}}))),w=(0,s.createAsyncThunk)("page/installManifest",(async(e,t)=>{let{getState:a}=t;const{wallet:{address:s},page:{appIds:r,register:d}}=a();if(!n.account.isAddress(s))throw new Error("Wallet is not connected yet.");if(r.includes(e.appId))throw new Error("Cannot run sandbox for an installed application.");const l=[...r];l.push(e.appId);const c={...d};return c[e.appId]=e,{appIds:l,register:c}})),f=(0,s.createAsyncThunk)("page/loadPage",(async(e,t)=>{let{getState:a}=t;const{wallet:{address:s},page:{register:d}}=a();if(!n.account.isAddress(s))throw new Error("Wallet is not connected yet.");const l=new r.Z(s).createInstance("sentre");return{appIds:i(d,await l.getItem("appIds")||u.appIds)}})),g=(0,s.createAsyncThunk)("page/updatePage",(async(e,t)=>{let{getState:a}=t;const{wallet:{address:s},page:{register:d}}=a();if(!n.account.isAddress(s))throw new Error("Wallet is not connected yet.");e=i(d,e);const l=new r.Z(s).createInstance("sentre");return await l.setItem("appIds",e),{appIds:e}})),y=(0,s.createAsyncThunk)("page/installApp",(async(e,t)=>{let{getState:a}=t;const{wallet:{address:s},page:{appIds:d}}=a();if(!n.account.isAddress(s))throw new Error("Wallet is not connected yet.");if(d.includes(e))return{};const l=[...d];l.push(e);const c=new r.Z(s).createInstance("sentre");return await c.setItem("appIds",l),{appIds:l}})),h=(0,s.createAsyncThunk)("page/uninstallApp",(async(e,t)=>{let{getState:a}=t;const{wallet:{address:s},page:{appIds:d}}=a();if(!n.account.isAddress(s))throw new Error("Wallet is not connected yet.");if(!d.includes(e))return{};const l=d.filter((t=>t!==e)),c=new r.Z(s),i=c.createInstance("sentre");return await i.setItem("appIds",l),await c.dropInstance(e),{appIds:l}})),A=(0,s.createSlice)({name:o,initialState:u,reducers:{},extraReducers:e=>{e.addCase(p.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(w.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(f.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(g.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(y.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(h.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)}))}}).reducer},92871:(e,t,a)=>{a.d(t,{d2:()=>c,E6:()=>o,ZP:()=>u});var s=a(19289),n=a(95418),r=a(60980);const{sol:{taxmanAddress:d}}=r.Z,l="pools",c=(0,s.createAsyncThunk)("pools/getPools",(async()=>{const{swap:e}=window.sentre,t=await e.connection.getProgramAccounts(e.swapProgramId,{filters:[{dataSize:257},{memcmp:{bytes:d,offset:65}}]});let a={};return t.forEach((t=>{let{pubkey:s,account:{data:n}}=t;const r=s.toBase58(),d=e.parsePoolData(n);a[r]=d})),a})),i=(0,s.createAsyncThunk)("pools/getPool",(async(e,t)=>{let{address:a}=e,{getState:s}=t;if(!n.account.isAddress(a))throw new Error("Invalid pool address");const{pools:{[a]:r}}=s();if(r)return{[a]:r};const{swap:d}=window.sentre;return{[a]:await d.getPoolData(a)}})),o=(0,s.createAsyncThunk)("pools/upsetPool",(async e=>{let{address:t,data:a}=e;if(!n.account.isAddress(t))throw new Error("Invalid pool address");if(!a)throw new Error("Data is empty");return{[t]:a}})),u=(0,s.createSlice)({name:l,initialState:{},reducers:{},extraReducers:e=>{e.addCase(c.fulfilled,((e,t)=>{let{payload:a}=t;return a})).addCase(i.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(o.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)}))}}).reducer},33361:(e,t,a)=>{a.d(t,{sO:()=>r,K4:()=>d,ZP:()=>c});var s=a(19289);const n="search",r=(0,s.createAsyncThunk)("search/setValue",(async e=>({value:e}))),d=(0,s.createAsyncThunk)("search/setLoading",(async e=>({loading:e}))),l=(0,s.createAsyncThunk)("search/setDisabled",(async e=>({disabled:e}))),c=(0,s.createSlice)({name:n,initialState:{value:"",loading:!1,disabled:!1},reducers:{},extraReducers:e=>{e.addCase(r.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(d.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(l.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)}))}}).reducer},87482:(e,t,a)=>{a.d(t,{Dc:()=>l,SI:()=>c,zi:()=>i,TK:()=>o,ZP:()=>u});var s=a(19289);const n=()=>{const e=window.innerWidth;return e<576?"xs":e<768?"sm":e<992?"md":e<1200?"lg":e<1400?"xl":"xxl"},r="ui",d={theme:window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark",width:window.innerWidth,infix:n(),touchable:"ontouchstart"in window||navigator.maxTouchPoints>0,visibleActionCenter:!1,visibleInstaller:!1},l=(0,s.createAsyncThunk)("ui/setTheme",(async e=>({theme:e}))),c=(0,s.createAsyncThunk)("ui/resize",(async()=>({width:window.innerWidth,infix:n()}))),i=(0,s.createAsyncThunk)("ui/setVisibleActionCenter",(async e=>({visibleActionCenter:e}))),o=(0,s.createAsyncThunk)("ui/setVisibleInstaller",(async e=>({visibleInstaller:e}))),u=(0,s.createSlice)({name:r,initialState:d,reducers:{},extraReducers:e=>{e.addCase(l.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(c.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(i.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(o.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)}))}}).reducer},51865:(e,t,a)=>{a.d(t,{Gm:()=>n,Rw:()=>l,ZP:()=>c});var s=a(19289);let n;!function(e){e[e.Default=0]="Default",e[e.NewComer=1]="NewComer"}(n||(n={}));const r="walkthrough",d={type:n.Default,run:!1,step:0},l=(0,s.createAsyncThunk)(`${r}/setWalkthrough`,(async e=>({...e}))),c=(0,s.createSlice)({name:r,initialState:d,reducers:{},extraReducers:e=>{e.addCase(l.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)}))}}).reducer},21028:(e,t,a)=>{a.d(t,{Wh:()=>i,Dx:()=>o,UP:()=>u,K8:()=>p,co:()=>w,ZP:()=>f});var s=a(19289),n=a(95418),r=a(60980);const d=async e=>{const{sol:{node:t,spltAddress:a,splataAddress:s,swapAddress:d}}=r.Z;window.sentre={wallet:e,lamports:new n.Lamports(t),splt:new n.SPLT(a,s,t),swap:new n.Swap(d,a,s,t)}},l="wallet",c={visible:!1,address:"",lamports:BigInt(0)},i=(0,s.createAsyncThunk)("wallet/openWallet",(async()=>({visible:!0}))),o=(0,s.createAsyncThunk)("wallet/closeWallet",(async()=>({visible:!1}))),u=(0,s.createAsyncThunk)("wallet/connectWallet",(async e=>{if(!e)throw new Error("Invalid wallet instance");await d(e);const t=await e.getAddress(),a=await window.sentre.lamports.getLamports(t);return{address:t,lamports:BigInt(a),visible:!1}})),p=(0,s.createAsyncThunk)("wallet/updateWallet",(async e=>{let{lamports:t}=e;return{lamports:t}})),w=(0,s.createAsyncThunk)("wallet/disconnectWallet",(async()=>{await(async()=>{var e;null!==(e=window.sentre)&&void 0!==e&&e.wallet&&window.sentre.wallet.disconnect(),await d(void 0)})(),window.location.reload()})),f=(0,s.createSlice)({name:l,initialState:c,reducers:{},extraReducers:e=>{e.addCase(i.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(o.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(u.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(p.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)})).addCase(w.fulfilled,((e,t)=>{let{payload:a}=t;Object.assign(e,a)}))}}).reducer},63805:(e,t,a)=>{a.d(t,{OB:()=>n,ef:()=>r,Eu:()=>d,Bv:()=>l});var s=a(53933);const n="production",r=(()=>{switch(s.Z.get("network")){case"devnet":return"devnet";case"testnet":return"testnet";default:return"mainnet"}})(),d=e=>(s.Z.set("network",e),window.location.reload()),l=(()=>{switch(r){case"devnet":return 103;case"testnet":return 102;default:return 101}})()}}]);
//# sourceMappingURL=358.2e756114.chunk.js.map