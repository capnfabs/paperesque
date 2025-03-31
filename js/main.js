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

// change the theme color based on whether the navbar is visible or not
// (and therefore the fill around the dynamic island on iOS)
docReady(() => {
  const nav = document.querySelector(".navbar nav");
  const metaTagLight = document.querySelector('meta[name="theme-color"][data-tag=light]');
  const metaTagDark = document.querySelector('meta[name="theme-color"][data-tag=dark]');

  // the background color is different based on screen size for certain combinations of CSS classes
  const floatingSheetBreakpoint = window.matchMedia('(min-width: 720px)');

  let isNavbarVisible = true;
  const updateThemeColors = () => {
    if (isNavbarVisible) {
      metaTagLight.setAttribute('content', '#00223E');
      metaTagDark.setAttribute('content', '#08151E');
    } else {
      const bodyIsFullscreenSheet = document.body.classList.contains('look-sheet-bkg') && !floatingSheetBreakpoint.matches;
      if (bodyIsFullscreenSheet) {
        metaTagLight.setAttribute('content', '#ffffff');
      } else {
        metaTagLight.setAttribute('content', '#fffdf7');
      }
      // this is the same color regardless of sheet / no sheet
      metaTagDark.setAttribute('content', '#17232D');
    }
  }

  const observer = new IntersectionObserver((entries, _observer) => {
    isNavbarVisible = entries[0].isIntersecting;
    updateThemeColors();
  }, {
    root: null,
    rootMargin: "0px",
    threshold: [0],
  });
  observer.observe(nav);
  floatingSheetBreakpoint.addEventListener('change', () => {
    updateThemeColors();
  });
});
