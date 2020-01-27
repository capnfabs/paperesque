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

export { docReady, windowLoaded, onWindowResize};
