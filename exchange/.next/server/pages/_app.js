"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 656:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wagmi_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(534);
/* harmony import */ var _wagmi_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wagmi_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wagmi_core_providers_public__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(794);
/* harmony import */ var _wagmi_core_providers_public__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wagmi_core_providers_public__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _web3modal_ethereum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(703);
/* harmony import */ var _web3modal_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(867);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_web3modal_ethereum__WEBPACK_IMPORTED_MODULE_3__, _web3modal_react__WEBPACK_IMPORTED_MODULE_4__]);
([_web3modal_ethereum__WEBPACK_IMPORTED_MODULE_3__, _web3modal_react__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





// Get Your projectId at https://cloud.walletconnect.com
const WC_PROJECT_ID = "4c3254ea8566374e9981f957795a34d0";
// Configure chains and providers (rpc's)
const { chains , provider  } = (0,_wagmi_core__WEBPACK_IMPORTED_MODULE_1__.configureChains)([
    _wagmi_core__WEBPACK_IMPORTED_MODULE_1__.chain.polygonMumbai
], [
    (0,_wagmi_core_providers_public__WEBPACK_IMPORTED_MODULE_2__.publicProvider)()
]);
// Create wagmi client
const wagmiClient = (0,_wagmi_core__WEBPACK_IMPORTED_MODULE_1__.createClient)({
    autoConnect: true,
    connectors: _web3modal_ethereum__WEBPACK_IMPORTED_MODULE_3__.Web3ModalEthereum.defaultConnectors({
        chains,
        appName: "web3Modal"
    }),
    provider
});
// Configure web3modal
const modalConfig = {
    projectId: WC_PROJECT_ID,
    theme: "dark",
    accentColor: "orange"
};
function MyApp({ Component , pageProps  }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_web3modal_react__WEBPACK_IMPORTED_MODULE_4__.Web3ModalProvider, {
        config: modalConfig,
        ethereumClient: wagmiClient,
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
            ...pageProps
        })
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 534:
/***/ ((module) => {

module.exports = require("@wagmi/core");

/***/ }),

/***/ 794:
/***/ ((module) => {

module.exports = require("@wagmi/core/providers/public");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 703:
/***/ ((module) => {

module.exports = import("@web3modal/ethereum");;

/***/ }),

/***/ 867:
/***/ ((module) => {

module.exports = import("@web3modal/react");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(656));
module.exports = __webpack_exports__;

})();