// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.docReady = docReady;
exports.windowLoaded = windowLoaded;
exports.onWindowResize = onWindowResize;

// borrowed from https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function windowLoaded(fn) {
  // see if we're already loaded
  if (document.readyState === "complete") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    window.addEventListener("load", fn);
  }
}

function onWindowResize(fn) {
  windowLoaded(function () {
    window.addEventListener('resize', fn);
    setTimeout(fn, 1);
  });
}
},{}],"anchorizeHeadings.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = anchorizeOnReady;

var _utils = require("./utils.js");

// Borrowed from https://github.com/gohugoio/gohugoioTheme/blob/2e7250ca437d4666329d3ca96708dd3a4ff59818/assets/js/anchorforid.js
function anchorForId(id) {
  var anchor = document.createElement("a");
  anchor.className = "header-link";
  anchor.title = "Link to this section";
  anchor.href = "#" + id; // Icon from https://useiconic.com/open#icons

  anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path d="M5.88.03c-.18.01-.36.03-.53.09-.27.1-.53.25-.75.47a.5.5 0 1 0 .69.69c.11-.11.24-.17.38-.22.35-.12.78-.07 1.06.22.39.39.39 1.04 0 1.44l-1.5 1.5c-.44.44-.8.48-1.06.47-.26-.01-.41-.13-.41-.13a.5.5 0 1 0-.5.88s.34.22.84.25c.5.03 1.2-.16 1.81-.78l1.5-1.5c.78-.78.78-2.04 0-2.81-.28-.28-.61-.45-.97-.53-.18-.04-.38-.04-.56-.03zm-2 2.31c-.5-.02-1.19.15-1.78.75l-1.5 1.5c-.78.78-.78 2.04 0 2.81.56.56 1.36.72 2.06.47.27-.1.53-.25.75-.47a.5.5 0 1 0-.69-.69c-.11.11-.24.17-.38.22-.35.12-.78.07-1.06-.22-.39-.39-.39-1.04 0-1.44l1.5-1.5c.4-.4.75-.45 1.03-.44.28.01.47.09.47.09a.5.5 0 1 0 .44-.88s-.34-.2-.84-.22z" /></svg>';
  return anchor;
}

function anchorizeHeadings() {
  // If we've found more than 1 article, then abort. It probably means I've
  // messed something up if this is the case, but I don't have enough
  // confidence in the way I've set everything up to _not_ do this safety
  // check.
  var articles = document.querySelectorAll('section#main article');

  if (articles.length != 1) {
    return;
  } // Keep this list of header classes in sync with style.css


  var headers = articles[0].querySelectorAll('h2, h3, h4');
  Array.prototype.forEach.call(headers, function (el, i) {
    var link = anchorForId(el.id);
    el.appendChild(link);
  });
}

function anchorizeOnReady() {
  (0, _utils.docReady)(anchorizeHeadings);
}
},{"./utils.js":"utils.js"}],"../node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resizeObservers = void 0;
var resizeObservers = [];
exports.resizeObservers = resizeObservers;
},{}],"../node_modules/@juggle/resize-observer/lib/algorithms/hasActiveObservations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasActiveObservations = void 0;

var _resizeObservers = require("../utils/resizeObservers");

var hasActiveObservations = function () {
  return _resizeObservers.resizeObservers.some(function (ro) {
    return ro.activeTargets.length > 0;
  });
};

exports.hasActiveObservations = hasActiveObservations;
},{"../utils/resizeObservers":"../node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js"}],"../node_modules/@juggle/resize-observer/lib/algorithms/hasSkippedObservations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasSkippedObservations = void 0;

var _resizeObservers = require("../utils/resizeObservers");

var hasSkippedObservations = function () {
  return _resizeObservers.resizeObservers.some(function (ro) {
    return ro.skippedTargets.length > 0;
  });
};

exports.hasSkippedObservations = hasSkippedObservations;
},{"../utils/resizeObservers":"../node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js"}],"../node_modules/@juggle/resize-observer/lib/algorithms/deliverResizeLoopError.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deliverResizeLoopError = void 0;
var msg = 'ResizeObserver loop completed with undelivered notifications.';

