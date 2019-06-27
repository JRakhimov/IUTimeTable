import { parse } from 'svg-parser';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request === 'getSVG') {
    const svg = document.getElementsByClassName('print-sheet')[0];
    if (svg) {
      const parsedSVG = parse(svg.children[0].outerHTML);

      const toSend = {
        isTeacher: parsedSVG.children[1].children[0].children[0].split(' ')[0] === 'Teacher',
        parsedSVG
      };

      sendResponse(toSend);
    } else {
      sendResponse(false);
    }
  }
});
