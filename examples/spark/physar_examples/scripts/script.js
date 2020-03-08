!function(t){var r={};function e(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,r){if(1&r&&(t=e(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var i in t)e.d(n,i,function(r){return t[r]}.bind(null,i));return n},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},e.p="",e(e.s=2)}({0:function(t,r,e){"use strict";(function(t){e.d(r,"a",(function(){return i}));var n=e(1);class i{constructor(t){this.Diagnostics=void 0,this.Time=void 0,this.currentInterval=void 0,this.lastInterval=void 0,this.lastTime=void 0,this.fixedTimeStep=1/60,this.maxSubSteps=3,this.timeInterval=5,this.C=void 0,this.worldObjects=[],this.worldConstraints=[],this.defaults={body:{mass:0,radius:1,transform:{rotation:{x:0,y:0,z:0,w:.5},position:{x:0,y:0,z:0},scale:{x:1,y:1,z:1}}},sync:{properties:["position","rotation"],axes:["x","y","z"],rotation:{enabled:!0,allAxis:!0,x:!0,y:!0,z:!0},position:{enabled:!0,allAxis:!0,x:!0,y:!0,z:!0}}},this.initRequiredSparkModules(),this.createCWorld(t)}initRequiredSparkModules(){this.Time=e(366),this.C=e(367),this.Diagnostics=e(368)}createCWorld(t){this.world=new this.C.World,this.world.broadphase=new this.C.NaiveBroadphase,this.world.gravity.set(t.x,t.y,t.z)}beginSync(){this.initialWorldState=this.worldObjects,this.currentInterval=this.Time.setInterval(t=>{if(void 0!==this.lastTime){let r=(t-this.lastTime)/1e3;this.world.step(this.fixedTimeStep,r,this.maxSubSteps),this.objectSync()}this.lastTime=t},this.timeInterval)}objectSync(){this.worldObjects.forEach(t=>{if(t.spark){const r=t.sync,e=r.properties,n=r.axes,i={};t.body.quaternion.toEuler(i),e.forEach(r=>{t.sync[r].enabled&&n.forEach(e=>{if(t.sync[r].allAxis||t.sync[r][e]){const n=`rotation${e.toUpperCase()}`;"position"==r&&(t.spark.transform[e]=t.body[r][e]),"rotation"==r&&(t.spark.transform[n]=i[e])}})})}})}stopSync(){this.currentInterval&&(this.Time.clearInterval(this.currentInterval),this.lastInterval=currentInterval,this.currentInterval=void 0),this.resetWorldState()}getDefaults(t){return t?this.defaults[t]:this.defaults}fillWithDefaults(t){const r=this.getDefaults();return Object.keys(r).forEach(e=>{t.hasOwnProperty(e)||(t[e]=r[e]),Object.keys(r[e]).forEach(n=>{Array.isArray(t[e][n])?r[e][n].forEach(i=>{t[e][n].indexOf(i)<0&&t[e][n].push(r[e][n][i])}):(t[e].hasOwnProperty(n)||(t[e][n]=r[e][n]),"object"!=typeof r[e][n]||Array.isArray(r[e][n])||Object.keys(r[e][n]).forEach(i=>{t[e][n].hasOwnProperty(i)||(t[e][n][i]=r[e][n][i])}))})}),t}resetWorldState(){this.initialWorldState&&this.worldObjects.forEach((t,r)=>{const e=this.initialWorldState[r],n=e.body,i=t.body;if(i.velocity.setZero(),i.initVelocity.setZero(),i.angularVelocity.setZero(),i.initAngularVelocity.setZero(),i.force.setZero(),i.torque.setZero(),i.quaternion=n.quaternion,i.position=n.position,t.spark){const r=t.sync,n=r.properties,i=r.axes,o={};t.body.quaternion.toEuler(o),n.forEach(r=>{t.sync[r].enabled&&i.forEach(n=>{if(t.sync[r].allAxis||t.sync[r][n]){const i=`rotation${n.toUpperCase()}`;"position"==r&&(t.spark.transform[n]=e.spark.transform[n]),"rotation"==r&&(t.spark.transform[i]=e.spark.transform[i])}})})}})}createObject(t,r,e){const{sync:n,body:i}=this.fillWithDefaults(e),{mass:o,radius:s,transform:a}=i,u=a.rotation,f=a.scale,h=a.position,c=new this.C.Vec3(h.x,h.y,h.z),l=new this.C.Quaternion(u.x,u.y,u.z,u.w),p=t=>{switch(t){case"box":return new this.C.Box(new this.C.Vec3(f.x,f.y,f.z));case"sphere":return new this.C.Sphere(s);case"ground":return new this.C.Plane}},d=t=>{const e={mass:o,shape:t,position:c,quaternion:l,angularDamping:.8};return"sphere"==r&&(e.radius=s),"ground"==r&&(e.mass=0),e},y=(t=>{const r=new this.C.Body(d(p(t)));if("ground"==t){const t=-Math.PI/2,e=new this.C.Vec3(1,0,0);r.quaternion.setFromAxisAngle(e,t)}return r})(r);return this.addObjectToPhysicsWorld(y,t,n,"ground"==r)}find(t,r){if("object"==t)for(var e=0;e<this.worldObjects.length;e++)if(this.worldObjects[e].id==r)return this.worldObjects[e];if("constraint"==t)for(e=0;e<this.worldConstraints.length;e++)if(this.worldConstraints[e].id==r)return this.worldConstraints[e]}createConstraint(t,r={}){if(!r.bodyA||!r.bodyB)return;let{bodyA:e,bodyB:n,pivotA:i,pivotB:o,axisA:s,axisB:a}=r;const u={pivotA:i,pivotB:o,axisA:s,axisB:a},f=this.find("object",e),h=this.find("object",n);if(!f||!h)return void this.log("Bodies where not found.");let c;switch(t){case"point":c=new this.C.PointToPointConstraint(f.body,i,h.body,o);break;case"hinge":c=new this.C.HingeConstraint(f.body,h.body,u);break;case"conetwist":c=new this.C.ConeTwistConstraint(f.body,h.body,u);break;case"lock":c=new this.C.LockConstraint(i,o,{});break;default:return}return this.addConstraintToWorld(c,f.id,h.id)}addConstraintToWorld(r,e,n){if(!e||!n)return;this.world.addConstraint(r),this.log("Added constraint to world.");const i=new t.from(`${e}.${n}`).toString("base64"),o={id:i,constraint:r,isActive:!0};return this.worldConstraints.push(o),i}removeConstraint(t,r=!1){const e=this.find("constraint",t);if(e&&this.world.removeConstraint(e.constraint),r){const t=this.worldConstraints.indexOf(e);this.worldConstraints.splice(t,1)}}pauseConstraint(t){const r=this.find("constraint",t);r&&this.removeConstraint(t,!1);const e=this.worldConstraints.indexOf(r);this.worldConstraints[e].isActive=!1}resumeConstraint(t){const r=this.find("constraint",t),e=r.constraint;if(r&&0==r.isActive){this.world.addConstraint(e);const t=this.worldConstraints.indexOf(r);this.worldConstraints[t].isActive=!0}}log(t){this.Diagnostics.log(t)}addObjectToPhysicsWorld(t,r,e,i){this.world.addBody(t);const o={...this.getDefaults("sync"),...e},s=Object(n.a)(),a={id:s,body:t,spark:r,sync:o,isGround:i};return this.worldObjects.push(a),s}createCMaterial(t){let r=void 0;return null==t&&(r=new this.C.Material),r}start(){this.beginSync()}}}).call(this,e(3).Buffer)},1:function(t,r,e){"use strict";e.d(r,"a",(function(){return n}));const n=(t,r)=>{for(r=t="";t++<36;r+=51*t&52?(15^t?8^Math.random()*(20^t?16:4):4).toString(16):"-");return r}},150:function(t,r){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(t){"object"==typeof window&&(e=window)}t.exports=e},2:function(t,r,e){"use strict";e.r(r);var n=e(0),i=e(369),o=i.root.find("SphereObject"),s=i.root.find("Cube01"),a=i.root.find("plane0"),u=new n.a({x:0,y:-9.82,z:0});u.createObject(a,"ground",{body:{mass:0,transform:{position:{x:0,y:0,z:0}}}});var f={bodyA:u.createObject(o,"sphere",{body:{mass:1,radius:.01,transform:{position:{x:0,y:2,z:0}}}}),bodyB:u.createObject(s,"box",{body:{mass:5,transform:{scale:{x:.01,y:.01,z:.01},position:{x:0,y:10,z:0},rotation:{x:.2,y:.8,z:.3,w:0}}}})};u.createConstraint("point",f);u.start()},3:function(t,r,e){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
var n=e(4),i=e(5),o=e(6);function s(){return u.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function a(t,r){if(s()<r)throw new RangeError("Invalid typed array length");return u.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(r)).__proto__=u.prototype:(null===t&&(t=new u(r)),t.length=r),t}function u(t,r,e){if(!(u.TYPED_ARRAY_SUPPORT||this instanceof u))return new u(t,r,e);if("number"==typeof t){if("string"==typeof r)throw new Error("If encoding is specified then the first argument must be a string");return c(this,t)}return f(this,t,r,e)}function f(t,r,e,n){if("number"==typeof r)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&r instanceof ArrayBuffer?function(t,r,e,n){if(r.byteLength,e<0||r.byteLength<e)throw new RangeError("'offset' is out of bounds");if(r.byteLength<e+(n||0))throw new RangeError("'length' is out of bounds");r=void 0===e&&void 0===n?new Uint8Array(r):void 0===n?new Uint8Array(r,e):new Uint8Array(r,e,n);u.TYPED_ARRAY_SUPPORT?(t=r).__proto__=u.prototype:t=l(t,r);return t}(t,r,e,n):"string"==typeof r?function(t,r,e){"string"==typeof e&&""!==e||(e="utf8");if(!u.isEncoding(e))throw new TypeError('"encoding" must be a valid string encoding');var n=0|d(r,e),i=(t=a(t,n)).write(r,e);i!==n&&(t=t.slice(0,i));return t}(t,r,e):function(t,r){if(u.isBuffer(r)){var e=0|p(r.length);return 0===(t=a(t,e)).length||r.copy(t,0,0,e),t}if(r){if("undefined"!=typeof ArrayBuffer&&r.buffer instanceof ArrayBuffer||"length"in r)return"number"!=typeof r.length||(n=r.length)!=n?a(t,0):l(t,r);if("Buffer"===r.type&&o(r.data))return l(t,r.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,r)}function h(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function c(t,r){if(h(r),t=a(t,r<0?0:0|p(r)),!u.TYPED_ARRAY_SUPPORT)for(var e=0;e<r;++e)t[e]=0;return t}function l(t,r){var e=r.length<0?0:0|p(r.length);t=a(t,e);for(var n=0;n<e;n+=1)t[n]=255&r[n];return t}function p(t){if(t>=s())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+s().toString(16)+" bytes");return 0|t}function d(t,r){if(u.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var e=t.length;if(0===e)return 0;for(var n=!1;;)switch(r){case"ascii":case"latin1":case"binary":return e;case"utf8":case"utf-8":case void 0:return z(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*e;case"hex":return e>>>1;case"base64":return N(t).length;default:if(n)return z(t).length;r=(""+r).toLowerCase(),n=!0}}function y(t,r,e){var n=!1;if((void 0===r||r<0)&&(r=0),r>this.length)return"";if((void 0===e||e>this.length)&&(e=this.length),e<=0)return"";if((e>>>=0)<=(r>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return B(this,r,e);case"utf8":case"utf-8":return C(this,r,e);case"ascii":return P(this,r,e);case"latin1":case"binary":return S(this,r,e);case"base64":return T(this,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return x(this,r,e);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function g(t,r,e){var n=t[r];t[r]=t[e],t[e]=n}function w(t,r,e,n,i){if(0===t.length)return-1;if("string"==typeof e?(n=e,e=0):e>2147483647?e=2147483647:e<-2147483648&&(e=-2147483648),e=+e,isNaN(e)&&(e=i?0:t.length-1),e<0&&(e=t.length+e),e>=t.length){if(i)return-1;e=t.length-1}else if(e<0){if(!i)return-1;e=0}if("string"==typeof r&&(r=u.from(r,n)),u.isBuffer(r))return 0===r.length?-1:b(t,r,e,n,i);if("number"==typeof r)return r&=255,u.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,r,e):Uint8Array.prototype.lastIndexOf.call(t,r,e):b(t,[r],e,n,i);throw new TypeError("val must be string, number or Buffer")}function b(t,r,e,n,i){var o,s=1,a=t.length,u=r.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||r.length<2)return-1;s=2,a/=2,u/=2,e/=2}function f(t,r){return 1===s?t[r]:t.readUInt16BE(r*s)}if(i){var h=-1;for(o=e;o<a;o++)if(f(t,o)===f(r,-1===h?0:o-h)){if(-1===h&&(h=o),o-h+1===u)return h*s}else-1!==h&&(o-=o-h),h=-1}else for(e+u>a&&(e=a-u),o=e;o>=0;o--){for(var c=!0,l=0;l<u;l++)if(f(t,o+l)!==f(r,l)){c=!1;break}if(c)return o}return-1}function v(t,r,e,n){e=Number(e)||0;var i=t.length-e;n?(n=Number(n))>i&&(n=i):n=i;var o=r.length;if(o%2!=0)throw new TypeError("Invalid hex string");n>o/2&&(n=o/2);for(var s=0;s<n;++s){var a=parseInt(r.substr(2*s,2),16);if(isNaN(a))return s;t[e+s]=a}return s}function A(t,r,e,n){return q(z(r,t.length-e),t,e,n)}function m(t,r,e,n){return q(function(t){for(var r=[],e=0;e<t.length;++e)r.push(255&t.charCodeAt(e));return r}(r),t,e,n)}function E(t,r,e,n){return m(t,r,e,n)}function _(t,r,e,n){return q(N(r),t,e,n)}function R(t,r,e,n){return q(function(t,r){for(var e,n,i,o=[],s=0;s<t.length&&!((r-=2)<0);++s)e=t.charCodeAt(s),n=e>>8,i=e%256,o.push(i),o.push(n);return o}(r,t.length-e),t,e,n)}function T(t,r,e){return 0===r&&e===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(r,e))}function C(t,r,e){e=Math.min(t.length,e);for(var n=[],i=r;i<e;){var o,s,a,u,f=t[i],h=null,c=f>239?4:f>223?3:f>191?2:1;if(i+c<=e)switch(c){case 1:f<128&&(h=f);break;case 2:128==(192&(o=t[i+1]))&&(u=(31&f)<<6|63&o)>127&&(h=u);break;case 3:o=t[i+1],s=t[i+2],128==(192&o)&&128==(192&s)&&(u=(15&f)<<12|(63&o)<<6|63&s)>2047&&(u<55296||u>57343)&&(h=u);break;case 4:o=t[i+1],s=t[i+2],a=t[i+3],128==(192&o)&&128==(192&s)&&128==(192&a)&&(u=(15&f)<<18|(63&o)<<12|(63&s)<<6|63&a)>65535&&u<1114112&&(h=u)}null===h?(h=65533,c=1):h>65535&&(h-=65536,n.push(h>>>10&1023|55296),h=56320|1023&h),n.push(h),i+=c}return function(t){var r=t.length;if(r<=4096)return String.fromCharCode.apply(String,t);var e="",n=0;for(;n<r;)e+=String.fromCharCode.apply(String,t.slice(n,n+=4096));return e}(n)}r.Buffer=u,r.SlowBuffer=function(t){+t!=t&&(t=0);return u.alloc(+t)},r.INSPECT_MAX_BYTES=50,u.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),r.kMaxLength=s(),u.poolSize=8192,u._augment=function(t){return t.__proto__=u.prototype,t},u.from=function(t,r,e){return f(null,t,r,e)},u.TYPED_ARRAY_SUPPORT&&(u.prototype.__proto__=Uint8Array.prototype,u.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&u[Symbol.species]===u&&Object.defineProperty(u,Symbol.species,{value:null,configurable:!0})),u.alloc=function(t,r,e){return function(t,r,e,n){return h(r),r<=0?a(t,r):void 0!==e?"string"==typeof n?a(t,r).fill(e,n):a(t,r).fill(e):a(t,r)}(null,t,r,e)},u.allocUnsafe=function(t){return c(null,t)},u.allocUnsafeSlow=function(t){return c(null,t)},u.isBuffer=function(t){return!(null==t||!t._isBuffer)},u.compare=function(t,r){if(!u.isBuffer(t)||!u.isBuffer(r))throw new TypeError("Arguments must be Buffers");if(t===r)return 0;for(var e=t.length,n=r.length,i=0,o=Math.min(e,n);i<o;++i)if(t[i]!==r[i]){e=t[i],n=r[i];break}return e<n?-1:n<e?1:0},u.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},u.concat=function(t,r){if(!o(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return u.alloc(0);var e;if(void 0===r)for(r=0,e=0;e<t.length;++e)r+=t[e].length;var n=u.allocUnsafe(r),i=0;for(e=0;e<t.length;++e){var s=t[e];if(!u.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers');s.copy(n,i),i+=s.length}return n},u.byteLength=d,u.prototype._isBuffer=!0,u.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var r=0;r<t;r+=2)g(this,r,r+1);return this},u.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var r=0;r<t;r+=4)g(this,r,r+3),g(this,r+1,r+2);return this},u.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var r=0;r<t;r+=8)g(this,r,r+7),g(this,r+1,r+6),g(this,r+2,r+5),g(this,r+3,r+4);return this},u.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?C(this,0,t):y.apply(this,arguments)},u.prototype.equals=function(t){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===u.compare(this,t)},u.prototype.inspect=function(){var t="",e=r.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},u.prototype.compare=function(t,r,e,n,i){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===r&&(r=0),void 0===e&&(e=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),r<0||e>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&r>=e)return 0;if(n>=i)return-1;if(r>=e)return 1;if(this===t)return 0;for(var o=(i>>>=0)-(n>>>=0),s=(e>>>=0)-(r>>>=0),a=Math.min(o,s),f=this.slice(n,i),h=t.slice(r,e),c=0;c<a;++c)if(f[c]!==h[c]){o=f[c],s=h[c];break}return o<s?-1:s<o?1:0},u.prototype.includes=function(t,r,e){return-1!==this.indexOf(t,r,e)},u.prototype.indexOf=function(t,r,e){return w(this,t,r,e,!0)},u.prototype.lastIndexOf=function(t,r,e){return w(this,t,r,e,!1)},u.prototype.write=function(t,r,e,n){if(void 0===r)n="utf8",e=this.length,r=0;else if(void 0===e&&"string"==typeof r)n=r,e=this.length,r=0;else{if(!isFinite(r))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");r|=0,isFinite(e)?(e|=0,void 0===n&&(n="utf8")):(n=e,e=void 0)}var i=this.length-r;if((void 0===e||e>i)&&(e=i),t.length>0&&(e<0||r<0)||r>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return v(this,t,r,e);case"utf8":case"utf-8":return A(this,t,r,e);case"ascii":return m(this,t,r,e);case"latin1":case"binary":return E(this,t,r,e);case"base64":return _(this,t,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return R(this,t,r,e);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},u.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function P(t,r,e){var n="";e=Math.min(t.length,e);for(var i=r;i<e;++i)n+=String.fromCharCode(127&t[i]);return n}function S(t,r,e){var n="";e=Math.min(t.length,e);for(var i=r;i<e;++i)n+=String.fromCharCode(t[i]);return n}function B(t,r,e){var n=t.length;(!r||r<0)&&(r=0),(!e||e<0||e>n)&&(e=n);for(var i="",o=r;o<e;++o)i+=L(t[o]);return i}function x(t,r,e){for(var n=t.slice(r,e),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1]);return i}function O(t,r,e){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+r>e)throw new RangeError("Trying to access beyond buffer length")}function U(t,r,e,n,i,o){if(!u.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>i||r<o)throw new RangeError('"value" argument is out of bounds');if(e+n>t.length)throw new RangeError("Index out of range")}function I(t,r,e,n){r<0&&(r=65535+r+1);for(var i=0,o=Math.min(t.length-e,2);i<o;++i)t[e+i]=(r&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function Y(t,r,e,n){r<0&&(r=4294967295+r+1);for(var i=0,o=Math.min(t.length-e,4);i<o;++i)t[e+i]=r>>>8*(n?i:3-i)&255}function M(t,r,e,n,i,o){if(e+n>t.length)throw new RangeError("Index out of range");if(e<0)throw new RangeError("Index out of range")}function j(t,r,e,n,o){return o||M(t,0,e,4),i.write(t,r,e,n,23,4),e+4}function D(t,r,e,n,o){return o||M(t,0,e,8),i.write(t,r,e,n,52,8),e+8}u.prototype.slice=function(t,r){var e,n=this.length;if((t=~~t)<0?(t+=n)<0&&(t=0):t>n&&(t=n),(r=void 0===r?n:~~r)<0?(r+=n)<0&&(r=0):r>n&&(r=n),r<t&&(r=t),u.TYPED_ARRAY_SUPPORT)(e=this.subarray(t,r)).__proto__=u.prototype;else{var i=r-t;e=new u(i,void 0);for(var o=0;o<i;++o)e[o]=this[o+t]}return e},u.prototype.readUIntLE=function(t,r,e){t|=0,r|=0,e||O(t,r,this.length);for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i;return n},u.prototype.readUIntBE=function(t,r,e){t|=0,r|=0,e||O(t,r,this.length);for(var n=this[t+--r],i=1;r>0&&(i*=256);)n+=this[t+--r]*i;return n},u.prototype.readUInt8=function(t,r){return r||O(t,1,this.length),this[t]},u.prototype.readUInt16LE=function(t,r){return r||O(t,2,this.length),this[t]|this[t+1]<<8},u.prototype.readUInt16BE=function(t,r){return r||O(t,2,this.length),this[t]<<8|this[t+1]},u.prototype.readUInt32LE=function(t,r){return r||O(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},u.prototype.readUInt32BE=function(t,r){return r||O(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},u.prototype.readIntLE=function(t,r,e){t|=0,r|=0,e||O(t,r,this.length);for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*r)),n},u.prototype.readIntBE=function(t,r,e){t|=0,r|=0,e||O(t,r,this.length);for(var n=r,i=1,o=this[t+--n];n>0&&(i*=256);)o+=this[t+--n]*i;return o>=(i*=128)&&(o-=Math.pow(2,8*r)),o},u.prototype.readInt8=function(t,r){return r||O(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},u.prototype.readInt16LE=function(t,r){r||O(t,2,this.length);var e=this[t]|this[t+1]<<8;return 32768&e?4294901760|e:e},u.prototype.readInt16BE=function(t,r){r||O(t,2,this.length);var e=this[t+1]|this[t]<<8;return 32768&e?4294901760|e:e},u.prototype.readInt32LE=function(t,r){return r||O(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},u.prototype.readInt32BE=function(t,r){return r||O(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},u.prototype.readFloatLE=function(t,r){return r||O(t,4,this.length),i.read(this,t,!0,23,4)},u.prototype.readFloatBE=function(t,r){return r||O(t,4,this.length),i.read(this,t,!1,23,4)},u.prototype.readDoubleLE=function(t,r){return r||O(t,8,this.length),i.read(this,t,!0,52,8)},u.prototype.readDoubleBE=function(t,r){return r||O(t,8,this.length),i.read(this,t,!1,52,8)},u.prototype.writeUIntLE=function(t,r,e,n){(t=+t,r|=0,e|=0,n)||U(this,t,r,e,Math.pow(2,8*e)-1,0);var i=1,o=0;for(this[r]=255&t;++o<e&&(i*=256);)this[r+o]=t/i&255;return r+e},u.prototype.writeUIntBE=function(t,r,e,n){(t=+t,r|=0,e|=0,n)||U(this,t,r,e,Math.pow(2,8*e)-1,0);var i=e-1,o=1;for(this[r+i]=255&t;--i>=0&&(o*=256);)this[r+i]=t/o&255;return r+e},u.prototype.writeUInt8=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,1,255,0),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[r]=255&t,r+1},u.prototype.writeUInt16LE=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):I(this,t,r,!0),r+2},u.prototype.writeUInt16BE=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):I(this,t,r,!1),r+2},u.prototype.writeUInt32LE=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[r+3]=t>>>24,this[r+2]=t>>>16,this[r+1]=t>>>8,this[r]=255&t):Y(this,t,r,!0),r+4},u.prototype.writeUInt32BE=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):Y(this,t,r,!1),r+4},u.prototype.writeIntLE=function(t,r,e,n){if(t=+t,r|=0,!n){var i=Math.pow(2,8*e-1);U(this,t,r,e,i-1,-i)}var o=0,s=1,a=0;for(this[r]=255&t;++o<e&&(s*=256);)t<0&&0===a&&0!==this[r+o-1]&&(a=1),this[r+o]=(t/s>>0)-a&255;return r+e},u.prototype.writeIntBE=function(t,r,e,n){if(t=+t,r|=0,!n){var i=Math.pow(2,8*e-1);U(this,t,r,e,i-1,-i)}var o=e-1,s=1,a=0;for(this[r+o]=255&t;--o>=0&&(s*=256);)t<0&&0===a&&0!==this[r+o+1]&&(a=1),this[r+o]=(t/s>>0)-a&255;return r+e},u.prototype.writeInt8=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,1,127,-128),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[r]=255&t,r+1},u.prototype.writeInt16LE=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):I(this,t,r,!0),r+2},u.prototype.writeInt16BE=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):I(this,t,r,!1),r+2},u.prototype.writeInt32LE=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,4,2147483647,-2147483648),u.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8,this[r+2]=t>>>16,this[r+3]=t>>>24):Y(this,t,r,!0),r+4},u.prototype.writeInt32BE=function(t,r,e){return t=+t,r|=0,e||U(this,t,r,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),u.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):Y(this,t,r,!1),r+4},u.prototype.writeFloatLE=function(t,r,e){return j(this,t,r,!0,e)},u.prototype.writeFloatBE=function(t,r,e){return j(this,t,r,!1,e)},u.prototype.writeDoubleLE=function(t,r,e){return D(this,t,r,!0,e)},u.prototype.writeDoubleBE=function(t,r,e){return D(this,t,r,!1,e)},u.prototype.copy=function(t,r,e,n){if(e||(e=0),n||0===n||(n=this.length),r>=t.length&&(r=t.length),r||(r=0),n>0&&n<e&&(n=e),n===e)return 0;if(0===t.length||0===this.length)return 0;if(r<0)throw new RangeError("targetStart out of bounds");if(e<0||e>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-r<n-e&&(n=t.length-r+e);var i,o=n-e;if(this===t&&e<r&&r<n)for(i=o-1;i>=0;--i)t[i+r]=this[i+e];else if(o<1e3||!u.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)t[i+r]=this[i+e];else Uint8Array.prototype.set.call(t,this.subarray(e,e+o),r);return o},u.prototype.fill=function(t,r,e,n){if("string"==typeof t){if("string"==typeof r?(n=r,r=0,e=this.length):"string"==typeof e&&(n=e,e=this.length),1===t.length){var i=t.charCodeAt(0);i<256&&(t=i)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!u.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255);if(r<0||this.length<r||this.length<e)throw new RangeError("Out of range index");if(e<=r)return this;var o;if(r>>>=0,e=void 0===e?this.length:e>>>0,t||(t=0),"number"==typeof t)for(o=r;o<e;++o)this[o]=t;else{var s=u.isBuffer(t)?t:z(new u(t,n).toString()),a=s.length;for(o=0;o<e-r;++o)this[o+r]=s[o%a]}return this};var k=/[^+\/0-9A-Za-z-_]/g;function L(t){return t<16?"0"+t.toString(16):t.toString(16)}function z(t,r){var e;r=r||1/0;for(var n=t.length,i=null,o=[],s=0;s<n;++s){if((e=t.charCodeAt(s))>55295&&e<57344){if(!i){if(e>56319){(r-=3)>-1&&o.push(239,191,189);continue}if(s+1===n){(r-=3)>-1&&o.push(239,191,189);continue}i=e;continue}if(e<56320){(r-=3)>-1&&o.push(239,191,189),i=e;continue}e=65536+(i-55296<<10|e-56320)}else i&&(r-=3)>-1&&o.push(239,191,189);if(i=null,e<128){if((r-=1)<0)break;o.push(e)}else if(e<2048){if((r-=2)<0)break;o.push(e>>6|192,63&e|128)}else if(e<65536){if((r-=3)<0)break;o.push(e>>12|224,e>>6&63|128,63&e|128)}else{if(!(e<1114112))throw new Error("Invalid code point");if((r-=4)<0)break;o.push(e>>18|240,e>>12&63|128,e>>6&63|128,63&e|128)}}return o}function N(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(k,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function q(t,r,e,n){for(var i=0;i<n&&!(i+e>=r.length||i>=t.length);++i)r[i+e]=t[i];return i}}).call(this,e(150))},366:function(t,r){t.exports=require("Time")},367:function(t,r){t.exports=require("cannon")},368:function(t,r){t.exports=require("Diagnostics")},369:function(t,r){t.exports=require("Scene")},4:function(t,r,e){"use strict";r.byteLength=function(t){var r=f(t),e=r[0],n=r[1];return 3*(e+n)/4-n},r.toByteArray=function(t){var r,e,n=f(t),s=n[0],a=n[1],u=new o(function(t,r,e){return 3*(r+e)/4-e}(0,s,a)),h=0,c=a>0?s-4:s;for(e=0;e<c;e+=4)r=i[t.charCodeAt(e)]<<18|i[t.charCodeAt(e+1)]<<12|i[t.charCodeAt(e+2)]<<6|i[t.charCodeAt(e+3)],u[h++]=r>>16&255,u[h++]=r>>8&255,u[h++]=255&r;2===a&&(r=i[t.charCodeAt(e)]<<2|i[t.charCodeAt(e+1)]>>4,u[h++]=255&r);1===a&&(r=i[t.charCodeAt(e)]<<10|i[t.charCodeAt(e+1)]<<4|i[t.charCodeAt(e+2)]>>2,u[h++]=r>>8&255,u[h++]=255&r);return u},r.fromByteArray=function(t){for(var r,e=t.length,i=e%3,o=[],s=0,a=e-i;s<a;s+=16383)o.push(h(t,s,s+16383>a?a:s+16383));1===i?(r=t[e-1],o.push(n[r>>2]+n[r<<4&63]+"==")):2===i&&(r=(t[e-2]<<8)+t[e-1],o.push(n[r>>10]+n[r>>4&63]+n[r<<2&63]+"="));return o.join("")};for(var n=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,u=s.length;a<u;++a)n[a]=s[a],i[s.charCodeAt(a)]=a;function f(t){var r=t.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var e=t.indexOf("=");return-1===e&&(e=r),[e,e===r?0:4-e%4]}function h(t,r,e){for(var i,o,s=[],a=r;a<e;a+=3)i=(t[a]<<16&16711680)+(t[a+1]<<8&65280)+(255&t[a+2]),s.push(n[(o=i)>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);return s.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},5:function(t,r){r.read=function(t,r,e,n,i){var o,s,a=8*i-n-1,u=(1<<a)-1,f=u>>1,h=-7,c=e?i-1:0,l=e?-1:1,p=t[r+c];for(c+=l,o=p&(1<<-h)-1,p>>=-h,h+=a;h>0;o=256*o+t[r+c],c+=l,h-=8);for(s=o&(1<<-h)-1,o>>=-h,h+=n;h>0;s=256*s+t[r+c],c+=l,h-=8);if(0===o)o=1-f;else{if(o===u)return s?NaN:1/0*(p?-1:1);s+=Math.pow(2,n),o-=f}return(p?-1:1)*s*Math.pow(2,o-n)},r.write=function(t,r,e,n,i,o){var s,a,u,f=8*o-i-1,h=(1<<f)-1,c=h>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,d=n?1:-1,y=r<0||0===r&&1/r<0?1:0;for(r=Math.abs(r),isNaN(r)||r===1/0?(a=isNaN(r)?1:0,s=h):(s=Math.floor(Math.log(r)/Math.LN2),r*(u=Math.pow(2,-s))<1&&(s--,u*=2),(r+=s+c>=1?l/u:l*Math.pow(2,1-c))*u>=2&&(s++,u/=2),s+c>=h?(a=0,s=h):s+c>=1?(a=(r*u-1)*Math.pow(2,i),s+=c):(a=r*Math.pow(2,c-1)*Math.pow(2,i),s=0));i>=8;t[e+p]=255&a,p+=d,a/=256,i-=8);for(s=s<<i|a,f+=i;f>0;t[e+p]=255&s,p+=d,s/=256,f-=8);t[e+p-d]|=128*y}},6:function(t,r){var e={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==e.call(t)}}});