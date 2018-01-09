/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */

function getScrollOffsets(w){
  var w = w || window;
  if(w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset};
  var d = w.docuemnt;
  if(docuemnt.compatMode == "CSS1Compat") return {x: d.documentElement.scrollLeft, y: d.docuemntElement.scrollTop};
  return {x: d.body.scrollLeft, y: d.body.scrollTop};
}

var result = getScrollOffsets();
console.log(result);