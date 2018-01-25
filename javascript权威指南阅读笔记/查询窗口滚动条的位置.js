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
console.table(result);




/*=======================================================*/ 

setTimeout(function () {
  console.log(1);
}, 0);

new Promise(function executor(resolve) {
  console.log(2);
  for (var i = 0; i < 10000; i++) {
    i == 9999 && resolve();
  }
  console.log(3);
}).then(function () {
  console.log(4);
});

console.log(5);

setTimeout(function () {
  console.log(1);
}, 0);

setTimeout(function () {
  console.log(3);
}, 0);

console.log(5);

/*==================================================*/

var memoizer = function(memo, formula) {
  var recur = function(n) {
    var result = memo[n];
    if (typeof result !== 'number') {
      result = formula(recur, n);
      memo[n] = result;
    }

    return result;
  }

  return recur;
}

var fibon = memoizer([0, 1], function(recur, n) {
  return recur(n - 1) + recur(n - 2);
});

var fact = memoizer([1, 1], function(recur, n) {
  return n * recur(n - 1);
});