var deliverResizeLoopError = function () {
  var event;

  if (typeof ErrorEvent === 'function') {
    event = new ErrorEvent('error', {
      message: msg
    });
  } else {
    event = document.createEvent('Event');
    event.initEvent('error', false, false);
    event.message = msg;
  }

  window.dispatchEvent(event);
};

exports.deliverResizeLoopError = deliverResizeLoopError;
},{}],"../node_modules/@juggle/resize-observer/lib/ResizeObserverBoxOptions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResizeObserverBoxOptions = void 0;
var ResizeObserverBoxOptions;
exports.ResizeObserverBoxOptions = ResizeObserverBoxOptions;

(function (ResizeObserverBoxOptions) {
  ResizeObserverBoxOptions["BORDER_BOX"] = "border-box";
  ResizeObserverBoxOptions["CONTENT_BOX"] = "content-box";
  ResizeObserverBoxOptions["DEVICE_PIXEL_CONTENT_BOX"] = "device-pixel-content-box";
})(ResizeObserverBoxOptions || (exports.ResizeObserverBoxOptions = ResizeObserverBoxOptions = {}));
},{}],"../node_modules/@juggle/resize-observer/lib/DOMRectReadOnly.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMRectReadOnly = void 0;

var DOMRectReadOnly = function () {
  function DOMRectReadOnly(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.top = this.y;
    this.left = this.x;
    this.bottom = this.top + this.height;
    this.right = this.left + this.width;
    return Object.freeze(this);
  }

  DOMRectReadOnly.fromRect = function (rectangle) {
    return new DOMRectReadOnly(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  };

  return DOMRectReadOnly;
}();

exports.DOMRectReadOnly = DOMRectReadOnly;
},{}],"../node_modules/@juggle/resize-observer/lib/utils/element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isReplacedElement = exports.isHidden = exports.isSVG = void 0;

var isSVG = function (target) {
  return target instanceof SVGElement && 'getBBox' in target;
};

exports.isSVG = isSVG;

var isHidden = function (target) {
  if (isSVG(target)) {
    var _a = target.getBBox(),
        width = _a.width,
        height = _a.height;

    return !width && !height;
  }

  var _b = target,
      offsetWidth = _b.offsetWidth,
      offsetHeight = _b.offsetHeight;
  return !(offsetWidth || offsetHeight || target.getClientRects().length);
};

exports.isHidden = isHidden;

var isReplacedElement = function (target) {
  switch (target.tagName) {
    case 'INPUT':
      if (target.type !== 'image') {
        break;
      }

    case 'VIDEO':
    case 'AUDIO':
    case 'EMBED':
    case 'OBJECT':
    case 'CANVAS':
    case 'IFRAME':
    case 'IMG':
      return true;
  }

  return false;
};

exports.isReplacedElement = isReplacedElement;
},{}],"../node_modules/@juggle/resize-observer/lib/utils/global.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.global = void 0;
var global = typeof window !== 'undefined' ? window : {};
exports.global = global;
},{}],"../node_modules/@juggle/resize-observer/lib/algorithms/calculateBoxSize.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = exports.calculateBoxSizes = exports.calculateBoxSize = void 0;

var _ResizeObserverBoxOptions = require("../ResizeObserverBoxOptions");

var _DOMRectReadOnly = require("../DOMRectReadOnly");

var _element = require("../utils/element");

var _global = require("../utils/global");

var cache = new Map();
exports.cache = cache;
var scrollRegexp = /auto|scroll/;
var verticalRegexp = /^tb|vertical/;
var IE = /msie|trident/i.test(_global.global.navigator && _global.global.navigator.userAgent);

var parseDimension = function (pixel) {
  return parseFloat(pixel || '0');
};

var size = function (inlineSize, blockSize, switchSizes) {
  if (inlineSize === void 0) {
    inlineSize = 0;
  }

  if (blockSize === void 0) {
    blockSize = 0;
  }

  if (switchSizes === void 0) {
    switchSizes = false;
  }

  return Object.freeze({
    inlineSize: (switchSizes ? blockSize : inlineSize) || 0,
    blockSize: (switchSizes ? inlineSize : blockSize) || 0
  });
};

var zeroBoxes = Object.freeze({
  devicePixelContentBoxSize: size(),
  borderBoxSize: size(),
  contentBoxSize: size(),
  contentRect: new _DOMRectReadOnly.DOMRectReadOnly(0, 0, 0, 0)
});

