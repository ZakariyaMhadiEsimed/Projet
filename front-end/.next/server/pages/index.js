"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/index";
exports.ids = ["pages/index"];
exports.modules = {

/***/ "./constants/RouteList.ts":
/*!********************************!*\
  !*** ./constants/RouteList.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"routeList\": () => (/* binding */ routeList),\n/* harmony export */   \"uriList\": () => (/* binding */ uriList)\n/* harmony export */ });\nconst uriList = {\n  login: '/login'\n};\nconst routeList = [{\n  path: uriList.login,\n  isProtected: false\n}];//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb25zdGFudHMvUm91dGVMaXN0LnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBU08sTUFBTUEsT0FBTyxHQUFHO0VBQ3RCQyxLQUFLLEVBQUU7QUFEZSxDQUFoQjtBQUlBLE1BQU1DLFNBQTZCLEdBQUcsQ0FDNUM7RUFDQ0MsSUFBSSxFQUFFSCxPQUFPLENBQUNDLEtBRGY7RUFFQ0csV0FBVyxFQUFFO0FBRmQsQ0FENEMsQ0FBdEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZXQtZnJvbnQvLi9jb25zdGFudHMvUm91dGVMaXN0LnRzP2RkOWUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlclByaXZpbGVnZXMgfSBmcm9tICcuL1ByaXZpbGVnZXNMaXN0J1xyXG5cclxuZXhwb3J0IHR5cGUgUm91dGVPYmplY3QgPSB7XHJcblx0cGF0aDogc3RyaW5nXHJcblx0cmVxdWlyZWRQcml2aWxlZ2U/OiBudW1iZXIgfCB1bmRlZmluZWRcclxuXHRpc1Byb3RlY3RlZDogYm9vbGVhblxyXG5cdHRpdGxlVHJhbnNsYXRpb24/OiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHVyaUxpc3QgPSB7XHJcblx0bG9naW46ICcvbG9naW4nLFxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgcm91dGVMaXN0OiBBcnJheTxSb3V0ZU9iamVjdD4gPSBbXHJcblx0e1xyXG5cdFx0cGF0aDogdXJpTGlzdC5sb2dpbixcclxuXHRcdGlzUHJvdGVjdGVkOiBmYWxzZSxcclxuXHR9XHJcbl1cclxuIl0sIm5hbWVzIjpbInVyaUxpc3QiLCJsb2dpbiIsInJvdXRlTGlzdCIsInBhdGgiLCJpc1Byb3RlY3RlZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./constants/RouteList.ts\n");

/***/ }),

