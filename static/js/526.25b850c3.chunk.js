(self.webpackChunksen_assets=self.webpackChunksen_assets||[]).push([[526],{31633:function(n,e,t){"use strict";var r=t(63805),s=t(77566),o=t(77330),i={sol:s.Z[r.ef],register:o.Z[r.OB]};e.Z=i},77330:function(n,e,t){"use strict";var r=(0,t(4942).Z)({},"sen_assets",{url:"https://descartesnetwork.github.io/sen-assets/index.js",appId:"sen_assets",name:"Sen Assets",author:{name:"Sentre",email:"hi@sentre.io"},supportedViews:"page,widget".split(",").map((function(n){return n.trim()})).filter((function(n){return["page","widget"].includes(n)})),tags:"dapps,sentre".split(",").map((function(n){return n.trim()})),description:"To manage your SPL tokens by many advanced functions",verified:!1}),s={development:{extra:r,senreg:"https://descartesnetwork.github.io/senreg/register.json"},staging:{extra:r,senreg:"https://descartesnetwork.github.io/senreg/register.json"},production:{extra:{},senreg:"https://descartesnetwork.github.io/senreg/register.json"}};e.Z=s},77566:function(n,e,t){"use strict";var r=t(1413),s={spltAddress:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",splataAddress:"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"},o={devnet:(0,r.Z)((0,r.Z)({},s),{},{node:"https://api.devnet.solana.com",chainId:103,senAddress:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",senPoolAddress:"3EUPL7YQLbU6DNU5LZeQeHPXTf1MigJ2yASXA9rH5Ku4",swapAddress:"4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF",taxmanAddress:"8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9"}),testnet:(0,r.Z)((0,r.Z)({},s),{},{node:"https://api.testnet.solana.com",chainId:102,senAddress:"",senPoolAddress:"",swapAddress:"",taxmanAddress:""}),mainnet:(0,r.Z)((0,r.Z)({},s),{},{node:"https://api.mainnet-beta.solana.com",chainId:101,senAddress:"SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M",senPoolAddress:"",swapAddress:"SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV",taxmanAddress:"9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e"})};e.Z=o},64182:function(n,e,t){"use strict";t.r(e),t.d(e,{AccountProvider:function(){return L},MintProvider:function(){return _},PoolProvider:function(){return k},UIProvider:function(){return v},WalletProvider:function(){return P},useAccount:function(){return D},useMint:function(){return V},usePool:function(){return C},useUI:function(){return g},useWallet:function(){return A},withAccount:function(){return B},withMint:function(){return Q},withPool:function(){return y},withUI:function(){return Z},withWallet:function(){return R}});var r=t(45987),s=t(15671),o=t(43144),i=t(60136),u=t(27277),a=t(1413),c=t(92950),d=t(55754),f=t(78589),l=t(45263),p=["forwardedRef"],h=(0,c.createContext)({}),v=function(n){var e=n.children,t=n.appId,r=n.style,s=void 0===r?{}:r,o=n.antd,i=void 0!==o&&o,u=(0,d.useSelector)((function(n){return n.ui})),p=(0,c.useMemo)((function(){return{ui:u}}),[u]);return(0,l.jsx)(h.Provider,{value:p,children:(0,l.jsx)("section",{id:t,style:(0,a.Z)({height:"100%",backgroundColor:"transparent"},s),children:i?(0,l.jsx)(f.ConfigProvider,{prefixCls:t,getPopupContainer:function(){return document.getElementById(t)},children:e}):e})})},m=function(n){var e=n.children;return(0,l.jsx)(h.Consumer,{children:function(n){return c.Children.map(e,(function(e){return(0,c.cloneElement)(e,(0,a.Z)({},n))}))}})},Z=function(n){var e=function(e){(0,i.Z)(c,e);var t=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),t.apply(this,arguments)}return(0,o.Z)(c,[{key:"render",value:function(){var e=this.props,t=e.forwardedRef,s=(0,r.Z)(e,p);return(0,l.jsx)(m,{children:(0,l.jsx)(n,(0,a.Z)({ref:t},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(n,t){return(0,l.jsx)(e,(0,a.Z)((0,a.Z)({},n),{},{ref:t}))}))},g=function(){return(0,c.useContext)(h)},w=["forwardedRef"],x=(0,c.createContext)({}),k=function(n){var e=n.children,t=(0,d.useSelector)((function(n){return n.pools})),r=(0,c.useMemo)((function(){return{pools:t}}),[t]);return(0,l.jsx)(x.Provider,{value:r,children:e})},b=function(n){var e=n.children;return(0,l.jsx)(x.Consumer,{children:function(n){return c.Children.map(e,(function(e){return(0,c.cloneElement)(e,(0,a.Z)({},n))}))}})},y=function(n){var e=function(e){(0,i.Z)(c,e);var t=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),t.apply(this,arguments)}return(0,o.Z)(c,[{key:"render",value:function(){var e=this.props,t=e.forwardedRef,s=(0,r.Z)(e,w);return(0,l.jsx)(b,{children:(0,l.jsx)(n,(0,a.Z)({ref:t},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(n,t){return(0,l.jsx)(e,(0,a.Z)((0,a.Z)({},n),{},{ref:t}))}))},C=function(){return(0,c.useContext)(x)},j=["forwardedRef"],I=(0,c.createContext)({}),P=function(n){var e=n.children,t=(0,d.useSelector)((function(n){return n.wallet})),r=(0,c.useMemo)((function(){return{wallet:t}}),[t]);return(0,l.jsx)(I.Provider,{value:r,children:e})},S=function(n){var e=n.children;return(0,l.jsx)(I.Consumer,{children:function(n){return c.Children.map(e,(function(e){return(0,c.cloneElement)(e,(0,a.Z)({},n))}))}})},R=function(n){var e=function(e){(0,i.Z)(c,e);var t=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),t.apply(this,arguments)}return(0,o.Z)(c,[{key:"render",value:function(){var e=this.props,t=e.forwardedRef,s=(0,r.Z)(e,j);return(0,l.jsx)(S,{children:(0,l.jsx)(n,(0,a.Z)({ref:t},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(n,t){return(0,l.jsx)(e,(0,a.Z)((0,a.Z)({},n),{},{ref:t}))}))},A=function(){return(0,c.useContext)(I)},M=["forwardedRef"],E=(0,c.createContext)({}),L=function(n){var e=n.children,t=(0,d.useSelector)((function(n){return n.accounts})),r=(0,c.useMemo)((function(){return{accounts:t}}),[t]);return(0,l.jsx)(E.Provider,{value:r,children:e})},U=function(n){var e=n.children;return(0,l.jsx)(E.Consumer,{children:function(n){return c.Children.map(e,(function(e){return(0,c.cloneElement)(e,(0,a.Z)({},n))}))}})},B=function(n){var e=function(e){(0,i.Z)(c,e);var t=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),t.apply(this,arguments)}return(0,o.Z)(c,[{key:"render",value:function(){var e=this.props,t=e.forwardedRef,s=(0,r.Z)(e,M);return(0,l.jsx)(U,{children:(0,l.jsx)(n,(0,a.Z)({ref:t},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(n,t){return(0,l.jsx)(e,(0,a.Z)((0,a.Z)({},n),{},{ref:t}))}))},D=function(){return(0,c.useContext)(E)},F=t(15861),T=t(87757),W=t.n(T),G=t(33015),J=t(20418),q=["forwardedRef"],N=new J.Z,X=(0,c.createContext)({}),_=function(n){var e=n.children,t=(0,d.useDispatch)(),r=(0,d.useSelector)((function(n){return n.mints})),s=(0,c.useCallback)((0,F.Z)(W().mark((function n(){var e=arguments;return W().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t(G.ih.apply(void 0,e)).unwrap();case 2:return n.abrupt("return",n.sent);case 3:case"end":return n.stop()}}),n)}))),[t]),o=(0,c.useMemo)((function(){return{mints:r,getMint:s,tokenProvider:N}}),[r,s]);return(0,l.jsx)(X.Provider,{value:o,children:e})},K=function(n){var e=n.children;return(0,l.jsx)(X.Consumer,{children:function(n){return c.Children.map(e,(function(e){return(0,c.cloneElement)(e,(0,a.Z)({},n))}))}})},Q=function(n){var e=function(e){(0,i.Z)(c,e);var t=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),t.apply(this,arguments)}return(0,o.Z)(c,[{key:"render",value:function(){var e=this.props,t=e.forwardedRef,s=(0,r.Z)(e,q);return(0,l.jsx)(K,{children:(0,l.jsx)(n,(0,a.Z)({ref:t},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(n,t){return(0,l.jsx)(e,(0,a.Z)((0,a.Z)({},n),{},{ref:t}))}))},V=function(){return(0,c.useContext)(X)}},20418:function(n,e,t){"use strict";t.d(e,{Z:function(){return k}});var r=t(45987),s=t(15861),o=t(15671),i=t(1413),u=t(87757),a=t.n(u),c=t(11796),d=t(67845),f=t(63805),l=t(31633),p=function(n){return{symbol:"SOL",name:"Solana",address:"11111111111111111111111111111111",decimals:9,chainId:n,extensions:{coingeckoId:"solana"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"}},h=function(n){return{symbol:"SEN",name:"Sen",address:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",decimals:9,chainId:n,extensions:{coingeckoId:"sen"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf/logo.png"}},v=[p(103),h(103),{symbol:"wBTC",name:"Wrapped Bitcoin",address:"8jk4eJymMfNZV9mkRNxJEt2VJ3pRvdJvD5FE94GXGBPM",decimals:9,chainId:103,extensions:{coingeckoId:"bitcoin"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL/logo.png"},{symbol:"wETH",name:"Ethereum",address:"27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c",decimals:9,chainId:103,extensions:{coingeckoId:"ethereum"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf/logo.png"},{symbol:"UNI",name:"Uniswap",address:"FVZFSXu3yn17YdcxLD72TFDUqkdE5xZvcW18EUpRQEbe",decimals:9,chainId:103,extensions:{coingeckoId:"uniswap"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3MVa4e32PaKmPxYUQ6n8vFkWtCma68Ld7e7fTktWDueQ/logo.png"},{symbol:"USDC",name:"USD Coin",address:"2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj",decimals:9,chainId:103,extensions:{coingeckoId:"usd-coin"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"}],m=["address"],Z=l.Z.sol.chainId,g=/[\W_]+/g,w={tokenize:"full",context:!0,minlength:3},x={document:{id:"address",index:[(0,i.Z)({field:"symbol"},w),(0,i.Z)({field:"name"},w)]}},k=function n(){var e=this;(0,o.Z)(this,n),this.tokenMap=void 0,this.engine=void 0,this.chainId=void 0,this.cluster=void 0,this._init=(0,s.Z)(a().mark((function n(){var t;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!Object.keys(e.tokenMap).length){n.next=2;break}return n.abrupt("return",e.tokenMap);case 2:return n.next=4,(new d.DK).resolve();case 4:return n.next=6,n.sent.filterByChainId(e.chainId).getList();case 6:return t=n.sent,"devnet"===e.cluster&&(t=t.concat(v)),(t="testnet"===e.cluster?t.concat([h(102),p(102)]):t.concat([p(101)])).forEach((function(n){return e.tokenMap.set(n.address,n)})),n.abrupt("return",e.tokenMap);case 11:case"end":return n.stop()}}),n)}))),this._engine=(0,s.Z)(a().mark((function n(){var t;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!e.engine){n.next=2;break}return n.abrupt("return",e.engine);case 2:return n.next=4,e._init();case 4:return t=n.sent,e.engine=new c.Document(x),Object.values(t).forEach((function(n){var t=n.address,s=(0,r.Z)(n,m);return e.engine.add(t,s)})),n.abrupt("return",e.engine);case 8:case"end":return n.stop()}}),n)}))),this.all=(0,s.Z)(a().mark((function n(){var t;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e._init();case 2:return t=n.sent,n.abrupt("return",Object.values(t));case 4:case"end":return n.stop()}}),n)}))),this.findByAddress=function(){var n=(0,s.Z)(a().mark((function n(t){var r;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e._init();case 2:return r=n.sent,n.abrupt("return",r.get(t));case 4:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),this.find=function(){var n=(0,s.Z)(a().mark((function n(t,r){var s,o,i;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e._init();case 2:return s=n.sent,n.next=5,e._engine();case 5:return o=n.sent,i=[],t.split(g).forEach((function(n){return o.search(n,r).forEach((function(n){return n.result.forEach((function(n){if(i.findIndex((function(e){return e.address===n}))<0){var e=s.get(n);e&&i.push(e)}}))}))})),n.abrupt("return",i);case 9:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}(),this.tokenMap=new Map,this.engine=void 0,this.chainId=Z,this.cluster=f.ef,this._init()}},33015:function(n,e,t){"use strict";t.d(e,{ih:function(){return d}});var r=t(4942),s=t(15861),o=t(87757),i=t.n(o),u=t(19289),a=t(95418),c="mints",d=(0,u.createAsyncThunk)("".concat(c,"/getMint"),function(){var n=(0,s.Z)(i().mark((function n(e,t){var s,o,u,c,d,f,l,p;return i().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(s=e.address,o=e.force,u=void 0!==o&&o,c=t.getState,a.account.isAddress(s)){n.next=4;break}throw new Error("Invalid mint address");case 4:if(u){n.next=8;break}if(d=c(),!(f=d.accounts[s])){n.next=8;break}return n.abrupt("return",(0,r.Z)({},s,f));case 8:return l=window.sentre.splt,n.next=11,l.getMintData(s);case 11:return p=n.sent,n.abrupt("return",(0,r.Z)({},s,p));case 13:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}()),f=(0,u.createAsyncThunk)("".concat(c,"/upsetMint"),function(){var n=(0,s.Z)(i().mark((function n(e){var t,s;return i().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(t=e.address,s=e.data,a.account.isAddress(t)){n.next=3;break}throw new Error("Invalid address");case 3:if(s){n.next=5;break}throw new Error("Data is empty");case 5:return n.abrupt("return",(0,r.Z)({},t,s));case 6:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}()),l=(0,u.createAsyncThunk)("".concat(c,"/deleteMint"),function(){var n=(0,s.Z)(i().mark((function n(e){var t;return i().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(t=e.address,a.account.isAddress(t)){n.next=3;break}throw new Error("Invalid address");case 3:return n.abrupt("return",{address:t});case 4:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}()),p=(0,u.createSlice)({name:c,initialState:{},reducers:{},extraReducers:function(n){n.addCase(d.fulfilled,(function(n,e){var t=e.payload;Object.assign(n,t)})).addCase(f.fulfilled,(function(n,e){var t=e.payload;Object.assign(n,t)})).addCase(l.fulfilled,(function(n,e){delete n[e.payload.address]}))}});e.ZP=p.reducer},63805:function(n,e,t){"use strict";t.d(e,{OB:function(){return s},ef:function(){return o}});var r=t(53933),s="production",o=function(){switch(r.Z.get("network")){case"devnet":return"devnet";case"testnet":return"testnet";default:return"mainnet"}}()},53933:function(n,e){"use strict";var t="sentre",r=window.localStorage,s=function(n){if(!n)return null;try{return JSON.parse(n)}catch(e){return null}},o={set:function(n,e){var o=s(r.getItem(t));o&&"object"===typeof o||(o={}),o[n]=e,r.setItem(t,JSON.stringify(o))},get:function(n){var e=s(r.getItem(t));return e&&"object"===typeof e?e[n]:null},clear:function(n){o.set(n,null)}};e.Z=o},46601:function(){},89214:function(){},85568:function(){},52361:function(){},94616:function(){},55024:function(){}}]);
//# sourceMappingURL=526.25b850c3.chunk.js.map