var calculateBoxSizes = function (target) {
  if (cache.has(target)) {
    return cache.get(target);
  }

  if ((0, _element.isHidden)(target)) {
    cache.set(target, zeroBoxes);
    return zeroBoxes;
  }

  var cs = getComputedStyle(target);
  var svg = (0, _element.isSVG)(target) && target.ownerSVGElement && target.getBBox();
  var removePadding = !IE && cs.boxSizing === 'border-box';
  var switchSizes = verticalRegexp.test(cs.writingMode || '');
  var canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || '');
  var canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || '');
  var paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
  var paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
  var paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
  var paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
  var borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
  var borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
  var borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
  var borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
  var horizontalPadding = paddingLeft + paddingRight;
  var verticalPadding = paddingTop + paddingBottom;
  var horizontalBorderArea = borderLeft + borderRight;
  var verticalBorderArea = borderTop + borderBottom;
  var horizontalScrollbarThickness = !canScrollHorizontally ? 0 : target.offsetHeight - verticalBorderArea - target.clientHeight;
  var verticalScrollbarThickness = !canScrollVertically ? 0 : target.offsetWidth - horizontalBorderArea - target.clientWidth;
  var widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
  var heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
  var contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
  var contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
  var borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
  var borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;
  var boxes = Object.freeze({
    devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
    borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
    contentBoxSize: size(contentWidth, contentHeight, switchSizes),
    contentRect: new _DOMRectReadOnly.DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
  });
  cache.set(target, boxes);
  return boxes;
};

exports.calculateBoxSizes = calculateBoxSizes;

var calculateBoxSize = function (target, observedBox) {
  var _a = calculateBoxSizes(target),
      borderBoxSize = _a.borderBoxSize,
      contentBoxSize = _a.contentBoxSize,
      devicePixelContentBoxSize = _a.devicePixelContentBoxSize;

  switch (observedBox) {
    case _ResizeObserverBoxOptions.ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
      return devicePixelContentBoxSize;

    case _ResizeObserverBoxOptions.ResizeObserverBoxOptions.BORDER_BOX:
      return borderBoxSize;

    default:
      return contentBoxSize;
  }
};

exports.calculateBoxSize = calculateBoxSize;
},{"../ResizeObserverBoxOptions":"../node_modules/@juggle/resize-observer/lib/ResizeObserverBoxOptions.js","../DOMRectReadOnly":"../node_modules/@juggle/resize-observer/lib/DOMRectReadOnly.js","../utils/element":"../node_modules/@juggle/resize-observer/lib/utils/element.js","../utils/global":"../node_modules/@juggle/resize-observer/lib/utils/global.js"}],"../node_modules/@juggle/resize-observer/lib/ResizeObserverEntry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResizeObserverEntry = void 0;

var _calculateBoxSize = require("./algorithms/calculateBoxSize");

var ResizeObserverEntry = function () {
  function ResizeObserverEntry(target) {
    var boxes = (0, _calculateBoxSize.calculateBoxSizes)(target);
    this.target = target;
    this.contentRect = boxes.contentRect;
    this.borderBoxSize = [boxes.borderBoxSize];
    this.contentBoxSize = [boxes.contentBoxSize];
    this.devicePixelContentBoxSize = [boxes.devicePixelContentBoxSize];
  }

  return ResizeObserverEntry;
}();

exports.ResizeObserverEntry = ResizeObserverEntry;
},{"./algorithms/calculateBoxSize":"../node_modules/@juggle/resize-observer/lib/algorithms/calculateBoxSize.js"}],"../node_modules/@juggle/resize-observer/lib/algorithms/calculateDepthForNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateDepthForNode = void 0;

var _element = require("../utils/element");

var calculateDepthForNode = function (node) {
  if ((0, _element.isHidden)(node)) {
    return Infinity;
  }

  var depth = 0;
  var parent = node.parentNode;

  while (parent) {
    depth += 1;
    parent = parent.parentNode;
  }

  return depth;
};

exports.calculateDepthForNode = calculateDepthForNode;
},{"../utils/element":"../node_modules/@juggle/resize-observer/lib/utils/element.js"}],"../node_modules/@juggle/resize-observer/lib/algorithms/broadcastActiveObservations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.broadcastActiveObservations = void 0;