/***/ "./pages/index.tsx":
/*!*************************!*\
  !*** ./pages/index.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ \"react-redux\");\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _constants_RouteList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/RouteList */ \"./constants/RouteList.ts\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__);\n/* eslint-disable react-hooks/exhaustive-deps */\n////////LIBRARY/////////\n\n\n ///////COMPONENTS///////\n\n\n\n\n\n\nconst Home = () => {\n  const {\n    user\n  } = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useSelector)(state => ({\n    user: state.user\n  }), react_redux__WEBPACK_IMPORTED_MODULE_1__.shallowEqual);\n  const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)(); /////////////////////////////// USE EFFECT /////////////////////////////////////\n  // Test user profile to do the proper redirect\n  // Note that here, we are authenticated\n\n  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n    if (!(0,lodash__WEBPACK_IMPORTED_MODULE_2__.isEqual)(user.identity, {}) && user.isConnected) {\n      router.replace(_constants_RouteList__WEBPACK_IMPORTED_MODULE_3__.uriList.users);\n    } else {\n      router.replace(_constants_RouteList__WEBPACK_IMPORTED_MODULE_3__.uriList.login);\n    }\n  }, [user]); ///////////////////////////////// RENDER ///////////////////////////////////////\n\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {}, void 0, false);\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9pbmRleC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7Q0FFQTs7QUFFQTtBQUNBOzs7O0FBRUEsTUFBTU0sSUFBYyxHQUFHLE1BQU07RUFFNUIsTUFBTTtJQUFFQztFQUFGLElBQVdMLHdEQUFXLENBQzFCTSxLQUFELEtBQXVCO0lBQ3RCRCxJQUFJLEVBQUVDLEtBQUssQ0FBQ0Q7RUFEVSxDQUF2QixDQUQyQixFQUkzQk4scURBSjJCLENBQTVCO0VBTUEsTUFBTVEsTUFBTSxHQUFHSixzREFBUyxFQUF4QixDQVI0QixDQVU1QjtFQUVBO0VBQ0E7O0VBQ0FMLGdEQUFTLENBQUMsTUFBTTtJQUNmLElBQUksQ0FBQ0csK0NBQU8sQ0FBQ0ksSUFBSSxDQUFDRyxRQUFOLEVBQWdCLEVBQWhCLENBQVIsSUFBK0JILElBQUksQ0FBQ0ksV0FBeEMsRUFBcUQ7TUFDcERGLE1BQU0sQ0FBQ0csT0FBUCxDQUFlUiwrREFBZjtJQUNBLENBRkQsTUFFTztNQUNOSyxNQUFNLENBQUNHLE9BQVAsQ0FBZVIsK0RBQWY7SUFDQTtFQUNELENBTlEsRUFNTixDQUFDRyxJQUFELENBTk0sQ0FBVCxDQWQ0QixDQXNCNUI7O0VBRUEsb0JBQU8sNklBQVA7QUFDQSxDQXpCRDs7QUEyQkEsaUVBQWVELElBQWYiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZXQtZnJvbnQvLi9wYWdlcy9pbmRleC50c3g/MDdmZiJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHMgKi9cclxuLy8vLy8vLy9MSUJSQVJZLy8vLy8vLy8vXHJcbmltcG9ydCB7IE5leHRQYWdlIH0gZnJvbSAnbmV4dCdcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IHNoYWxsb3dFcXVhbCwgdXNlU2VsZWN0b3IgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IHsgaXNFcXVhbCB9IGZyb20gJ2xvZGFzaCdcclxuLy8vLy8vL0NPTVBPTkVOVFMvLy8vLy8vXHJcbmltcG9ydCB7IFJvb3RTdGF0ZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvc3RvcmUvc3RvcmUuaW50ZXJmYWNlcydcclxuaW1wb3J0IHsgdXJpTGlzdCB9IGZyb20gJy4uL2NvbnN0YW50cy9Sb3V0ZUxpc3QnXHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJ1xyXG5cclxuY29uc3QgSG9tZTogTmV4dFBhZ2UgPSAoKSA9PiB7XHJcblxyXG5cdGNvbnN0IHsgdXNlciB9ID0gdXNlU2VsZWN0b3IoXHJcblx0XHQoc3RhdGU6IFJvb3RTdGF0ZSkgPT4gKHtcclxuXHRcdFx0dXNlcjogc3RhdGUudXNlcixcclxuXHRcdH0pLFxyXG5cdFx0c2hhbGxvd0VxdWFsXHJcblx0KVxyXG5cdGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXHJcblxyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gVVNFIEVGRkVDVCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cdC8vIFRlc3QgdXNlciBwcm9maWxlIHRvIGRvIHRoZSBwcm9wZXIgcmVkaXJlY3RcclxuXHQvLyBOb3RlIHRoYXQgaGVyZSwgd2UgYXJlIGF1dGhlbnRpY2F0ZWRcclxuXHR1c2VFZmZlY3QoKCkgPT4ge1xyXG5cdFx0aWYgKCFpc0VxdWFsKHVzZXIuaWRlbnRpdHksIHt9KSAmJiB1c2VyLmlzQ29ubmVjdGVkKSB7XHJcblx0XHRcdHJvdXRlci5yZXBsYWNlKHVyaUxpc3QudXNlcnMpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyb3V0ZXIucmVwbGFjZSh1cmlMaXN0LmxvZ2luKVxyXG5cdFx0fVxyXG5cdH0sIFt1c2VyXSlcclxuXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIFJFTkRFUiAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblx0cmV0dXJuIDw+PC8+XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhvbWVcclxuIl0sIm5hbWVzIjpbInVzZUVmZmVjdCIsInNoYWxsb3dFcXVhbCIsInVzZVNlbGVjdG9yIiwiaXNFcXVhbCIsInVyaUxpc3QiLCJ1c2VSb3V0ZXIiLCJIb21lIiwidXNlciIsInN0YXRlIiwicm91dGVyIiwiaWRlbnRpdHkiLCJpc0Nvbm5lY3RlZCIsInJlcGxhY2UiLCJ1c2VycyIsImxvZ2luIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/index.tsx\n");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react-redux":
/*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("react-redux");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/index.tsx"));
module.exports = __webpack_exports__;

})();