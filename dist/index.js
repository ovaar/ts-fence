(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["node-statemachine"] = factory();
	else
		root["node-statemachine"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst statemachine_1 = __webpack_require__(/*! ./statemachine */ \"./src/statemachine.ts\");\r\nclass AccountStateMachine extends statemachine_1.StateMachine {\r\n    constructor() {\r\n        super();\r\n        this.balance = 0;\r\n        this.setDescription({\r\n            [this.STARTING_STATE]: 'open',\r\n            [this.STATES]: {\r\n                'open': {\r\n                    'deposit'(amount) {\r\n                        console.log(`Add balance ${amount}`, this);\r\n                        this.balance = this.balance + amount;\r\n                    },\r\n                    'withdraw'(amount) { this.balance = this.balance - amount; },\r\n                    'placeHold': this.transitionsTo('held', () => undefined),\r\n                    'close': this.transitionsTo('closed', function () {\r\n                        if (this.balance > 0) {\r\n                            // ...transfer balance to suspension account\r\n                        }\r\n                    })\r\n                },\r\n                'held': {\r\n                    'removeHold': this.transitionsTo('open', () => undefined),\r\n                    'deposit'(amount) { this.balance = this.balance + amount; },\r\n                    'close': this.transitionsTo('closed', function () {\r\n                        if (this.balance > 0) {\r\n                            // ...transfer balance to suspension account\r\n                        }\r\n                    })\r\n                },\r\n                'closed': {\r\n                    'reopen': this.transitionsTo('open', function () {\r\n                        // ...restore balance if applicable\r\n                    })\r\n                }\r\n            }\r\n        });\r\n        // console.log(this);\r\n    }\r\n}\r\nconst accountMachine = new AccountStateMachine();\r\nconsole.log(accountMachine.getState().deposit(10));\r\n// console.log('CURRENTSTATE=',accountMachine.getStateName());\r\n// console.log('STATE=',accountMachine.getState());\r\n// accountMachine.getState().deposit(10);\r\n// console.log(accountMachine.balance)\r\n\n\n//# sourceURL=webpack://node-statemachine/./src/index.ts?");

/***/ }),

/***/ "./src/statemachine.ts":
/*!*****************************!*\
  !*** ./src/statemachine.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass StateMachine {\r\n    constructor() {\r\n        this.STATE = Symbol(\"state\");\r\n        this.STATES = Symbol(\"states\");\r\n        this.STARTING_STATE = Symbol(\"starting-state\");\r\n        this.machine = {};\r\n    }\r\n    setDescription(description) {\r\n        const RESERVED = [this.STARTING_STATE, this.STATES];\r\n        // Handle all the initial states and/or methods\r\n        const propertiesAndMethods = Object.keys(description).filter(property => !RESERVED.includes(property));\r\n        for (const property of propertiesAndMethods) {\r\n            this.machine[property] = description[property];\r\n        }\r\n        // now its states\r\n        this.machine[this.STATES] = description[this.STATES];\r\n        // what event handlers does it have?\r\n        const eventNames = Object.entries(description[this.STATES]).reduce((eventNames, [state, stateDescription]) => {\r\n            const eventNamesForThisState = Object.keys(stateDescription);\r\n            for (const eventName of eventNamesForThisState) {\r\n                eventNames.add(eventName);\r\n            }\r\n            return eventNames;\r\n        }, new Set());\r\n        console.log(eventNames);\r\n        // define the delegating methods\r\n        for (const eventName of eventNames) {\r\n            this.machine[eventName] = function (...args) {\r\n                const handler = this[this.STATE][eventName];\r\n                if (typeof handler === 'function') {\r\n                    return this[this.STATE][eventName].apply(this, args);\r\n                }\r\n                else {\r\n                    throw `invalid event ${eventName}`;\r\n                }\r\n            };\r\n            console.log(this.machine[eventName].toString());\r\n        }\r\n        // set the starting state\r\n        this.machine[this.STATE] = description[this.STATES][description[this.STARTING_STATE]];\r\n        this.machine[this.STATE].name = description[this.STARTING_STATE];\r\n        // we're done\r\n    }\r\n    transitionsTo(stateName, fn) {\r\n        return function (...args) {\r\n            const returnValue = fn.apply(this, args);\r\n            this[this.STATE] = this[this.STATES][stateName];\r\n            this[this.STATE].name = stateName;\r\n            return returnValue;\r\n        };\r\n    }\r\n    getState() {\r\n        return this.machine[this.STATE];\r\n    }\r\n    getStateName() {\r\n        return this.getState().name;\r\n    }\r\n}\r\nexports.StateMachine = StateMachine;\r\n\n\n//# sourceURL=webpack://node-statemachine/./src/statemachine.ts?");

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! D:\\GIT\\node-statemachine\\src\\index.ts */\"./src/index.ts\");\n\n\n//# sourceURL=webpack://node-statemachine/multi_./src/index.ts?");

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map