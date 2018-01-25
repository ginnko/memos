1. object.prototype 指向null

2. 使用原型方式判断数组

   1. `arr.constructor == 'Array'`
   2. `Object.prototype.toString.call(arr) == '[Object, Array]'`

3. 队列是先进后出，以下代码为何时先进先出？

   ```
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

  //输出结果: 23554113
   ```
  - 原因([原文点击这里](https://www.jianshu.com/p/3ed992529cfc)):
    - v8实现中,macrotasks和microtasks两个队列中包含不同的任务:

      ````
      macrotasks: script(整体代码),setTimeout, setInterval, setImmediate, I/O, UI rendering
      microtasks: process.nextTick, Promises, Object.observe, MutationObserver

      ````

    - 执行过程如下：
        JavaScript引擎首先从macrotask queue中取出第一个任务，  
        执行完毕后，将microtask queue中的所有任务取出，按顺序全部执行；  
        然后再从macrotask queue中取下一个，  
        执行完毕后，再次将microtask queue中的全部取出；  
        循环往复，直到两个queue中的任务都取完。  

    - 解释：
        代码开始执行时，所有这些代码在macrotask queue中，取出来执行之。  
        后面遇到了setTimeout，又加入到macrotask queue中，  
        然后，遇到了promise.then，放入到了另一个队列microtask queue。  
        等整个execution context stack执行完后，  
        下一步该取的是microtask queue中的任务了。  
        因此promise.then的回调比setTimeout先执行。  





4. 关于一个使用递归创建函数的函数
````
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
````