var _resizeObservers = require("../utils/resizeObservers");

var _ResizeObserverEntry = require("../ResizeObserverEntry");

var _calculateDepthForNode = require("./calculateDepthForNode");

var _calculateBoxSize = require("./calculateBoxSize");

var broadcastActiveObservations = function () {
  var shallowestDepth = Infinity;
  var callbacks = [];

  _resizeObservers.resizeObservers.forEach(function processObserver(ro) {
    if (ro.activeTargets.length === 0) {
      return;
    }

    var entries = [];
    ro.activeTargets.forEach(function processTarget(ot) {
      var entry = new _ResizeObserverEntry.ResizeObserverEntry(ot.target);
      var targetDepth = (0, _calculateDepthForNode.calculateDepthForNode)(ot.target);
      entries.push(entry);
      ot.lastReportedSize = (0, _calculateBoxSize.calculateBoxSize)(ot.target, ot.observedBox);

      if (targetDepth < shallowestDepth) {
        shallowestDepth = targetDepth;
      }
    });
    callbacks.push(function resizeObserverCallback() {
      ro.callback.call(ro.observer, entries, ro.observer);
    });
    ro.activeTargets.splice(0, ro.activeTargets.length);
  });

  for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
    var callback = callbacks_1[_i];
    callback();
  }

  return shallowestDepth;
};

exports.broadcastActiveObservations = broadcastActiveObservations;
},{"../utils/resizeObservers":"../node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js","../ResizeObserverEntry":"../node_modules/@juggle/resize-observer/lib/ResizeObserverEntry.js","./calculateDepthForNode":"../node_modules/@juggle/resize-observer/lib/algorithms/calculateDepthForNode.js","./calculateBoxSize":"../node_modules/@juggle/resize-observer/lib/algorithms/calculateBoxSize.js"}],"../node_modules/@juggle/resize-observer/lib/algorithms/gatherActiveObservationsAtDepth.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gatherActiveObservationsAtDepth = void 0;

var _resizeObservers = require("../utils/resizeObservers");

var _calculateDepthForNode = require("./calculateDepthForNode");

var _calculateBoxSize = require("./calculateBoxSize");

var gatherActiveObservationsAtDepth = function (depth) {
  _calculateBoxSize.cache.clear();

  _resizeObservers.resizeObservers.forEach(function processObserver(ro) {
    ro.activeTargets.splice(0, ro.activeTargets.length);
    ro.skippedTargets.splice(0, ro.skippedTargets.length);
    ro.observationTargets.forEach(function processTarget(ot) {
      if (ot.isActive()) {
        if ((0, _calculateDepthForNode.calculateDepthForNode)(ot.target) > depth) {
          ro.activeTargets.push(ot);
        } else {
          ro.skippedTargets.push(ot);
        }
      }
    });
  });
};

exports.gatherActiveObservationsAtDepth = gatherActiveObservationsAtDepth;
},{"../utils/resizeObservers":"../node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js","./calculateDepthForNode":"../node_modules/@juggle/resize-observer/lib/algorithms/calculateDepthForNode.js","./calculateBoxSize":"../node_modules/@juggle/resize-observer/lib/algorithms/calculateBoxSize.js"}],"../node_modules/@juggle/resize-observer/lib/utils/process.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = void 0;

var _hasActiveObservations = require("../algorithms/hasActiveObservations");

var _hasSkippedObservations = require("../algorithms/hasSkippedObservations");

var _deliverResizeLoopError = require("../algorithms/deliverResizeLoopError");

var _broadcastActiveObservations = require("../algorithms/broadcastActiveObservations");

var _gatherActiveObservationsAtDepth = require("../algorithms/gatherActiveObservationsAtDepth");

var process = function () {
  var depth = 0;
  (0, _gatherActiveObservationsAtDepth.gatherActiveObservationsAtDepth)(depth);

  while ((0, _hasActiveObservations.hasActiveObservations)()) {
    depth = (0, _broadcastActiveObservations.broadcastActiveObservations)();
    (0, _gatherActiveObservationsAtDepth.gatherActiveObservationsAtDepth)(depth);
  }

  if ((0, _hasSkippedObservations.hasSkippedObservations)()) {
    (0, _deliverResizeLoopError.deliverResizeLoopError)();
  }

  return depth > 0;
};

