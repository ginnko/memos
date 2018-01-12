/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Ctrl+R),
 * 2. Inspect to bring up an Object Inspector on the result (Ctrl+I), or,
 * 3. Display to insert the result in a comment after the selection. (Ctrl+L)
 */

function factorial(num){
  if(num == 1){
    return 1;
  }
  else if(num > 1){
    return num * factorial(num - 1);
  }
}



function memory(){
  var result = {};
  return function(num){
    if(num in result){
      return result[num];
    }else{
      result[num] = factorial(num);
      return result[num];
    }
  }
}

var test = memory();
console.log(test(10));