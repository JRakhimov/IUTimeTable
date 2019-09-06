chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === "getSVG") {
    const isEdupagePage = window.location.host === "iut.edupage.org";
    const [svg] = document.getElementsByClassName("print-sheet");

    if (svg) {
      sendResponse({ isEdupagePage, svg: svg.children[0].outerHTML });
    } else {
      sendResponse({ isEdupagePage });
    }
  }
});
