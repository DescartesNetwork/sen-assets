(self.webpackChunksenhub=self.webpackChunksenhub||[]).push([[449],{99800:function(e,n,r){"use strict";r.r(n),r.d(n,{AccountProvider:function(){return M},MintProvider:function(){return le},PoolProvider:function(){return k},UIProvider:function(){return v},WalletProvider:function(){return A},useAccount:function(){return N},useMint:function(){return ve},usePool:function(){return C},useUI:function(){return g},useWallet:function(){return R},withAccount:function(){return U},withMint:function(){return he},withPool:function(){return y},withUI:function(){return x},withWallet:function(){return P}});var t=r(45987),s=r(15671),i=r(43144),o=r(60136),u=r(27277),a=r(1413),c=r(92950),d=r(55754),f=r(78589),l=r(45263),p=["forwardedRef"],h=(0,c.createContext)({}),v=function(e){var n=e.children,r=e.appId,t=e.style,s=void 0===t?{}:t,i=e.antd,o=void 0!==i&&i,u=(0,d.useSelector)((function(e){return e.ui})),p=(0,c.useMemo)((function(){return{ui:u}}),[u]);return(0,l.jsx)(h.Provider,{value:p,children:(0,l.jsx)("section",{id:r,style:(0,a.Z)({backgroundColor:"transparent"},s),children:o?(0,l.jsx)(f.ConfigProvider,{prefixCls:r,getPopupContainer:function(){return document.getElementById(r)},children:n}):n})})},m=function(e){var n=e.children;return(0,l.jsx)(h.Consumer,{children:function(e){return c.Children.map(n,(function(n){return(0,c.cloneElement)(n,(0,a.Z)({},e))}))}})},x=function(e){var n=function(n){(0,o.Z)(c,n);var r=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),r.apply(this,arguments)}return(0,i.Z)(c,[{key:"render",value:function(){var n=this.props,r=n.forwardedRef,s=(0,t.Z)(n,p);return(0,l.jsx)(m,{children:(0,l.jsx)(e,(0,a.Z)({ref:r},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(e,r){return(0,l.jsx)(n,(0,a.Z)((0,a.Z)({},e),{},{ref:r}))}))},g=function(){return(0,c.useContext)(h)},w=["forwardedRef"],Z=(0,c.createContext)({}),k=function(e){var n=e.children,r=(0,d.useSelector)((function(e){return e.pools})),t=(0,c.useMemo)((function(){return{pools:r}}),[r]);return(0,l.jsx)(Z.Provider,{value:t,children:n})},b=function(e){var n=e.children;return(0,l.jsx)(Z.Consumer,{children:function(e){return c.Children.map(n,(function(n){return(0,c.cloneElement)(n,(0,a.Z)({},e))}))}})},y=function(e){var n=function(n){(0,o.Z)(c,n);var r=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),r.apply(this,arguments)}return(0,i.Z)(c,[{key:"render",value:function(){var n=this.props,r=n.forwardedRef,s=(0,t.Z)(n,w);return(0,l.jsx)(b,{children:(0,l.jsx)(e,(0,a.Z)({ref:r},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(e,r){return(0,l.jsx)(n,(0,a.Z)((0,a.Z)({},e),{},{ref:r}))}))},C=function(){return(0,c.useContext)(Z)},j=["forwardedRef"],I=(0,c.createContext)({}),A=function(e){var n=e.children,r=(0,d.useSelector)((function(e){return e.wallet})),t=(0,c.useMemo)((function(){return{wallet:r}}),[r]);return(0,l.jsx)(I.Provider,{value:t,children:n})},E=function(e){var n=e.children;return(0,l.jsx)(I.Consumer,{children:function(e){return c.Children.map(n,(function(n){return(0,c.cloneElement)(n,(0,a.Z)({},e))}))}})},P=function(e){var n=function(n){(0,o.Z)(c,n);var r=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),r.apply(this,arguments)}return(0,i.Z)(c,[{key:"render",value:function(){var n=this.props,r=n.forwardedRef,s=(0,t.Z)(n,j);return(0,l.jsx)(E,{children:(0,l.jsx)(e,(0,a.Z)({ref:r},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(e,r){return(0,l.jsx)(n,(0,a.Z)((0,a.Z)({},e),{},{ref:r}))}))},R=function(){return(0,c.useContext)(I)},S=["forwardedRef"],L=(0,c.createContext)({}),M=function(e){var n=e.children,r=(0,d.useSelector)((function(e){return e.accounts})),t=(0,c.useMemo)((function(){return{accounts:r}}),[r]);return(0,l.jsx)(L.Provider,{value:t,children:n})},B=function(e){var n=e.children;return(0,l.jsx)(L.Consumer,{children:function(e){return c.Children.map(n,(function(n){return(0,c.cloneElement)(n,(0,a.Z)({},e))}))}})},U=function(e){var n=function(n){(0,o.Z)(c,n);var r=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),r.apply(this,arguments)}return(0,i.Z)(c,[{key:"render",value:function(){var n=this.props,r=n.forwardedRef,s=(0,t.Z)(n,S);return(0,l.jsx)(B,{children:(0,l.jsx)(e,(0,a.Z)({ref:r},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(e,r){return(0,l.jsx)(n,(0,a.Z)((0,a.Z)({},e),{},{ref:r}))}))},N=function(){return(0,c.useContext)(L)},D=r(15861),T=r(87757),G=r.n(T),J=r(4942),F=r(19289),V=r(95418),W="mints",K=(0,F.createAsyncThunk)("".concat(W,"/getMint"),function(){var e=(0,D.Z)(G().mark((function e(n,r){var t,s,i,o,u,a,c,d;return G().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=n.address,s=n.force,i=void 0!==s&&s,o=r.getState,V.account.isAddress(t)){e.next=4;break}throw new Error("Invalid mint address");case 4:if(i){e.next=8;break}if(u=o(),!(a=u.accounts[t])){e.next=8;break}return e.abrupt("return",(0,J.Z)({},t,a));case 8:return c=window.sentre.splt,e.next=11,c.getMintData(t);case 11:return d=e.sent,e.abrupt("return",(0,J.Z)({},t,d));case 13:case"end":return e.stop()}}),e)})));return function(n,r){return e.apply(this,arguments)}}()),Y=(0,F.createAsyncThunk)("".concat(W,"/upsetMint"),function(){var e=(0,D.Z)(G().mark((function e(n){var r,t;return G().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=n.address,t=n.data,V.account.isAddress(r)){e.next=3;break}throw new Error("Invalid address");case 3:if(t){e.next=5;break}throw new Error("Data is empty");case 5:return e.abrupt("return",(0,J.Z)({},r,t));case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),X=(0,F.createAsyncThunk)("".concat(W,"/deleteMint"),function(){var e=(0,D.Z)(G().mark((function e(n){var r;return G().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=n.address,V.account.isAddress(r)){e.next=3;break}throw new Error("Invalid address");case 3:return e.abrupt("return",{address:r});case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()),_=((0,F.createSlice)({name:W,initialState:{},reducers:{},extraReducers:function(e){e.addCase(K.fulfilled,(function(e,n){var r=n.payload;Object.assign(e,r)})).addCase(Y.fulfilled,(function(e,n){var r=n.payload;Object.assign(e,r)})).addCase(X.fulfilled,(function(e,n){delete e[n.payload.address]}))}}).reducer,r(11796)),q=r(67845),H=r(63805),z={spltAddress:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",splataAddress:"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"},O={devnet:(0,a.Z)((0,a.Z)({},z),{},{node:"https://api.devnet.solana.com",chainId:103,senAddress:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",senPoolAddress:"3EUPL7YQLbU6DNU5LZeQeHPXTf1MigJ2yASXA9rH5Ku4",swapAddress:"4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF",taxmanAddress:"8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9"}),testnet:(0,a.Z)((0,a.Z)({},z),{},{node:"https://api.testnet.solana.com",chainId:102,senAddress:"",senPoolAddress:"",swapAddress:"",taxmanAddress:""}),mainnet:(0,a.Z)((0,a.Z)({},z),{},{node:"https://api.mainnet-beta.solana.com",chainId:101,senAddress:"SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M",senPoolAddress:"",swapAddress:"SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV",taxmanAddress:"9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e"})};var Q=(0,J.Z)({},"senhub",{url:"https://descartesnetwork.github.io/senhub/index.js",appId:"senhub",name:"SenHub",author:{name:"Sentre",email:"hi@sentre.io"},tags:"solana,dapps".split(","),description:"A sample project for Sentre developers",verified:!1}),$={development:{extra:Q,senreg:"https://descartesnetwork.github.io/senreg/register.json"},staging:{extra:Q,senreg:"https://descartesnetwork.github.io/senreg/register.json"},production:{extra:{},senreg:"https://descartesnetwork.github.io/senreg/register.json"}},ee={sol:O[H.ef],register:$[H.OB]},ne=[{symbol:"SEN",name:"Sen",address:"SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M",decimals:9,chainId:103,extensions:{},logoURI:"https://raw.githubusercontent.com/DescartesNetwork/sen-static/master/logo.png"}],re=[{symbol:"wBTC",name:"Wrapped Bitcoin",address:"8jk4eJymMfNZV9mkRNxJEt2VJ3pRvdJvD5FE94GXGBPM",decimals:9,chainId:103,extensions:{coingeckoId:"bitcoin"},logoURI:"https://assets.coingecko.com/coins/images/1/large/bitcoin.png"},{symbol:"wETH",name:"Ethereum",address:"27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c",decimals:9,chainId:103,extensions:{coingeckoId:"ethereum"},logoURI:"https://assets.coingecko.com/coins/images/279/large/ethereum.png"},{symbol:"SEN",name:"Sen",address:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",decimals:9,chainId:103,extensions:{coingeckoId:"dai"},logoURI:"https://raw.githubusercontent.com/DescartesNetwork/sen-static/master/logo.png"},{symbol:"UNI",name:"Uniswap",address:"FVZFSXu3yn17YdcxLD72TFDUqkdE5xZvcW18EUpRQEbe",decimals:9,chainId:103,extensions:{coingeckoId:"uniswap"},logoURI:"https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png"},{symbol:"CAKE",name:"PancakeSwap",address:"2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj",decimals:9,chainId:103,extensions:{coingeckoId:"pancakeswap-token"},logoURI:"https://assets.coingecko.com/coins/images/12632/large/IMG_0440.PNG"}],te=["address"],se=ee.sol.chainId,ie=/[\W_]+/g,oe={tokenize:"full",context:!0,minlength:3},ue={document:{id:"address",index:[(0,a.Z)({field:"symbol"},oe),(0,a.Z)({field:"name"},oe)]}},ae=function e(){var n=this;(0,s.Z)(this,e),this.tokenList=void 0,this.engine=void 0,this.chainId=void 0,this.cluster=void 0,this._init=(0,D.Z)(G().mark((function e(){var r;return G().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n.tokenList.length){e.next=2;break}return e.abrupt("return",n.tokenList);case 2:return e.next=4,(new q.DK).resolve();case 4:return e.next=6,e.sent.filterByChainId(n.chainId).getList();case 6:return r=e.sent,"devnet"===n.cluster?n.tokenList=r.concat(re):n.tokenList=r.concat(ne),e.abrupt("return",n.tokenList);case 9:case"end":return e.stop()}}),e)}))),this._engine=(0,D.Z)(G().mark((function e(){var r;return G().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n.engine){e.next=2;break}return e.abrupt("return",n.engine);case 2:return e.next=4,n._init();case 4:return r=e.sent,n.engine=new _.Document(ue),r.forEach((function(e){var r=e.address,s=(0,t.Z)(e,te);return n.engine.add(r,s)})),e.abrupt("return",n.engine);case 8:case"end":return e.stop()}}),e)}))),this.all=(0,D.Z)(G().mark((function e(){return G().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n._init();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)}))),this.findByAddress=function(){var e=(0,D.Z)(G().mark((function e(r){var t;return G().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n._init();case 2:return t=e.sent,e.abrupt("return",t.find((function(e){return e.address===r})));case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),this.find=function(){var e=(0,D.Z)(G().mark((function e(r,t){var s,i,o;return G().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n._init();case 2:return s=e.sent,e.next=5,n._engine();case 5:return i=e.sent,o=[],r.split(ie).forEach((function(e){return i.search(e,t).forEach((function(e){return e.result.forEach((function(e){if(o.findIndex((function(n){return n.address===e}))<0){var n=s.find((function(n){return n.address===e}));n&&o.push(n)}}))}))})),e.abrupt("return",o);case 9:case"end":return e.stop()}}),e)})));return function(n,r){return e.apply(this,arguments)}}(),this.tokenList=[],this.engine=void 0,this.chainId=se,this.cluster=H.ef,this._init()},ce=["forwardedRef"],de=new ae,fe=(0,c.createContext)({}),le=function(e){var n=e.children,r=(0,d.useDispatch)(),t=(0,d.useSelector)((function(e){return e.mints})),s=(0,c.useCallback)((0,D.Z)(G().mark((function e(){var n=arguments;return G().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r(K.apply(void 0,n)).unwrap();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)}))),[r]),i=(0,c.useMemo)((function(){return{mints:t,getMint:s,tokenProvider:de}}),[t,s]);return(0,l.jsx)(fe.Provider,{value:i,children:n})},pe=function(e){var n=e.children;return(0,l.jsx)(fe.Consumer,{children:function(e){return c.Children.map(n,(function(n){return(0,c.cloneElement)(n,(0,a.Z)({},e))}))}})},he=function(e){var n=function(n){(0,o.Z)(c,n);var r=(0,u.Z)(c);function c(){return(0,s.Z)(this,c),r.apply(this,arguments)}return(0,i.Z)(c,[{key:"render",value:function(){var n=this.props,r=n.forwardedRef,s=(0,t.Z)(n,ce);return(0,l.jsx)(pe,{children:(0,l.jsx)(e,(0,a.Z)({ref:r},s))})}}]),c}(c.Component);return(0,c.forwardRef)((function(e,r){return(0,l.jsx)(n,(0,a.Z)((0,a.Z)({},e),{},{ref:r}))}))},ve=function(){return(0,c.useContext)(fe)}},63805:function(e,n,r){"use strict";r.d(n,{OB:function(){return s},ef:function(){return i}});var t=r(53933),s="production",i=function(){switch(t.Z.get("network")){case"devnet":return"devnet";case"testnet":return"testnet";default:return"mainnet"}}()},53933:function(e,n){"use strict";var r="sentre",t=window.localStorage,s=function(e){if(!e)return null;try{return JSON.parse(e)}catch(n){return null}},i={set:function(e,n){var i=s(t.getItem(r));i&&"object"===typeof i||(i={}),i[e]=n,t.setItem(r,JSON.stringify(i))},get:function(e){var n=s(t.getItem(r));return n&&"object"===typeof n?n[e]:null},clear:function(e){i.set(e,null)}};n.Z=i},46601:function(){},89214:function(){},85568:function(){},52361:function(){},94616:function(){},55024:function(){}}]);
//# sourceMappingURL=449.82875ba3.chunk.js.map