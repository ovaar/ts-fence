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
eval("\r\nfunction __export(m) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n__export(__webpack_require__(/*! ./statemachine */ \"./src/statemachine.ts\"));\r\n\n\n//# sourceURL=webpack://node-statemachine/./src/index.ts?");

/***/ }),

/***/ "./src/statemachine.ts":
/*!*****************************!*\
  !*** ./src/statemachine.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = Object.setPrototypeOf ||\r\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar events_1 = __webpack_require__(/*! events */ \"events\");\r\nvar StateAction = /** @class */ (function () {\r\n    function StateAction(method) {\r\n        this.method = method;\r\n    }\r\n    return StateAction;\r\n}());\r\nvar StateTransition = /** @class */ (function (_super) {\r\n    __extends(StateTransition, _super);\r\n    function StateTransition(stateName, fn) {\r\n        var _this = _super.call(this, function transitionTo() {\r\n            var args = [];\r\n            for (var _i = 0; _i < arguments.length; _i++) {\r\n                args[_i] = arguments[_i];\r\n            }\r\n            var returnValue = fn.apply(this, args);\r\n            this.setState(stateName);\r\n            return returnValue;\r\n        }) || this;\r\n        _this.stateName = stateName;\r\n        return _this;\r\n    }\r\n    return StateTransition;\r\n}(StateAction));\r\nexports.StateTransition = StateTransition;\r\nvar StateEvent = /** @class */ (function () {\r\n    function StateEvent(name, action) {\r\n        this.name = name;\r\n        if (action instanceof StateAction) {\r\n            this.action = action;\r\n        }\r\n        else {\r\n            this.action = new StateAction(action);\r\n        }\r\n    }\r\n    return StateEvent;\r\n}());\r\nvar State = /** @class */ (function () {\r\n    function State(name, eventsDescription) {\r\n        this.events = [];\r\n        this.eventNames = [];\r\n        this.name = name;\r\n        for (var _i = 0, _a = Object.entries(eventsDescription); _i < _a.length; _i++) {\r\n            var _b = _a[_i], eventName = _b[0], action = _b[1];\r\n            this.eventNames.push(eventName);\r\n            this.events.push(new StateEvent(eventName, action));\r\n        }\r\n    }\r\n    State.prototype.getEventNames = function () {\r\n        return this.events.map(function (event) { return event.name; });\r\n    };\r\n    return State;\r\n}());\r\nvar StateMachine = /** @class */ (function (_super) {\r\n    __extends(StateMachine, _super);\r\n    function StateMachine(description) {\r\n        var _this = _super.call(this) || this;\r\n        var RESERVED = [StateMachine.STARTING_STATE, StateMachine.STATES];\r\n        var propertiesAndMethods = Object.keys(description).filter(function (property) { return !RESERVED.includes(property); });\r\n        for (var _i = 0, propertiesAndMethods_1 = propertiesAndMethods; _i < propertiesAndMethods_1.length; _i++) {\r\n            var property = propertiesAndMethods_1[_i];\r\n            _this[property] = description[property];\r\n        }\r\n        _this.states = new Map();\r\n        for (var _a = 0, _b = Object.entries(description[StateMachine.STATES]); _a < _b.length; _a++) {\r\n            var _c = _b[_a], stateName = _c[0], events = _c[1];\r\n            _this.states.set(stateName, new State(stateName, events));\r\n        }\r\n        _this.stateName = description[StateMachine.STARTING_STATE];\r\n        _this.setState(_this.stateName);\r\n        return _this;\r\n    }\r\n    StateMachine.prototype.getState = function () {\r\n        return this.states.get(this.stateName);\r\n    };\r\n    StateMachine.prototype.getStateName = function () {\r\n        return this.stateName;\r\n    };\r\n    StateMachine.prototype.getEventNames = function () {\r\n        return this.getState().getEventNames();\r\n    };\r\n    StateMachine.prototype.getAllStatesNames = function () {\r\n        return this.states.keys().slice();\r\n    };\r\n    StateMachine.prototype.setState = function (stateName) {\r\n        var currentState = this.getState();\r\n        for (var _i = 0, _a = currentState.events; _i < _a.length; _i++) {\r\n            var name = _a[_i].name;\r\n            if (typeof this.__proto__[name] === 'function') {\r\n                delete this.__proto__[name];\r\n            }\r\n        }\r\n        // Set the new state\r\n        this.stateName = stateName;\r\n        var state = this.getState();\r\n        for (var _b = 0, _c = state.events; _b < _c.length; _b++) {\r\n            var _d = _c[_b], name = _d.name, action = _d.action;\r\n            this.__proto__[name] = action.method.bind(this);\r\n        }\r\n        this.emit('transition', this.stateName);\r\n    };\r\n    StateMachine.STATE = Symbol(\"state\");\r\n    StateMachine.STATES = Symbol(\"states\");\r\n    StateMachine.STARTING_STATE = Symbol(\"starting-state\");\r\n    return StateMachine;\r\n}(events_1.EventEmitter));\r\nexports.StateMachine = StateMachine;\r\n\n\n//# sourceURL=webpack://node-statemachine/./src/statemachine.ts?");

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! D:\\git\\node-statemachine\\src\\index.ts */\"./src/index.ts\");\n\n\n//# sourceURL=webpack://node-statemachine/multi_./src/index.ts?");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"events\");\n\n//# sourceURL=webpack://node-statemachine/external_%22events%22?");

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map