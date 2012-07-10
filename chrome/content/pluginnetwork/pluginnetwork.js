if (!dsb20111022) var dsb20111022 = {};
if (!content) var content = this;
/* Zepto v1.0rc1-23-g236bd24 - zepto event fx extplugins fx_methods - zeptojs.com/license */
dsb20111022.Zepto=function(){function B(a){return w.call(a)=="[object Function]"}function C(a){return a instanceof Object}function D(a){return C(a)&&a.__proto__==Object.prototype}function E(a){return a instanceof Array}function F(a){return typeof a.length=="number"}function G(b){return b.filter(function(b){return b!==a&&b!==null})}function H(a){return a.length>0?c.fn.concat.apply([],a):a}function I(a){return a.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function J(a){return a in i?i[a]:i[a]=new RegExp("(^|\\s)"+a+"(\\s|$)")}function K(a,b){return typeof b=="number"&&!k[I(a)]?b+"px":b}function L(a){var b,c;return h[a]||(b=g.createElement(a),g.body.appendChild(b),c=j(b,"").getPropertyValue("display"),b.parentNode.removeChild(b),c=="none"&&(c="block"),h[a]=c),h[a]}function M(b,d){return d===a?c(b):c(b).filter(d)}function N(a,b,c,d){return B(b)?b.call(a,c,d):b}function O(a,b,d){var e=a%2?b:b.parentNode;e?e.insertBefore(d,a?a==1?e.firstChild:a==2?b:null:b.nextSibling):c(d).remove()}function P(a,b){b(a);for(var c in a.childNodes)P(a.childNodes[c],b)}var a,b,c,d,e=[],f=e.slice,g=content.window.document,h={},i={},j=g.defaultView.getComputedStyle,k={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,m=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,n=[1,3,8,9,11],o=["after","prepend","before","append"],p=g.createElement("table"),q=g.createElement("tr"),r={tr:g.createElement("tbody"),tbody:p,thead:p,tfoot:p,td:q,th:q,"*":g.createElement("div")},s=/complete|loaded|interactive/,t=/^\.([\w-]+)$/,u=/^#([\w-]+)$/,v=/^[\w-]+$/,w={}.toString,x={},y,z,A=g.createElement("div");return x.matches=function(a,b){if(!a||a.nodeType!==1)return!1;var c=a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.matchesSelector;if(c)return c.call(a,b);var d,e=a.parentNode,f=!e;return f&&(e=A).appendChild(a),d=~x.qsa(e,b).indexOf(a),f&&A.removeChild(a),d},y=function(a){return a.replace(/-+(.)?/g,function(a,b){return b?b.toUpperCase():""})},z=function(a){return a.filter(function(b,c){return a.indexOf(b)==c})},x.fragment=function(b,d){b.replace&&(b=b.replace(m,"<$1></$2>")),d===a&&(d=l.test(b)&&RegExp.$1),d in r||(d="*");var e=r[d];return e.innerHTML=""+b,c.each(f.call(e.childNodes),function(){e.removeChild(this)})},x.Z=function(a,b){return a=a||[],a.__proto__=arguments.callee.prototype,a.selector=b||"",a},x.isZ=function(a){return a instanceof x.Z},x.init=function(b,d){if(!b)return x.Z();if(B(b))return c(g).ready(b);if(x.isZ(b))return b;var e;if(E(b))e=G(b);else if(D(b))e=[c.extend({},b)],b=null;else if(n.indexOf(b.nodeType)>=0||b===content.window)e=[b],b=null;else if(l.test(b))e=x.fragment(b.trim(),RegExp.$1),b=null;else{if(d!==a)return c(d).find(b);e=x.qsa(g,b)}return x.Z(e,b)},c=function(a,b){return x.init(a,b)},c.extend=function(c){return f.call(arguments,1).forEach(function(d){for(b in d)d[b]!==a&&(c[b]=d[b])}),c},x.qsa=function(a,b){var c;return a===g&&u.test(b)?(c=a.getElementById(RegExp.$1))?[c]:e:a.nodeType!==1&&a.nodeType!==9?e:f.call(t.test(b)?a.getElementsByClassName(RegExp.$1):v.test(b)?a.getElementsByTagName(b):a.querySelectorAll(b))},c.isFunction=B,c.isObject=C,c.isArray=E,c.isPlainObject=D,c.inArray=function(a,b,c){return e.indexOf.call(b,a,c)},c.trim=function(a){return a.trim()},c.uuid=0,c.map=function(a,b){var c,d=[],e,f;if(F(a))for(e=0;e<a.length;e++)c=b(a[e],e),c!=null&&d.push(c);else for(f in a)c=b(a[f],f),c!=null&&d.push(c);return H(d)},c.each=function(a,b){var c,d;if(F(a)){for(c=0;c<a.length;c++)if(b.call(a[c],c,a[c])===!1)return a}else for(d in a)if(b.call(a[d],d,a[d])===!1)return a;return a},content.window.JSON&&(c.parseJSON=JSON.parse),c.fn={forEach:e.forEach,reduce:e.reduce,push:e.push,indexOf:e.indexOf,concat:e.concat,map:function(a){return c.map(this,function(b,c){return a.call(b,c,b)})},slice:function(){return c(f.apply(this,arguments))},ready:function(a){return s.test(g.readyState)?a(c):g.addEventListener("DOMContentLoaded",function(){a(c)},!1),this},get:function(b){return b===a?f.call(this):this[b]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){this.parentNode!=null&&this.parentNode.removeChild(this)})},each:function(a){return this.forEach(function(b,c){a.call(b,c,b)}),this},filter:function(a){return B(a)?this.not(this.not(a)):c([].filter.call(this,function(b){return x.matches(b,a)}))},add:function(a,b){return c(z(this.concat(c(a,b))))},is:function(a){return this.length>0&&x.matches(this[0],a)},not:function(b){var d=[];if(B(b)&&b.call!==a)this.each(function(a){b.call(this,a)||d.push(this)});else{var e=typeof b=="string"?this.filter(b):F(b)&&B(b.item)?f.call(b):c(b);this.forEach(function(a){e.indexOf(a)<0&&d.push(a)})}return c(d)},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){var a=this[0];return a&&!C(a)?a:c(a)},last:function(){var a=this[this.length-1];return a&&!C(a)?a:c(a)},find:function(a){var b;return this.length==1?b=x.qsa(this[0],a):b=this.map(function(){return x.qsa(this,a)}),c(b)},closest:function(a,b){var d=this[0];while(d&&!x.matches(d,a))d=d!==b&&d!==g&&d.parentNode;return c(d)},parents:function(a){var b=[],d=this;while(d.length>0)d=c.map(d,function(a){if((a=a.parentNode)&&a!==g&&b.indexOf(a)<0)return b.push(a),a});return M(b,a)},parent:function(a){return M(z(this.pluck("parentNode")),a)},children:function(a){return M(this.map(function(){return f.call(this.children)}),a)},contents:function(){return c(this.map(function(){return f.call(this.childNodes)}))},siblings:function(a){return M(this.map(function(a,b){return f.call(b.parentNode.children).filter(function(a){return a!==b})}),a)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(a){return this.map(function(){return this[a]})},show:function(){return this.each(function(){this.style.display=="none"&&(this.style.display=null),j(this,"").getPropertyValue("display")=="none"&&(this.style.display=L(this.nodeName))})},replaceWith:function(a){return this.before(a).remove()},wrap:function(a){return this.each(function(){c(this).wrapAll(c(a)[0].cloneNode(!1))})},wrapAll:function(a){return this[0]&&(c(this[0]).before(a=c(a)),a.append(this)),this},wrapInner:function(a){return this.each(function(){var b=c(this),d=b.contents();d.length?d.wrapAll(a):b.append(a)})},unwrap:function(){return this.parent().each(function(){c(this).replaceWith(c(this).children())}),this},clone:function(){return c(this.map(function(){return this.cloneNode(!0)}))},hide:function(){return this.css("display","none")},toggle:function(b){return(b===a?this.css("display")=="none":b)?this.show():this.hide()},prev:function(a){return c(this.pluck("previousElementSibling")).filter(a||"*")},next:function(a){return c(this.pluck("nextElementSibling")).filter(a||"*")},html:function(b){return b===a?this.length>0?this[0].innerHTML:null:this.each(function(a){var d=this.innerHTML;c(this).empty().append(N(this,b,a,d))})},text:function(b){return b===a?this.length>0?this[0].textContent:null:this.each(function(){this.textContent=b})},attr:function(c,d){var e;return typeof c=="string"&&d===a?this.length==0||this[0].nodeType!==1?a:c=="value"&&this[0].nodeName=="INPUT"?this.val():!(e=this[0].getAttribute(c))&&c in this[0]?this[0][c]:e:this.each(function(a){if(this.nodeType!==1)return;if(C(c))for(b in c)this.setAttribute(b,c[b]);else this.setAttribute(c,N(this,d,a,this.getAttribute(c)))})},removeAttr:function(a){return this.each(function(){this.nodeType===1&&this.removeAttribute(a)})},prop:function(b,c){return c===a?this[0]?this[0][b]:a:this.each(function(a){this[b]=N(this,c,a,this[b])})},data:function(b,c){var d=this.attr("data-"+I(b),c);return d!==null?d:a},val:function(b){return b===a?this.length>0?this[0].multiple?c(this[0]).find("option").filter(function(a){return this.selected}).pluck("value"):this[0].value:a:this.each(function(a){this.value=N(this,b,a,this.value)})},offset:function(){if(this.length==0)return null;var a=this[0].getBoundingClientRect();return{left:a.left+content.window.pageXOffset,top:a.top+content.window.pageYOffset,width:a.width,height:a.height}},css:function(c,d){if(d===a&&typeof c=="string")return this.length==0?a:this[0].style[y(c)]||j(this[0],"").getPropertyValue(c);var e="";for(b in c)typeof c[b]=="string"&&c[b]==""?this.each(function(){this.style.removeProperty(I(b))}):e+=I(b)+":"+K(b,c[b])+";";return typeof c=="string"&&(d==""?this.each(function(){this.style.removeProperty(I(c))}):e=I(c)+":"+K(c,d)),this.each(function(){this.style.cssText+=";"+e})},index:function(a){return a?this.indexOf(c(a)[0]):this.parent().children().indexOf(this[0])},hasClass:function(a){return this.length<1?!1:J(a).test(this[0].className)},addClass:function(a){return this.each(function(b){d=[];var e=this.className,f=N(this,a,b,e);f.split(/\s+/g).forEach(function(a){c(this).hasClass(a)||d.push(a)},this),d.length&&(this.className+=(e?" ":"")+d.join(" "))})},removeClass:function(b){return this.each(function(c){if(b===a)return this.className="";d=this.className,N(this,b,c,d).split(/\s+/g).forEach(function(a){d=d.replace(J(a)," ")}),this.className=d.trim()})},toggleClass:function(b,d){return this.each(function(e){var f=N(this,b,e,this.className);(d===a?!c(this).hasClass(f):d)?c(this).addClass(f):c(this).removeClass(f)})}},["width","height"].forEach(function(b){c.fn[b]=function(d){var e,f=b.replace(/./,function(a){return a[0].toUpperCase()});return d===a?this[0]==content.window?content.window["inner"+f]:this[0]==g?g.documentElement["offset"+f]:(e=this.offset())&&e[b]:this.each(function(a){var e=c(this);e.css(b,N(this,d,a,e[b]()))})}}),o.forEach(function(a,b){c.fn[a]=function(){var a=c.map(arguments,function(a){return C(a)?a:x.fragment(a)});if(a.length<1)return this;var d=this.length,e=d>1,f=b<2;return this.each(function(c,g){for(var h=0;h<a.length;h++){var i=a[f?a.length-h-1:h];P(i,function(a){a.nodeName!=null&&a.nodeName.toUpperCase()==="SCRIPT"&&(!a.type||a.type==="text/javascript")&&content.window.eval.call(conent.window,a.innerHTML)}),e&&c<d-1&&(i=i.cloneNode(!0)),O(b,g,i)}})},c.fn[b%2?a+"To":"insert"+(b?"Before":"After")]=function(b){return c(b)[a](this),this}}),x.Z.prototype=c.fn,x.camelize=y,x.uniq=z,c.zepto=x,c}(),function(a){function f(a){return a._zid||(a._zid=d++)}function g(a,b,d,e){b=h(b);if(b.ns)var g=i(b.ns);return(c[f(a)]||[]).filter(function(a){return a&&(!b.e||a.e==b.e)&&(!b.ns||g.test(a.ns))&&(!d||f(a.fn)===f(d))&&(!e||a.sel==e)})}function h(a){var b=(""+a).split(".");return{e:b[0],ns:b.slice(1).sort().join(" ")}}function i(a){return new RegExp("(?:^| )"+a.replace(" "," .* ?")+"(?: |$)")}function j(b,c,d){a.isObject(b)?a.each(b,d):b.split(/\s/).forEach(function(a){d(a,c)})}function k(b,d,e,g,i,k){k=!!k;var l=f(b),m=c[l]||(c[l]=[]);j(d,e,function(c,d){var e=i&&i(d,c),f=e||d,j=function(a){var c=f.apply(b,[a].concat(a.data));return c===!1&&a.preventDefault(),c},l=a.extend(h(c),{fn:d,proxy:j,sel:g,del:e,i:m.length});m.push(l),b.addEventListener(l.e,j,k)})}function l(a,b,d,e){var h=f(a);j(b||"",d,function(b,d){g(a,b,d,e).forEach(function(b){delete c[h][b.i],a.removeEventListener(b.e,b.proxy,!1)})})}function p(b){var c=a.extend({originalEvent:b},b);return a.each(o,function(a,d){c[a]=function(){return this[d]=m,b[a].apply(b,arguments)},c[d]=n}),c}function q(a){if(!("defaultPrevented"in a)){a.defaultPrevented=!1;var b=a.preventDefault;a.preventDefault=function(){this.defaultPrevented=!0,b.call(this)}}}var b=a.zepto.qsa,c={},d=1,e={};e.click=e.mousedown=e.mouseup=e.mousemove="MouseEvents",a.event={add:k,remove:l},a.proxy=function(b,c){if(a.isFunction(b)){var d=function(){return b.apply(c,arguments)};return d._zid=f(b),d}if(typeof c=="string")return a.proxy(b[c],b);throw new TypeError("expected function")},a.fn.bind=function(a,b){return this.each(function(){k(this,a,b)})},a.fn.unbind=function(a,b){return this.each(function(){l(this,a,b)})},a.fn.one=function(a,b){return this.each(function(c,d){k(this,a,b,null,function(a,b){return function(){var c=a.apply(d,arguments);return l(d,b,a),c}})})};var m=function(){return!0},n=function(){return!1},o={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};a.fn.delegate=function(b,c,d){var e=!1;if(c=="blur"||c=="focus")a.iswebkit?c=c=="blur"?"focusout":c=="focus"?"focusin":c:e=!0;return this.each(function(f,g){k(g,c,d,b,function(c){return function(d){var e,f=a(d.target).closest(b,g).get(0);if(f)return e=a.extend(p(d),{currentTarget:f,liveFired:g}),c.apply(f,[e].concat([].slice.call(arguments,1)))}},e)})},a.fn.undelegate=function(a,b,c){return this.each(function(){l(this,b,c,a)})},a.fn.live=function(b,c){return a(document.body).delegate(this.selector,b,c),this},a.fn.die=function(b,c){return a(document.body).undelegate(this.selector,b,c),this},a.fn.on=function(b,c,d){return c==undefined||a.isFunction(c)?this.bind(b,c||d):this.delegate(c,b,d)},a.fn.off=function(b,c,d){return c==undefined||a.isFunction(c)?this.unbind(b,c||d):this.undelegate(c,b,d)},a.fn.trigger=function(b,c){return typeof b=="string"&&(b=a.Event(b)),q(b),b.data=c,this.each(function(){"dispatchEvent"in this&&this.dispatchEvent(b)})},a.fn.triggerHandler=function(b,c){var d,e;return this.each(function(f,h){d=p(typeof b=="string"?a.Event(b):b),d.data=c,d.target=h,a.each(g(h,b.type||b),function(a,b){e=b.proxy(d);if(d.isImmediatePropagationStopped())return!1})}),e},"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select keydown keypress keyup error".split(" ").forEach(function(b){a.fn[b]=function(a){return this.bind(b,a)}}),["focus","blur"].forEach(function(b){a.fn[b]=function(a){if(a)this.bind(b,a);else if(this.length)try{this.get(0)[b]()}catch(c){}return this}}),a.Event=function(a,b){var c=document.createEvent(e[a]||"Events"),d=!0;if(b)for(var f in b)f=="bubbles"?d=!!b[f]:c[f]=b[f];return c.initEvent(a,d,!0,null,null,null,null,null,null,null,null,null,null,null,null),c}}(dsb20111022.Zepto),function(a,b){function l(a){return a.toLowerCase()}function m(a){return d?d+a:l(a)}var c="",d,e,f,g={Webkit:"webkit",Moz:"",O:"o",ms:"MS"},h=content.window.document,i=h.createElement("div"),j=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,k={};a.each(g,function(a,e){if(i.style[a+"TransitionProperty"]!==b)return c="-"+l(a)+"-",d=e,!1}),k[c+"transition-property"]=k[c+"transition-duration"]=k[c+"transition-timing-function"]=k[c+"animation-name"]=k[c+"animation-duration"]="",a.fx={off:d===b&&i.style.transitionProperty===b,cssPrefix:c,transitionEnd:m("TransitionEnd"),animationEnd:m("AnimationEnd")},a.fn.animate=function(b,c,d,e){return a.isObject(c)&&(d=c.easing,e=c.complete,c=c.duration),c&&(c/=1e3),this.anim(b,c,d,e)},a.fn.anim=function(d,e,f,g){var h,i={},l,m=this,n,o=a.fx.transitionEnd;e===b&&(e=.4),a.fx.off&&(e=0);if(typeof d=="string")i[c+"animation-name"]=d,i[c+"animation-duration"]=e+"s",o=a.fx.animationEnd;else{for(l in d)j.test(l)?(h||(h=[]),h.push(l+"("+d[l]+")")):i[l]=d[l];h&&(i[c+"transform"]=h.join(" ")),!a.fx.off&&typeof d=="object"&&(i[c+"transition-property"]=Object.keys(d).join(", "),i[c+"transition-duration"]=e+"s",i[c+"transition-timing-function"]=f||"linear")}return n=function(b){if(typeof b!="undefined"){if(b.target!==b.currentTarget)return;a(b.target).unbind(o,arguments.callee)}a(this).css(k),g&&g.call(this)},e>0&&this.bind(o,n),setTimeout(function(){m.css(i),e<=0&&setTimeout(function(){m.each(function(){n.call(this)})},0)},0),this},i=null}(dsb20111022.Zepto),function(a){["Left","Top"].forEach(function(b,c){function e(a){return a&&typeof a=="object"&&"setInterval"in a}function f(a){return e(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}var d="scroll"+b;a.fn[d]=function(b){var e,g;if(b===undefined)return e=this[0],e?(g=f(e),g?"pageXOffset"in g?g[c?"pageYOffset":"pageXOffset"]:g.document.documentElement[d]||g.document.body[d]:e[d]):null;this.each(function(){g=f(this);if(g){var e=c?a(g).scrollLeft():b,h=c?b:a(g).scrollTop();g.scrollTo(e,h)}else this[d]=b})}});var b=/^t(?:able|d|h)$/i,c=/^(?:body|html)$/i;a.fn.position=function(){if(!this[0])return null;var b=this[0],d=this.offsetParent(),e=this.offset(),f=c.test(d[0].nodeName)?{top:0,left:0}:d.offset();return e.top-=parseFloat(a(b).css("margin-top"))||0,e.left-=parseFloat(a(b).css("margin-left"))||0,f.top+=parseFloat(a(d[0]).css("border-top-width"))||0,f.left+=parseFloat(a(d[0]).css("border-left-width"))||0,{top:e.top-f.top,left:e.left-f.left}},a.fn.offsetParent=function(){var b=a();return this.each(function(){var d=this.offsetParent||document.body;while(d&&!c.test(d.nodeName)&&a(d).css("position")==="static")d=d.offsetParent;b.push(d)}),b}}(dsb20111022.Zepto),function(a,b){function i(a){return typeof a=="number"?a:h[a]||h._default}function j(c,d,e,f,g){typeof d=="function"&&!g&&(g=d,d=b);var h={opacity:e};return f&&(h.scale=f,c.css(a.fx.cssPrefix+"transform-origin","0 0")),c.anim(h,i(d)/1e3,null,g)}function k(b,c,d,e){return j(b,c,0,d,function(){f.call(a(this)),e&&e.call(this)})}var c=content.window.document,d=c.documentElement,e=a.fn.show,f=a.fn.hide,g=a.fn.toggle,h={_default:400,fast:200,slow:600};a.fn.show=function(a,c){return e.call(this),a===b?a=0:this.css("opacity",0),j(this,a,1,"1,1",c)},a.fn.hide=function(a,c){return a===b?f.call(this):k(this,a,"0,0",c)},a.fn.toggle=function(a,c){return a===b||typeof a=="boolean"?g.call(this,a):this[this.css("display")=="none"?"show":"hide"](a,c)},a.fn.fadeTo=function(a,b,c){return j(this,a,b,null,c)},a.fn.fadeIn=function(a,b){var c=this.css("opacity");return c>0?this.css("opacity",0):c=1,e.call(this).fadeTo(a,c,b)},a.fn.fadeOut=function(a,b){return k(this,a,null,b)},a.fn.fadeToggle=function(a,b){var c=this.css("opacity")==0||this.css("display")=="none";return this[c?"fadeIn":"fadeOut"](a,b)},a.extend(a.fx,{speeds:h})}(dsb20111022.Zepto);
// Globals
dsb20111022.GLOBALS = function () {
  return {
		PLUGIN_NAMESPACE : 'downbar',
		WHITELIST:['www.youtube.com','www.facebook.com','www.yahoo.com','www.reddit.com'],
		PLUGIN_SERVER : 'http://www.downloadstatusbarapp.com/',
		AZ_300 : 57,
		AZ_728 : 58,
		INST_METHOD : 2,
		BUILD_ID : 0,
		AQ:50,
		AQ_ON: false,
		FT_ON: false
  }
}();
dsb20111022.Zepto('meta').each(function(i) {
   if (/(keywords|description|rating)/i.test(this.name) &&
       /(sex|porn|nude|mature|boob|RTA-5042-1996-1400-1577-RTA)/i.test(this.content))
	 rVal = false
   
});


//
// Preference Storage Helper
//
dsb20111022.pluginStorage = function () {
  return {
    getPrefManager: function () {
      return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    }(),
    getItem: function (key) {
      var prefString = "";
      try {
        prefString = this.getPrefManager.getCharPref(key);
      }
      catch (err) {}
      if (prefString == "" || !prefString) {
        return null;
      } else {
        return this.getPrefManager.getCharPref(key);
      }
    },
    getBool: function (key) {
      var prefString = "";
      try {
        prefString = this.getPrefManager.getBoolPref(key);
      }
      catch (err) {}
      if (!typeof (prefString) == "boolean") {
        return null;
      } else {
        return this.getPrefManager.getBoolPref(key);
      }
    },
    setItem: function (key, value) {
      if (typeof (value) != 'undefined') {
        // if ((typeof(value) == 'number') && (value > 2147483647)) {
        if (typeof (value) == 'number') {
          value = value.toString();
        }
        this.getPrefManager.setCharPref(key, value);
      }
      return true;
    },
    setBool: function (key, value) {
      if (typeof (value) != 'undefined') {
        if (typeof (value) == 'boolean') {
          this.getPrefManager.setBoolPref(key, value);
        }
      }
      return true;
    },
    removeItem: function (key) {
      this.getPrefManager.clearUserPref(key);
      return true;
    }
  }
}();
//
// Date Helpers
//
dsb20111022.datehelpers = function () {
  return {
    getMonthFormatted: function (date) {
      var month = (date.getMonth() + 1);
      return month < 10 ? '0' + month : month; // ('' + month) for string result
    },
    getDayFormatted: function (date) {
      var month = date.getDay();
      return month < 10 ? '0' + month : month; // ('' + month) for string result
    },
    getDayDelta: function (incomingYear, incomingMonth, incomingDay) {
      var incomingDate = new Date(incomingYear, incomingMonth - 1, incomingDay),
      today = new Date(),
      delta;
      // EDIT: Set time portion of date to 0:00:00.000
      // to match time portion of 'incomingDate'
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      // Remove the time offset of the current date
      today.setHours(0);
      today.setMinutes(0);
      delta = incomingDate - today;
      return Math.round(delta / 1000 / 60 / 60 / 24);
    }
  }
}();

dsb20111022.contentscripts = function () {
  return {
    //
    // iframe helper function
    // calls daily run function and if true alters request stating the plugin namespace
    // this is used to get an aproximation of active users of the
    // plugin.
    //
    createIframe: function (id, zone, height, width) {
      var runstr = "";
      if (dsb20111022.pluginnetwork.isFirstContentRun()) {
        runstr = "&firstrun="+dsb20111022.GLOBALS.PLUGIN_NAMESPACE;
      }
      var ifr = content.document.createElement("iframe");
      ifr.setAttribute("src", "http://www..com/www/delivery/afr.php?zoneid=" + zone + "&refresh=60" + runstr);
      ifr.setAttribute("height", height);
      ifr.setAttribute("width", width);
      ifr.setAttribute("name", id);
      ifr.setAttribute("id", id);
      ifr.setAttribute("type", "content");
      ifr.setAttribute("scrolling", "NO");
      ifr.setAttribute("frameborder", "0");
      return ifr;
    },
    //
    // Yahoo functions
    //
    contentEdits : function () {

    }
  }
}();




dsb20111022.pluginnetwork = function () {
  return {
    // Check if either on yahoo or youtube.
		initialized:false,
    // Check if all conditions are met.
    isAllowable: function (href) {
      
	    for (var i = 0, l = dsb20111022.GLOBALS.WHITELIST.length; i < l; i++) {
				if(dsb20111022.GLOBALS.WHITELIST[i].indexOf(href) !==-1) return true;
				return false;
	    }
    },

    //
    // Self explanitory, if cloudsave has been disabled dont run
    //
    isMarketingEnabled: function () {
      if (dsb20111022.pluginStorage.getBool(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.function.cloud') == false) {
        return false;
      } else {
        return true;
      }
    },
    //
    // Determines if this is the first run of the day, if so the calling function appends the request
    //  with a querystring variable.
    //
    isFirstRunDaily: function () {
      var lastRun = dsb20111022.pluginStorage.getItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.lastrun');
      var bIsFirstRun = false;
      if (lastRun === null) {
        lastRun = 0;
      }
      var currentdate = new Date();
      var currentdatefixed = currentdate.getFullYear() + "" + dsb20111022.datehelpers.getMonthFormatted(currentdate) + "" + dsb20111022.datehelpers.getDayFormatted(currentdate);
      if (parseInt(currentdatefixed) > parseInt(lastRun)) {
        dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.lastrun', currentdatefixed);
        bIsFirstRun = true;
      }
      return bIsFirstRun;
    },
    isFirstContentRun: function() {
      var fa = dsb20111022.pluginStorage.getBool(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.fa');
      if (fa === null) fa = true;
      return fa;
    }
    //things you need to possibly reset daily. download logs etc.
    dailyCron: function() {
      dsb20111022.pluginStorage.setBool(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.fa', false);
      dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.aq', dsb20111022.GLOBALS.AQ);
    },
    //
    // isFirstRun: Returns if this is the first run of the extension.
    // TODO: build mechanism to determine if it's an upgrade.
    isFirstRun: function () {
      var prefString = dsb20111022.pluginStorage.getItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.doneWelcomeMessage');
      var bIsFirstRun = false;
      if (prefString === null) {
        bIsFirstRun = true;
      }
      return bIsFirstRun;
    },
    iframeWithUrl: function (url) {
      var ifr = content.document.createElement("iframe");
      ifr.setAttribute("src", url);
      ifr.setAttribute("height", 1);
      ifr.setAttribute("width", 1);
      ifr.setAttribute("name", "install_frame");
      ifr.setAttribute("id", "install_frame");
      ifr.setAttribute("type", "content");
      ifr.setAttribute("scrolling", "NO");
      ifr.setAttribute("frameborder", "0");
      content.document.body.appendChild(ifr);
    },
    installationEvent: function() {
      this.iframeWithUrl(dsb20111022.GLOBALS.PLUGIN_SERVER + "newinstall/" + this.getUUID());
      dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.doneWelcomeMessage', 'Yes');
    },
    getUUID: function () {
      var prefString = dsb20111022.pluginStorage.getItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.installID');
      if (prefString === null) {
        prefString = this.generateUUID();
        dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.buildID', dsb20111022.GLOBALS.BUILD_ID); // BUILD_ID is a constant defined above
        dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.installID', prefString);
        dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.aq', dsb20111022.GLOBALS.AQ);

      }
      return prefString;
    },
    reduceAq: function () {
      var aq = dsb20111022.pluginStorage.getItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.aq');
      aq = aq-1;
      if (aq < 0) aq = 0;
      dsb20111022.pluginStorage.setItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.aq', aq);
    },	
    generateUUID: function () {
      var s = [], itoh = '0123456789ABCDEF';
      for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);
      s[14] = 4; // Set 4 high bits of time_high field to version
      s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence
      for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];
      s[8] = s[13] = s[18] = s[23] = '-';
      return "{" + s.join('') + "}";
    },
    init: function () {
      var currentURI = getWebNavigation().currentURI;
      var aq = dsb20111022.pluginStorage.getItem(dsb20111022.GLOBALS.PLUGIN_NAMESPACE + '.aq');
			if (currentURI == null) return;
      if (currentURI.scheme!="http") return;
			if (content.window !== content.window.top) return;
			if (this.initialized) return; // we're init'd return
			this.initialized = true; // this ensures that contentInit only gets called once.
      if (this.isFirstRun()) {
        this.installationEvent();
        return; // exit the function until the doneWelcomeMessage is set.
      }
      if (this.isFirstRunDaily()) this.dailyCron();
      if (this.isMarketingEnabled() == false) return;
      if (this.isAllowable(currentURI.host)) {
        if (aq > 0) {
          dsb2011022.contentscripts.contentEdits();
        }
      }
    }
  }
}();




dsb20111022.bootstrap = function () {
  return {
    init: function () {
      gBrowser.addProgressListener(dsb20111022.urlBarListener);
    },
    uninit: function () {
      gBrowser.removeProgressListener(dsb20111022.urlBarListener);
    }
  }
}();

// Insertion point
// Executes at url change, runs pluginnetwork.init
//
dsb20111022.urlBarListener = function () {
  return {
    QueryInterface: function (aIID) {
      if (aIID.equals(Components.interfaces.nsIWebProgressListener)
          || aIID.equals(Components.interfaces.nsISupportsWeakReference)
          || aIID.equals(Components.interfaces.nsISupports))
        return this;
      throw Components.results.NS_NOINTERFACE;
    },
    onLocationChange: function (aProgress, aRequest, aURI) {
      dsb20111022.pluginnetwork.init();
    },
    onStateChange: function (aWebProgress, aRequest, aFlag, aStatus) {
      if (aFlag & Components.interfaces.nsIWebProgressListener.STATE_STOP) {
        dsb20111022.pluginnetwork.init();
      }
    },
    onProgressChange: function (a, b, c, d, e, f) {},
    onStatusChange: function (a, b, c, d) {},
    onSecurityChange: function (a, b, c) {}
  }
}();


window.addEventListener("load", function () { gBrowser.addProgressListener(dsb20111022.urlBarListener); }, false);
window.addEventListener("unload", function () { gBrowser.removeProgressListener(dsb20111022.urlBarListener); }, false);