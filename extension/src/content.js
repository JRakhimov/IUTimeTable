chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request === "getSVG") {
    const svg = document.getElementsByClassName("print-sheet")[0];
    if (svg) {
      const svgData = svg.children[0].outerHTML;

      sendResponse(svgData);
    } else {
      sendResponse(null);
    }
  }
});