exports.process = process;
},{"../algorithms/hasActiveObservations":"../node_modules/@juggle/resize-observer/lib/algorithms/hasActiveObservations.js","../algorithms/hasSkippedObservations":"../node_modules/@juggle/resize-observer/lib/algorithms/hasSkippedObservations.js","../algorithms/deliverResizeLoopError":"../node_modules/@juggle/resize-observer/lib/algorithms/deliverResizeLoopError.js","../algorithms/broadcastActiveObservations":"../node_modules/@juggle/resize-observer/lib/algorithms/broadcastActiveObservations.js","../algorithms/gatherActiveObservationsAtDepth":"../node_modules/@juggle/resize-observer/lib/algorithms/gatherActiveObservationsAtDepth.js"}],"../node_modules/@juggle/resize-observer/lib/utils/queueMicroTask.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queueMicroTask = void 0;
var trigger;
var callbacks = [];

var notify = function () {
  return callbacks.splice(0).forEach(function (cb) {
    return cb();
  });
};

var queueMicroTask = function (callback) {
  if (!trigger) {
    var el_1 = document.createTextNode('');
    var config = {
      characterData: true
    };
    new MutationObserver(function () {
      return notify();
    }).observe(el_1, config);

    trigger = function () {
      el_1.textContent = '';
    };
  }

  callbacks.push(callback);
  trigger();
};

exports.queueMicroTask = queueMicroTask;
},{}],"../node_modules/@juggle/resize-observer/lib/utils/queueResizeObserver.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queueResizeObserver = void 0;

var _queueMicroTask = require("./queueMicroTask");

var queueResizeObserver = function (cb) {
  (0, _queueMicroTask.queueMicroTask)(function ResizeObserver() {
    requestAnimationFrame(cb);
  });
};

exports.queueResizeObserver = queueResizeObserver;
},{"./queueMicroTask":"../node_modules/@juggle/resize-observer/lib/utils/queueMicroTask.js"}],"../node_modules/@juggle/resize-observer/lib/utils/scheduler.js":[function(require,module,exports) {


"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCount = exports.scheduler = void 0;

var _process = require("./process");

var _global = require("./global");

var _queueResizeObserver = require("./queueResizeObserver");

var watching = 0;

var isWatching = function () {
  return !!watching;
};

var CATCH_FRAMES = 60 / 5;
var observerConfig = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
};
var events = ['resize', 'load', 'transitionend', 'animationend', 'animationstart', 'animationiteration', 'keyup', 'keydown', 'mouseup', 'mousedown', 'mouseover', 'mouseout', 'blur', 'focus'];
var scheduled = false;

var Scheduler = function () {
  function Scheduler() {
    var _this = this;

    this.stopped = true;

    this.listener = function () {
      return _this.schedule();
    };
  }

  Scheduler.prototype.run = function (frames) {
    var _this = this;

    if (scheduled) {
      return;
    }

    scheduled = true;
    (0, _queueResizeObserver.queueResizeObserver)(function () {
      var elementsHaveResized = false;

      try {
        elementsHaveResized = (0, _process.process)();
      } finally {
        scheduled = false;

        if (!isWatching()) {
          return;
        }

        if (elementsHaveResized) {
          _this.run(60);
        } else if (frames) {
          _this.run(frames - 1);
        } else {
          _this.start();
        }
      }
    });
  };

  Scheduler.prototype.schedule = function () {
    this.stop();
    this.run(CATCH_FRAMES);
  };

  Scheduler.prototype.observe = function () {
    var _this = this;

    var cb = function () {
      return _this.observer && _this.observer.observe(document.body, observerConfig);
    };

    document.body ? cb() : _global.global.addEventListener('DOMContentLoaded', cb);
  };

  Scheduler.prototype.start = function () {
    var _this = this;

    if (this.stopped) {
      this.stopped = false;
      this.observer = new MutationObserver(this.listener);
      this.observe();
      events.forEach(function (name) {
        return _global.global.addEventListener(name, _this.listener, true);
      });
    }
  };

  Scheduler.prototype.stop = function () {
    var _this = this;

    if (!this.stopped) {
      this.observer && this.observer.disconnect();
      events.forEach(function (name) {
        return _global.global.removeEventListener(name, _this.listener, true);
      });
      this.stopped = true;
    }
  };

  return Scheduler;
}();

var scheduler = new Scheduler();
exports.scheduler = scheduler;

var updateCount = function (n) {
  !watching && n > 0 && scheduler.start();
  watching += n;
  !watching && scheduler.stop();
};

exports.updateCount = updateCount;
},{"./process":"../node_modules/@juggle/resize-observer/lib/utils/process.js","./global":"../node_modules/@juggle/resize-observer/lib/utils/global.js","./queueResizeObserver":"../node_modules/@juggle/resize-observer/lib/utils/queueResizeObserver.js"}],"../node_modules/@juggle/resize-observer/lib/ResizeObservation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResizeObservation = void 0;

