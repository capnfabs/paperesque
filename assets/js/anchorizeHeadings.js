import { docReady } from "./utils.js";

// Borrowed from https://github.com/gohugoio/gohugoioTheme/blob/2e7250ca437d4666329d3ca96708dd3a4ff59818/assets/js/anchorforid.js
function anchorForId(id) {
    const anchor = document.createElement("a");
    anchor.className = "header-link";
    anchor.title = "Link to this section";
    anchor.href = "#" + id;
    // Icon from https://useiconic.com/open#icons
    anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path d="M5.88.03c-.18.01-.36.03-.53.09-.27.1-.53.25-.75.47a.5.5 0 1 0 .69.69c.11-.11.24-.17.38-.22.35-.12.78-.07 1.06.22.39.39.39 1.04 0 1.44l-1.5 1.5c-.44.44-.8.48-1.06.47-.26-.01-.41-.13-.41-.13a.5.5 0 1 0-.5.88s.34.22.84.25c.5.03 1.2-.16 1.81-.78l1.5-1.5c.78-.78.78-2.04 0-2.81-.28-.28-.61-.45-.97-.53-.18-.04-.38-.04-.56-.03zm-2 2.31c-.5-.02-1.19.15-1.78.75l-1.5 1.5c-.78.78-.78 2.04 0 2.81.56.56 1.36.72 2.06.47.27-.1.53-.25.75-.47a.5.5 0 1 0-.69-.69c-.11.11-.24.17-.38.22-.35.12-.78.07-1.06-.22-.39-.39-.39-1.04 0-1.44l1.5-1.5c.4-.4.75-.45 1.03-.44.28.01.47.09.47.09a.5.5 0 1 0 .44-.88s-.34-.2-.84-.22z" /></svg>';
    return anchor;
}

function anchorizeHeadings() {
    // If we've found more than 1 article, then abort. It probably means I've
    // messed something up if this is the case, but I don't have enough
    // confidence in the way I've set everything up to _not_ do this safety
    // check.
    const articles = document.querySelectorAll('article#main');
    if (articles.length != 1) {
        return;
    }
    // Keep this list of header classes in sync with style.css
    const headers = articles[0].querySelectorAll('h2, h3, h4');
    Array.prototype.forEach.call(headers, function (el, i) {
        var link = anchorForId(el.id);
        el.appendChild(link);
    });
}

export default function anchorizeOnReady() {
    docReady(anchorizeHeadings);
}
