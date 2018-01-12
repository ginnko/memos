1. object.prototype 指向null

2. 使用原型方式判断数组

   1. `arr.constructor == 'Array'`
   2. `Object.prototype.toString.call(arr) == '[Object, Array]'`

3. 队列是先进后出，以下代码为何时先进先出？

   ```
   setTimeout(function(){
     console.log(1);
   }, 0);

   setTimeout(function(){
     console.log(2);
   }, 0);

   console.log(3);
   //输出顺序是 3， 1， 2
   ```

4. 关于一个使用递归创建函数的函数