var _ResizeObserverBoxOptions = require("./ResizeObserverBoxOptions");

var _calculateBoxSize = require("./algorithms/calculateBoxSize");

var _element = require("./utils/element");

var skipNotifyOnElement = function (target) {
  return !(0, _element.isSVG)(target) && !(0, _element.isReplacedElement)(target) && getComputedStyle(target).display === 'inline';
};

var ResizeObservation = function () {
  function ResizeObservation(target, observedBox) {
    this.target = target;
    this.observedBox = observedBox || _ResizeObserverBoxOptions.ResizeObserverBoxOptions.CONTENT_BOX;
    this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }

  ResizeObservation.prototype.isActive = function () {
    var size = (0, _calculateBoxSize.calculateBoxSize)(this.target, this.observedBox);

    if (skipNotifyOnElement(this.target)) {
      this.lastReportedSize = size;
    }

    if (this.lastReportedSize.inlineSize !== size.inlineSize || this.lastReportedSize.blockSize !== size.blockSize) {
      return true;
    }

    return false;
  };

  return ResizeObservation;
}();

exports.ResizeObservation = ResizeObservation;
},{"./ResizeObserverBoxOptions":"../node_modules/@juggle/resize-observer/lib/ResizeObserverBoxOptions.js","./algorithms/calculateBoxSize":"../node_modules/@juggle/resize-observer/lib/algorithms/calculateBoxSize.js","./utils/element":"../node_modules/@juggle/resize-observer/lib/utils/element.js"}],"../node_modules/@juggle/resize-observer/lib/ResizeObserverDetail.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResizeObserverDetail = void 0;

var ResizeObserverDetail = function () {
  function ResizeObserverDetail(resizeObserver, callback) {
    this.activeTargets = [];
    this.skippedTargets = [];
    this.observationTargets = [];
    this.observer = resizeObserver;
    this.callback = callback;
  }

  return ResizeObserverDetail;
}();

exports.ResizeObserverDetail = ResizeObserverDetail;
},{}],"../node_modules/@juggle/resize-observer/lib/ResizeObserverController.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResizeObserverController = void 0;

var _scheduler = require("./utils/scheduler");

var _ResizeObservation = require("./ResizeObservation");

var _ResizeObserverDetail = require("./ResizeObserverDetail");

var _resizeObservers = require("./utils/resizeObservers");

var observerMap = new Map();

var getObservationIndex = function (observationTargets, target) {
  for (var i = 0; i < observationTargets.length; i += 1) {
    if (observationTargets[i].target === target) {
      return i;
    }
  }

  return -1;
};

var ResizeObserverController = function () {
  function ResizeObserverController() {}

  ResizeObserverController.connect = function (resizeObserver, callback) {
    var detail = new _ResizeObserverDetail.ResizeObserverDetail(resizeObserver, callback);

    _resizeObservers.resizeObservers.push(detail);

    observerMap.set(resizeObserver, detail);
  };

  ResizeObserverController.observe = function (resizeObserver, target, options) {
    if (observerMap.has(resizeObserver)) {
      var detail = observerMap.get(resizeObserver);

      if (getObservationIndex(detail.observationTargets, target) < 0) {
        detail.observationTargets.push(new _ResizeObservation.ResizeObservation(target, options && options.box));
        (0, _scheduler.updateCount)(1);

        _scheduler.scheduler.schedule();
      }
    }
  };

  ResizeObserverController.unobserve = function (resizeObserver, target) {
    if (observerMap.has(resizeObserver)) {
      var detail = observerMap.get(resizeObserver);
      var index = getObservationIndex(detail.observationTargets, target);

      if (index >= 0) {
        detail.observationTargets.splice(index, 1);
        (0, _scheduler.updateCount)(-1);
      }
    }
  };

  ResizeObserverController.disconnect = function (resizeObserver) {
    if (observerMap.has(resizeObserver)) {
      var detail = observerMap.get(resizeObserver);

      _resizeObservers.resizeObservers.splice(_resizeObservers.resizeObservers.indexOf(detail), 1);

      observerMap.delete(resizeObserver);
      (0, _scheduler.updateCount)(-detail.observationTargets.length);
    }
  };

  return ResizeObserverController;
}();

