!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("react-collapse"),require("react-dom")):"function"==typeof define&&define.amd?define(["react","react-collapse","react-dom"],t):"object"==typeof exports?exports.Collapsible=t(require("react"),require("react-collapse"),require("react-dom")):n.Collapsible=t(n.react,n["react-collapse"],n["react-dom"])}(this,function(n,t,e){return function(n){function t(o){if(e[o])return e[o].exports;var i=e[o]={exports:{},id:o,loaded:!1};return n[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var e={};return t.m=n,t.c=e,t.p="",t(0)}([function(n,t,e){"use strict";function o(n){return n&&n.__esModule?n:{"default":n}}function i(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}function r(n,t){if(!n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?n:t}function u(n,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);n.prototype=Object.create(t&&t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(n,t):n.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var c=function(){function n(n,t){for(var e=0;e<t.length;e++){var o=t[e];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(n,o.key,o)}}return function(t,e,o){return e&&n(t.prototype,e),o&&n(t,o),t}}(),a=e(4),s=o(a),p=e(5),f=o(p),l=e(6),d=e(3),m=o(d),h=/Firefox/.test(navigator.userAgent)?document.documentElement:document.body,w=function(n){function t(){return i(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return u(t,n),c(t,[{key:"scroll",value:function(n){var t=this;this.props.isOpened&&this.props.autoScroll&&(setTimeout(function(){var e=(0,l.findDOMNode)(t.refs.collapsible),o=e.getBoundingClientRect().top,i=t.props.fixedHeight||n,r=document.body.getBoundingClientRect().top,u=o-r+i+40;u>window.innerHeight&&(u-=window.innerHeight,u>window.scrollY&&m["default"].top(h,u))},0),"function"==typeof this.props.onHeightReady&&this.props.onHeightReady(n))}},{key:"render",value:function(){var n=this.props,t=n.isOpened,e=n.style,o=n.fixedHeight,i=this.props.className||"";return s["default"].createElement(f["default"],{isOpened:t,style:e,ref:"collapsible",keepCollapsedContent:!0,className:i,onHeightReady:this.scroll.bind(this),fixedHeight:o},this.props.children)}}]),t}(a.Component);t["default"]=w,w.propTypes={isOpened:a.PropTypes.bool,style:a.PropTypes.object,fixedHeight:a.PropTypes.number,autoScroll:a.PropTypes.bool,onHeightReady:a.PropTypes.func,children:a.PropTypes.node,className:a.PropTypes.string}},function(n,t){t.linear=function(n){return n},t.inQuad=function(n){return n*n},t.outQuad=function(n){return n*(2-n)},t.inOutQuad=function(n){return n*=2,n<1?.5*n*n:-.5*(--n*(n-2)-1)},t.inCube=function(n){return n*n*n},t.outCube=function(n){return--n*n*n+1},t.inOutCube=function(n){return n*=2,n<1?.5*n*n*n:.5*((n-=2)*n*n+2)},t.inQuart=function(n){return n*n*n*n},t.outQuart=function(n){return 1- --n*n*n*n},t.inOutQuart=function(n){return n*=2,n<1?.5*n*n*n*n:-.5*((n-=2)*n*n*n-2)},t.inQuint=function(n){return n*n*n*n*n},t.outQuint=function(n){return--n*n*n*n*n+1},t.inOutQuint=function(n){return n*=2,n<1?.5*n*n*n*n*n:.5*((n-=2)*n*n*n*n+2)},t.inSine=function(n){return 1-Math.cos(n*Math.PI/2)},t.outSine=function(n){return Math.sin(n*Math.PI/2)},t.inOutSine=function(n){return.5*(1-Math.cos(Math.PI*n))},t.inExpo=function(n){return 0==n?0:Math.pow(1024,n-1)},t.outExpo=function(n){return 1==n?n:1-Math.pow(2,-10*n)},t.inOutExpo=function(n){return 0==n?0:1==n?1:(n*=2)<1?.5*Math.pow(1024,n-1):.5*(-Math.pow(2,-10*(n-1))+2)},t.inCirc=function(n){return 1-Math.sqrt(1-n*n)},t.outCirc=function(n){return Math.sqrt(1- --n*n)},t.inOutCirc=function(n){return n*=2,n<1?-.5*(Math.sqrt(1-n*n)-1):.5*(Math.sqrt(1-(n-=2)*n)+1)},t.inBack=function(n){var t=1.70158;return n*n*((t+1)*n-t)},t.outBack=function(n){var t=1.70158;return--n*n*((t+1)*n+t)+1},t.inOutBack=function(n){var t=2.5949095;return(n*=2)<1?.5*(n*n*((t+1)*n-t)):.5*((n-=2)*n*((t+1)*n+t)+2)},t.inBounce=function(n){return 1-t.outBounce(1-n)},t.outBounce=function(n){return n<1/2.75?7.5625*n*n:n<2/2.75?7.5625*(n-=1.5/2.75)*n+.75:n<2.5/2.75?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375},t.inOutBounce=function(n){return n<.5?.5*t.inBounce(2*n):.5*t.outBounce(2*n-1)+.5},t["in-quad"]=t.inQuad,t["out-quad"]=t.outQuad,t["in-out-quad"]=t.inOutQuad,t["in-cube"]=t.inCube,t["out-cube"]=t.outCube,t["in-out-cube"]=t.inOutCube,t["in-quart"]=t.inQuart,t["out-quart"]=t.outQuart,t["in-out-quart"]=t.inOutQuart,t["in-quint"]=t.inQuint,t["out-quint"]=t.outQuint,t["in-out-quint"]=t.inOutQuint,t["in-sine"]=t.inSine,t["out-sine"]=t.outSine,t["in-out-sine"]=t.inOutSine,t["in-expo"]=t.inExpo,t["out-expo"]=t.outExpo,t["in-out-expo"]=t.inOutExpo,t["in-circ"]=t.inCirc,t["out-circ"]=t.outCirc,t["in-out-circ"]=t.inOutCirc,t["in-back"]=t.inBack,t["out-back"]=t.outBack,t["in-out-back"]=t.inOutBack,t["in-bounce"]=t.inBounce,t["out-bounce"]=t.outBounce,t["in-out-bounce"]=t.inOutBounce},function(n,t){function e(n){var t=(new Date).getTime(),e=Math.max(0,16-(t-o)),i=setTimeout(n,e);return o=t,i}t=n.exports=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||e;var o=(new Date).getTime(),i=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||window.clearTimeout;t.cancel=function(n){i.call(window,n)}},function(n,t,e){function o(n,t,e,o,u){function c(){f=!0}function a(o){if(f)return u(new Error("Scroll cancelled"),t[n]);var r=+new Date,c=Math.min(1,(r-s)/d),l=m(c);t[n]=l*(e-p)+p,c<1?i(a):u(null,t[n])}var s=+new Date,p=t[n],f=!1,l="inOutSine",d=350;"function"==typeof o?u=o:(o=o||{},l=o.ease||l,d=o.duration||d,u=u||function(){});var m=r[l];return p===e?u(new Error("Element already at target scroll position"),t[n]):(i(a),c)}var i=e(2),r=e(1);n.exports={top:function(n,t,e,i){return o("scrollTop",n,t,e,i)},left:function(n,t,e,i){return o("scrollLeft",n,t,e,i)}}},function(t,e){t.exports=n},function(n,e){n.exports=t},function(n,t){n.exports=e}])});