// /*
//  * author: wendu
//  * email: 824783146@qq.com
//  * source code: https://github.com/wendux/Ajax-hook
//  **/
// module.exports = function(ob) {
//   ob.hookAjax = function(proxy) {
//       window._ahrealxhr = window._ahrealxhr || XMLHttpRequest
//       XMLHttpRequest = function() {
//           var xhr = new window._ahrealxhr;
//           Object.defineProperty(this, 'xhr', {
//               value: xhr
//           })
//       }

//       var prototype = window._ahrealxhr.prototype;
//       for (var attr in prototype) {
//           var type = "";
//           try {
//               type = typeof prototype[attr]
//           } catch (e) {}
//           if (type === "function") {
//               XMLHttpRequest.prototype[attr] = hookfun(attr);
//           } else {
//               Object.defineProperty(XMLHttpRequest.prototype, attr, {
//                   get: getFactory(attr),
//                   set: setFactory(attr),
//                   enumerable: true
//               })
//           }
//       }

//       function getFactory(attr) {
//           return function() {
//               var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
//               var attrGetterHook = (proxy[attr] || {})["getter"]
//               return attrGetterHook && attrGetterHook(v, this) || v
//           }
//       }

//       function setFactory(attr) {
//           return function(v) {
//               var xhr = this.xhr;
//               var that = this;
//               var hook = proxy[attr];
//               if (typeof hook === "function") {
//                   xhr[attr] = function() {
//                       proxy[attr](that) || v.apply(xhr, arguments);
//                   }
//               } else {
//                   //If the attribute isn't writeable, generate proxy attribute
//                   var attrSetterHook = (hook || {})["setter"];
//                   v = attrSetterHook && attrSetterHook(v, that) || v
//                   try {
//                       xhr[attr] = v;
//                   } catch (e) {
//                       this[attr + "_"] = v;
//                   }
//               }
//           }
//       }

//       function hookfun(fun) {
//           return function() {
//               var args = [].slice.call(arguments)
//               if (proxy[fun] && proxy[fun].call(this, args, this.xhr)) {
//                   return;
//               }
//               return this.xhr[fun].apply(this.xhr, args);
//           }
//       }
//       return window._ahrealxhr;
//   }
//   ob.unHookAjax = function() {
//       if (window._ahrealxhr) XMLHttpRequest = window._ahrealxhr;
//       window._ahrealxhr = undefined;
//   }
//   //for typescript
//   ob["default"] = ob;
// }

!function(t){function r(n){if(e[n])return e[n].exports;var o=e[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var e={};return r.m=t,r.c=e,r.p="",r(0)}([function(t,r,e){e(1)(window)},function(t,r){t.exports=function(t){t.hookAjax=function(t){function r(r){return function(){var e=this.hasOwnProperty(r+"_")?this[r+"_"]:this.xhr[r],n=(t[r]||{}).getter;return n&&n(e,this)||e}}function e(r){return function(e){var n=this.xhr,o=this,i=t[r];if("function"==typeof i)n[r]=function(){t[r](o)||e.apply(n,arguments)};else{var a=(i||{}).setter;e=a&&a(e,o)||e;try{n[r]=e}catch(t){this[r+"_"]=e}}}}function n(r){return function(){var e=[].slice.call(arguments);if(!t[r]||!t[r].call(this,e,this.xhr))return this.xhr[r].apply(this.xhr,e)}}window._ahrealxhr=window._ahrealxhr||XMLHttpRequest,XMLHttpRequest=function(){var t=new window._ahrealxhr;Object.defineProperty(this,"xhr",{value:t})};var o=window._ahrealxhr.prototype;for(var i in o){var a="";try{a=typeof o[i]}catch(t){}"function"===a?XMLHttpRequest.prototype[i]=n(i):Object.defineProperty(XMLHttpRequest.prototype,i,{get:r(i),set:e(i),enumerable:!0})}return window._ahrealxhr},t.unHookAjax=function(){window._ahrealxhr&&(XMLHttpRequest=window._ahrealxhr),window._ahrealxhr=void 0},t.default=t}}]);