exports.ResizeObserverController = ResizeObserverController;
},{"./utils/scheduler":"../node_modules/@juggle/resize-observer/lib/utils/scheduler.js","./ResizeObservation":"../node_modules/@juggle/resize-observer/lib/ResizeObservation.js","./ResizeObserverDetail":"../node_modules/@juggle/resize-observer/lib/ResizeObserverDetail.js","./utils/resizeObservers":"../node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js"}],"../node_modules/@juggle/resize-observer/lib/ResizeObserver.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResizeObserver = void 0;

var _ResizeObserverController = require("./ResizeObserverController");

var ResizeObserver = function () {
  function ResizeObserver(callback) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
    }

    if (typeof callback !== 'function') {
      throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
    }

    _ResizeObserverController.ResizeObserverController.connect(this, callback);
  }

  ResizeObserver.prototype.observe = function (target, options) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
    }

    if (target instanceof Element === false) {
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    }

    _ResizeObserverController.ResizeObserverController.observe(this, target, options);
  };

  ResizeObserver.prototype.unobserve = function (target) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    }

    if (target instanceof Element === false) {
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    }

    _ResizeObserverController.ResizeObserverController.unobserve(this, target);
  };

  ResizeObserver.prototype.disconnect = function () {
    _ResizeObserverController.ResizeObserverController.disconnect(this);
  };

  ResizeObserver.toString = function () {
    return 'function ResizeObserver () { [polyfill code] }';
  };

  return ResizeObserver;
}();

exports.ResizeObserver = ResizeObserver;
},{"./ResizeObserverController":"../node_modules/@juggle/resize-observer/lib/ResizeObserverController.js"}],"../node_modules/@juggle/resize-observer/lib/exports/resize-observer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ResizeObserver", {
  enumerable: true,
  get: function () {
    return _ResizeObserver.ResizeObserver;
  }
});
Object.defineProperty(exports, "ResizeObserverEntry", {
  enumerable: true,
  get: function () {
    return _ResizeObserverEntry.ResizeObserverEntry;
  }
});

var _ResizeObserver = require("../ResizeObserver");

var _ResizeObserverEntry = require("../ResizeObserverEntry");
},{"../ResizeObserver":"../node_modules/@juggle/resize-observer/lib/ResizeObserver.js","../ResizeObserverEntry":"../node_modules/@juggle/resize-observer/lib/ResizeObserverEntry.js"}],"floatingFootnotes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = enableFloatingFootnotes;

var _utils = require("./utils.js");

var _resizeObserver = require("@juggle/resize-observer");

var ARTICLE_CONTENT_SELECTOR = "section#main";
var FOOTNOTE_SECTION_SELECTOR = "section.footnotes[role=doc-endnotes]";
var FLOATING_FOOTNOTE_MIN_WIDTH = 1260; // Computes an offset such that setting `top` on elemToAlign will put it
// in vertical alignment with targetAlignment.

function computeOffsetForAlignment(elemToAlign, targetAlignment) {
  var offsetParentTop = elemToAlign.offsetParent.getBoundingClientRect().top; // Distance between the top of the offset parent and the top of the target alignment

  return targetAlignment.getBoundingClientRect().top - offsetParentTop;
}

