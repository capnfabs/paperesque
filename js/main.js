import anchorizeHeadings from "./anchorizeHeadings.js";
import enableFloatingFootnotes from "./floatingFootnotes.js";
import { docReady } from "./utils.js";

enableFloatingFootnotes();
anchorizeHeadings();

// automatically close dropdown links if the user scrolls
docReady(() => {
  const menu = document.getElementById('right-links-details');
  // if 'menu' is null it will fail noisily
  menu.addEventListener('toggle', (_event) => {
    if (menu.open) {
      document.addEventListener('scroll', (_event) => {
        menu.open = false;
      }, {once: true});
    }
  })

});
