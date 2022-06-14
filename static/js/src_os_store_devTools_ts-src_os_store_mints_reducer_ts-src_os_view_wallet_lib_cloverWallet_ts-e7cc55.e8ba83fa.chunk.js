"use strict";(globalThis.webpackChunksen_assets=globalThis.webpackChunksen_assets||[]).push([["src_os_store_devTools_ts-src_os_store_mints_reducer_ts-src_os_view_wallet_lib_cloverWallet_ts-e7cc55"],{55852:(e,t,r)=>{r.d(t,{Z:()=>d});var s=r(63805);const n={spltAddress:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",splataAddress:"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"},o={devnet:{...n,node:s.f4,swapAddress:"4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF",taxmanAddress:"8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9",platformFee:5e3},testnet:{...n,node:s.f4,swapAddress:"4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF",taxmanAddress:"8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9",platformFee:5e3},mainnet:{...n,node:s.f4,swapAddress:"SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV",taxmanAddress:"9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e",platformFee:5e3}};const a="sen_assets",i={[a]:{url:"https://descartesnetwork.github.io/sen-assets/index.js",appId:a,name:"Sen Assets",author:{name:"Sentre",email:"hi@sentre.io"},tags:"utility,sentre".split(",").map((e=>e.trim())),description:"To manage your SPL tokens by many advanced functions",verified:!1}},c={development:{devAppId:a,extra:i,senreg:"https://descartesnetwork.github.io/senreg/register.json"},staging:{devAppId:a,extra:i,senreg:"https://descartesnetwork.github.io/senreg/register.json"},production:{devAppId:a,extra:{},senreg:"https://descartesnetwork.github.io/senreg/register.json"}},d={sol:o[s.ef],register:c[s.OB]}},22027:(e,t,r)=>{r.d(t,{$:()=>i,h:()=>c});var s=r(71256),n=r(48744),o=r.n(n),a=r(97429).Buffer;const i=e=>!1;BigInt.prototype.toJSON=function(){return this.toString()};const c={serializableCheck:{isSerializable:e=>"undefined"===typeof e||null===e||"string"===typeof e||"boolean"===typeof e||"number"===typeof e||Array.isArray(e)||(e=>{if(null===e)return!1;const t=Object.getPrototypeOf(e);return null!==t&&null===Object.getPrototypeOf(t)})(e)||"bigint"===typeof e||e instanceof s.PublicKey||e instanceof o()||a.isBuffer(e)}}},33015:(e,t,r)=>{r.d(t,{ZP:()=>d,ih:()=>a});var s=r(19289),n=r(95418);const o="mints",a=(0,s.createAsyncThunk)("mints/getMint",(async(e,t)=>{let{address:r,force:s=!1}=e,{getState:o}=t;if(!n.account.isAddress(r))throw new Error("Invalid mint address");if(!s){const{accounts:{[r]:e}}=o();if(e)return{[r]:e}}const{splt:a}=window.sentre;return{[r]:await a.getMintData(r)}})),i=(0,s.createAsyncThunk)("mints/upsetMint",(async e=>{let{address:t,data:r}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");if(!r)throw new Error("Data is empty");return{[t]:r}})),c=(0,s.createAsyncThunk)("mints/deleteMint",(async e=>{let{address:t}=e;if(!n.account.isAddress(t))throw new Error("Invalid address");return{address:t}})),d=(0,s.createSlice)({name:o,initialState:{},reducers:{},extraReducers:e=>{e.addCase(a.fulfilled,((e,t)=>{let{payload:r}=t;Object.assign(e,r)})).addCase(i.fulfilled,((e,t)=>{let{payload:r}=t;Object.assign(e,r)})).addCase(c.fulfilled,((e,t)=>{let{payload:r}=t;delete e[r.address]}))}}).reducer},55721:(e,t,r)=>{r.d(t,{Z:()=>n});var s=r(53933);const n=class{constructor(e){this.walletType=void 0,this.walletType=e,s.Z.set("WalletType",this.walletType)}async getProvider(){throw new Error("Wallet is not connected")}async getAddress(){throw new Error("Wallet is not connected")}async signTransaction(e){throw new Error("Wallet is not connected")}async signAllTransactions(e){throw new Error("Wallet is not connected")}async signMessage(e){throw new Error("Wallet is not connected")}async verifySignature(e,t,r){throw new Error("Wallet is not connected")}async disconnect(){s.Z.clear("WalletType");(await this.getProvider()).disconnect()}}},80781:(e,t,r)=>{r.d(t,{Z:()=>g});var s,n=r(53229),o=r(44967),a=r(95418),i=r(55721),c=r(35369),d=r(97429).Buffer;const g=(s=class extends i.Z{constructor(){super("Clover")}async getProvider(){const{clover_solana:e}=window;if(null===e||void 0===e||!e.isCloverWallet)throw new Error("Wallet is not connected");return e}async getAddress(){const e=await this.getProvider(),t=await e.getAccount();if(!a.account.isAddress(t))throw new Error("There is no Solana account");return t}async signTransaction(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.feePayer||(e.feePayer=s),await t.signTransaction(e)}async signAllTransactions(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.forEach((e=>{e.feePayer||(e.feePayer=s)})),await t.signAllTransactions(e)}async signMessage(e){if(!e)throw new Error("Message must be a non-empty string");const t=await this.getProvider(),r=await this.getAddress(),s=(new TextEncoder).encode(e),{signature:n}=await t.signMessage(s,"utf8");return{address:r,signature:d.from(n).toString("hex"),message:e}}async verifySignature(e,t,r){r=r||await this.getAddress();const s=a.account.fromAddress(r),n=d.from(e,"hex"),i=(new TextEncoder).encode(t);return o.sign.detached.verify(i,n,s.toBuffer())}},(0,n.Z)(s.prototype,"signTransaction",[c.n],Object.getOwnPropertyDescriptor(s.prototype,"signTransaction"),s.prototype),(0,n.Z)(s.prototype,"signAllTransactions",[c.Y],Object.getOwnPropertyDescriptor(s.prototype,"signAllTransactions"),s.prototype),s)},6051:(e,t,r)=>{r.d(t,{Z:()=>d});var s,n=r(53229),o=r(95418),a=r(68532),i=r(55721),c=r(35369);const d=(s=class extends i.Z{constructor(){super("Coin98")}async getProvider(){var e;const{sol:t}=(null===(e=window)||void 0===e?void 0:e.coin98)||{};if(!t)throw new Error("Wallet is not connected");return t}async getAddress(){const e=await this.getProvider(),[t]=await e.request({method:"sol_accounts"})||[];if(!o.account.isAddress(t))throw new Error("There is no Solana account");return t}async signTransaction(e){const t=await this.getProvider(),r=await this.getAddress(),s=o.account.fromAddress(r);e.feePayer||(e.feePayer=s);const{signature:n}=await t.request({method:"sol_sign",params:[e]}),i=(0,a.decode)(n);return e.addSignature(s,i),e}async signAllTransactions(e){const t=await this.getProvider(),r=await this.getAddress(),s=o.account.fromAddress(r);e.forEach((e=>{e.feePayer||(e.feePayer=s)}));const{signatures:n}=await t.request({method:"sol_signAllTransactions",params:[e]});return n.forEach(((t,r)=>{const n=(0,a.decode)(t);e[r].addSignature(s,n)})),e}async signMessage(e){if(!e)throw new Error("Message must be a non-empty string");const t=await this.getProvider();return await t.request({method:"sol_sign",params:[e]})}async verifySignature(e,t,r){r=r||await this.getAddress();return await o.account.verifySignature(r,e,t)}},(0,n.Z)(s.prototype,"signTransaction",[c.n],Object.getOwnPropertyDescriptor(s.prototype,"signTransaction"),s.prototype),(0,n.Z)(s.prototype,"signAllTransactions",[c.Y],Object.getOwnPropertyDescriptor(s.prototype,"signAllTransactions"),s.prototype),s)},35369:(e,t,r)=>{r.d(t,{Y:()=>c,n:()=>i});var s=r(71256),n=r(55852);const{sol:{taxmanAddress:o,platformFee:a}}=n.Z,i=(e,t,r)=>{const n=r.value;r.value=async function(t){const r=s.SystemProgram.transfer({fromPubkey:t.feePayer||await e.getAddress(),toPubkey:new s.PublicKey(o),lamports:a});return t.add(r),n.call(e,t)}},c=(e,t,r)=>{const n=r.value;r.value=async t=>{for(const r of t){const t=s.SystemProgram.transfer({fromPubkey:r.feePayer||await e.getAddress(),toPubkey:new s.PublicKey(o),lamports:a});r.add(t)}return n.call(e,t)}}},58181:(e,t,r)=>{r.d(t,{Z:()=>o});var s=r(55721);class n extends s.Z{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:()=>{};super("Guest"),this._callback=()=>{},this._error=()=>{throw new Error("You are in the Guest Mode. Please connect your personal wallet to proceed the action.")},this._callback=e}async getProvider(){return{address:"GuestAccount11111111111111111111111111111111",disconnect:()=>{}}}async getAddress(){const{address:e}=await this.getProvider();return e}async signTransaction(e){return await this._callback(),this._error()}async signAllTransaction(e){return await this._callback(),this._error()}async signMessage(e){return await this._callback(),this._error()}async verifySignature(e,t,r){return await this._callback(),this._error()}}const o=n},37344:(e,t,r)=>{r.d(t,{Z:()=>g});var s,n=r(53229),o=r(44967),a=r(95418),i=r(55721),c=r(35369),d=r(97429).Buffer;const g=(s=class extends i.Z{constructor(){super("Phantom")}async getProvider(){const{solana:e}=window;if(null===e||void 0===e||!e.isPhantom)throw new Error("Wallet is not connected");return e.isConnected?e:await new Promise((t=>(e.on("connect",(()=>t(e))),e.connect())))}async getAddress(){const e=(await this.getProvider()).publicKey.toString();if(!a.account.isAddress(e))throw new Error("There is no Solana account");return e}async signTransaction(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.feePayer||(e.feePayer=s),await t.signTransaction(e)}async signAllTransactions(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.forEach((e=>{e.feePayer||(e.feePayer=s)})),await t.signAllTransactions(e)}async signMessage(e){if(!e)throw new Error("Message must be a non-empty string");const t=await this.getProvider(),r=await this.getAddress(),s=(new TextEncoder).encode(e),{signature:n}=await t.signMessage(s,"utf8");return{address:r,signature:d.from(n).toString("hex"),message:e}}async verifySignature(e,t,r){r=r||await this.getAddress();const s=a.account.fromAddress(r),n=d.from(e,"hex"),i=(new TextEncoder).encode(t);return o.sign.detached.verify(i,n,s.toBuffer())}},(0,n.Z)(s.prototype,"signTransaction",[c.n],Object.getOwnPropertyDescriptor(s.prototype,"signTransaction"),s.prototype),(0,n.Z)(s.prototype,"signAllTransactions",[c.Y],Object.getOwnPropertyDescriptor(s.prototype,"signAllTransactions"),s.prototype),s)},84048:(e,t,r)=>{r.d(t,{Z:()=>y});var s,n=r(53229),o=r(44967),a=r(95418),i=r(55721),c=r(88490),d=r(53933),g=r(35369),l=r(97429).Buffer;const y=(s=class e extends i.Z{constructor(t,r){super("SecretKey"),e.setSecretKey(t,r)}static xor(e,t){if(e.length!==t.length)throw new Error("Cannot XOR two different-length buffers");const r=l.alloc(e.length);for(let s=0;s<r.length;s++)r[s]=e[s]^t[s];return r}static getPassword(){let e=c.Z.get("Password");if(e||(e=window.prompt("Input the password:")),!e)throw new Error("User rejects to sign the transaction");return c.Z.set("Password",e),e}static setSecretKey(t,r){const{secretKey:s}=a.account.fromSecretKey(t)||{};if(!s)throw new Error("Invalid secret key");r=r||e.getPassword();const n=(0,o.hash)(l.from(r)),i=e.xor(n,s);d.Z.set("SecretKey",i.toString("hex"))}static getSecretKey(t){t=t||e.getPassword();const r=(0,o.hash)(l.from(t)),s=d.Z.get("SecretKey");if(!s)throw new Error("Invalid secret key");return e.xor(r,l.from(s,"hex")).toString("hex")}async getProvider(){const t=e.getSecretKey(),r=a.account.fromSecretKey(t);if(!r)throw new Error("Cannot get the keystore-based provider");return{keypair:r,disconnect:()=>c.Z.clear("SecretKey")}}async getAddress(){const{keypair:e}=await this.getProvider();return e.publicKey.toBase58()}async signTransaction(e){if(!window.confirm("Please confirm to sign the transaction!"))throw new Error("User rejects to sign the transaction");const{keypair:t}=await this.getProvider(),r=e.serializeMessage(),s=t.publicKey;e.feePayer||(e.feePayer=s);const n=o.sign.detached(r,t.secretKey);return e.addSignature(s,l.from(n)),e}async signAllTransactions(e){if(!window.confirm("Please confirm to sign the transactions!"))throw new Error("User rejects to sign the transactions");const{keypair:t}=await this.getProvider(),r=[];for(const s of e){const e=s.serializeMessage(),n=t.publicKey;s.feePayer||(s.feePayer=n);const a=o.sign.detached(e,t.secretKey);s.addSignature(n,l.from(a)),r.push(s)}return r}async signMessage(e){if(!e)throw new Error("Message must be a non-empty string");if(!window.confirm(`Please confirm to sign the message! Message: ${e}`))throw new Error("User rejects to sign the message");const{keypair:t}=await this.getProvider(),r=l.from(t.secretKey).toString("hex");return{...a.account.signMessage(e,r)}}async verifySignature(e,t,r){r=r||await this.getAddress();return a.account.verifySignature(r,e,t)}},(0,n.Z)(s.prototype,"signTransaction",[g.n],Object.getOwnPropertyDescriptor(s.prototype,"signTransaction"),s.prototype),(0,n.Z)(s.prototype,"signAllTransactions",[g.Y],Object.getOwnPropertyDescriptor(s.prototype,"signAllTransactions"),s.prototype),s)},13974:(e,t,r)=>{r.d(t,{Z:()=>l});var s,n=r(53229),o=r(44967),a=r(95418),i=r(68532),c=r(55721),d=r(35369),g=r(97429).Buffer;const l=(s=class extends c.Z{constructor(){super("Slope"),this.provider=void 0,this.provider=null}async getProvider(){const{Slope:e}=window||{};if(!e)throw new Error("Cannot connect to Slope");return this.provider||(this.provider=new e,await this.provider.connect()),this.provider}async getAddress(){const e=await this.getProvider(),{data:t}=await e.connect();if(!t.publicKey)throw new Error("Wallet is not connected");return t.publicKey}async signTransaction(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);e.feePayer||(e.feePayer=s);const n=(0,i.encode)(e.serializeMessage()),{msg:o,data:c}=await t.signTransaction(n);if(!c.publicKey||!c.signature)throw new Error(o);const d=(0,i.decode)(c.signature);return e.addSignature(s,d),e}async signAllTransactions(e){var t;const r=await this.getProvider(),s=await this.getAddress(),n=a.account.fromAddress(s);e.forEach((e=>{e.feePayer||(e.feePayer=n)}));const o=e.map((e=>(0,i.encode)(e.serializeMessage()))),{msg:c,data:d}=await r.signAllTransactions(o);if(!d.publicKey||(null===(t=d.signatures)||void 0===t?void 0:t.length)!==e.length)throw new Error(c);return d.signatures.forEach(((t,r)=>{const s=(0,i.decode)(t);e[r].addSignature(n,s)})),e}async verifySignature(e,t,r){const s=r||await this.getAddress(),n=a.account.fromAddress(s),i=g.from(e,"hex"),c=(new TextEncoder).encode(t);return o.sign.detached.verify(c,i,n.toBuffer())}},(0,n.Z)(s.prototype,"signTransaction",[d.n],Object.getOwnPropertyDescriptor(s.prototype,"signTransaction"),s.prototype),(0,n.Z)(s.prototype,"signAllTransactions",[d.Y],Object.getOwnPropertyDescriptor(s.prototype,"signAllTransactions"),s.prototype),s)},60766:(e,t,r)=>{r.d(t,{Z:()=>g});var s,n=r(53229),o=r(44967),a=r(95418),i=r(55721),c=r(35369),d=r(97429).Buffer;const g=(s=class extends i.Z{constructor(){super("SolflareExtension")}async getProvider(){const{solflare:e}=window;if(!e.isSolflare)throw new Error("Wallet is not connected");return e.isConnected?e:await new Promise((t=>(e.on("connect",(()=>t(e))),e.connect())))}async getAddress(){const e=(await this.getProvider()).publicKey.toString();if(!a.account.isAddress(e))throw new Error("There is no Solana account");return e}async signTransaction(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.feePayer||(e.feePayer=s),await t.signTransaction(e)}async signAllTransactions(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.forEach((e=>{e.feePayer||(e.feePayer=s)})),await t.signAllTransactions(e)}async signMessage(e){if(!e)throw new Error("Message must be a non-empty string");const t=await this.getProvider(),r=await this.getAddress(),s=(new TextEncoder).encode(e),{signature:n}=await t.signMessage(s,"utf8");return{address:r,signature:d.from(n).toString("hex"),message:e}}async verifySignature(e,t,r){r=r||await this.getAddress();const s=a.account.fromAddress(r),n=d.from(e,"hex"),i=(new TextEncoder).encode(t);return o.sign.detached.verify(i,n,s.toBuffer())}},(0,n.Z)(s.prototype,"signTransaction",[c.n],Object.getOwnPropertyDescriptor(s.prototype,"signTransaction"),s.prototype),(0,n.Z)(s.prototype,"signAllTransactions",[c.Y],Object.getOwnPropertyDescriptor(s.prototype,"signAllTransactions"),s.prototype),s)},31669:(e,t,r)=>{r.d(t,{Z:()=>w});var s,n=r(53229),o=r(44967),a=r(95418),i=r(12053),c=r(55721),d=r(55852),g=r(35369),l=r(97429).Buffer;const{sol:{node:y}}=d.Z,u=new i.Z("https://solflare.com/provider",y);const w=(s=class extends c.Z{constructor(){super("SolflareWeb")}async getProvider(){return u.connected||await u.connect(),u}async getAddress(){const e=await this.getProvider();if(!e.publicKey)throw new Error("Cannot connect to Solflare");return e.publicKey.toBase58()}async signTransaction(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.feePayer||(e.feePayer=s),await t.signTransaction(e)}async signAllTransactions(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.forEach((e=>{e.feePayer||(e.feePayer=s)})),await t.signAllTransactions(e)}async signMessage(e){if(!e)throw new Error("Message must be a non-empty string");const t=await this.getProvider(),r=await this.getAddress(),s=(new TextEncoder).encode(e),{signature:n}=await t.sign(s,"utf8");return{address:r,signature:l.from(n).toString("hex"),message:e}}async verifySignature(e,t,r){r=r||await this.getAddress();const s=a.account.fromAddress(r),n=l.from(e,"hex"),i=(new TextEncoder).encode(t);return o.sign.detached.verify(i,n,s.toBuffer())}},(0,n.Z)(s.prototype,"signTransaction",[g.n],Object.getOwnPropertyDescriptor(s.prototype,"signTransaction"),s.prototype),(0,n.Z)(s.prototype,"signAllTransactions",[g.Y],Object.getOwnPropertyDescriptor(s.prototype,"signAllTransactions"),s.prototype),s)},2491:(e,t,r)=>{r.d(t,{Z:()=>w});var s,n=r(53229),o=r(44967),a=r(95418),i=r(12053),c=r(55721),d=r(55852),g=r(35369),l=r(97429).Buffer;const{sol:{node:y}}=d.Z,u=new i.Z("https://www.sollet.io",y);const w=(s=class extends c.Z{constructor(){super("SolletWeb")}async getProvider(){return u.connected||await u.connect(),u}async getAddress(){const e=await this.getProvider();if(!e.publicKey)throw new Error("Cannot connect to Sollet Web");return e.publicKey.toBase58()}async signTransaction(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.feePayer||(e.feePayer=s),await t.signTransaction(e)}async signAllTransactions(e){const t=await this.getProvider(),r=await this.getAddress(),s=a.account.fromAddress(r);return e.forEach((e=>{e.feePayer||(e.feePayer=s)})),await t.signAllTransactions(e)}async signMessage(e){if(!e)throw new Error("Message must be a non-empty string");const t=await this.getProvider(),r=await this.getAddress(),s=(new TextEncoder).encode(e),{signature:n}=await t.sign(s,"utf8");return{address:r,signature:l.from(n).toString("hex"),message:e}}async verifySignature(e,t,r){r=r||await this.getAddress();const s=a.account.fromAddress(r),n=l.from(e,"hex"),i=(new TextEncoder).encode(t);return o.sign.detached.verify(i,n,s.toBuffer())}},(0,n.Z)(s.prototype,"signTransaction",[g.n],Object.getOwnPropertyDescriptor(s.prototype,"signTransaction"),s.prototype),(0,n.Z)(s.prototype,"signAllTransactions",[g.Y],Object.getOwnPropertyDescriptor(s.prototype,"signAllTransactions"),s.prototype),s)}}]);
//# sourceMappingURL=src_os_store_devTools_ts-src_os_store_mints_reducer_ts-src_os_view_wallet_lib_cloverWallet_ts-e7cc55.e8ba83fa.chunk.js.map