function setFootnoteOffsets(footnotes) {
  // Keep track of the bottom of the last element, because we don't want to
  // overlap footnotes.
  var bottomOfLastElem = 0;
  Array.prototype.forEach.call(footnotes, function (footnote, i) {
    // In theory, don't need to escape this because IDs can't contain
    // quotes, in practice, not sure. ¯\_(ツ)_/¯
    // Get the thing that refers to the footnote
    var intextLink = document.querySelector("a.footnote-ref[href='#" + footnote.id + "']"); // Find its "content parent"; nearest paragraph or list item or
    // whatever. We use this for alignment because it looks much cleaner.
    // If it doesn't, your paragraphs are too long :P
    // Fallback - use the same height as the link.

    var verticalAlignmentTarget = intextLink.closest('p,li') || intextLink;
    var offset = computeOffsetForAlignment(footnote, verticalAlignmentTarget);

    if (offset < bottomOfLastElem) {
      offset = bottomOfLastElem;
    } // computedStyle values are always in pixels, but have the suffix 'px'.
    // offsetHeight doesn't include margins, but we want it to use them so
    // we retain the style / visual fidelity when all the footnotes are
    // crammed together.


    bottomOfLastElem = offset + footnote.offsetHeight + parseInt(window.getComputedStyle(footnote).marginBottom) + parseInt(window.getComputedStyle(footnote).marginTop);
    footnote.style.top = offset + 'px';
    footnote.style.position = 'absolute';
  });
}

function clearFootnoteOffsets(footnotes) {
  // Reset all
  Array.prototype.forEach.call(footnotes, function (fn, i) {
    fn.style.top = null;
    fn.style.position = null;
  });
} // contract: this is idempotent; i.e. it won't wreck anything if you call it
// with the same value over and over again. Though maybe it'll wreck performance
// lol.


function updateFootnoteFloat(shouldFloat) {
  var footnoteSection = document.querySelector(FOOTNOTE_SECTION_SELECTOR);
  var footnotes = footnoteSection.querySelectorAll("li[role=doc-endnote]");

  if (shouldFloat) {
    // Do this first because we need styles applied before doing other
    // calculations
    footnoteSection.classList.add('floating-footnotes');
    setFootnoteOffsets(footnotes);
    subscribeToUpdates();
  } else {
    unsubscribeFromUpdates();
    clearFootnoteOffsets(footnotes);
    footnoteSection.classList.remove('floating-footnotes');
  }
}

function subscribeToUpdates() {
  var article = document.querySelector(ARTICLE_CONTENT_SELECTOR); // Watch for dimension changes on the thing that holds all the footnotes so
  // we can reposition as required

  resizeObserver.observe(article);
}

function unsubscribeFromUpdates() {
  resizeObserver.disconnect();
}

var notifySizeChange = function () {
  // Default state, not expanded.
  var bigEnough = false;
  return function () {
    // Pixel width at which this looks good
    var nowBigEnough = window.innerWidth >= FLOATING_FOOTNOTE_MIN_WIDTH;

    if (nowBigEnough !== bigEnough) {
      updateFootnoteFloat(nowBigEnough);
      bigEnough = nowBigEnough;
    }
  };
}();

var resizeObserver = new _resizeObserver.ResizeObserver(function (_entries, observer) {
  // By virtue of the fact that we're subscribed, we know this is true.
  updateFootnoteFloat(true);
});

function enableFloatingFootnotes() {
  (0, _utils.docReady)(function () {
    var footnoteSection = document.querySelector(FOOTNOTE_SECTION_SELECTOR);
    var article = document.querySelector(ARTICLE_CONTENT_SELECTOR);
    var allowFloatingFootnotes = article && !article.classList.contains('no-floating-footnotes'); // only set it all up if there's actually a footnote section and
    // we haven't explicitly disabled floating footnotes.

    if (footnoteSection && allowFloatingFootnotes) {
      (0, _utils.onWindowResize)(notifySizeChange);
    }
  });
}
},{"./utils.js":"utils.js","@juggle/resize-observer":"../node_modules/@juggle/resize-observer/lib/exports/resize-observer.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _anchorizeHeadings = _interopRequireDefault(require("./anchorizeHeadings.js"));

var _floatingFootnotes = _interopRequireDefault(require("./floatingFootnotes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _floatingFootnotes.default)();
(0, _anchorizeHeadings.default)();
},{"./anchorizeHeadings.js":"anchorizeHeadings.js","./floatingFootnotes.js":"floatingFootnotes.js"}],"../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56616" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.js.map