### 第一章 introducing functional javascript

面向对象编程趋于将问题分解成对象(名词)的集合;
函数式编程趋于将问题分解成函数(动词)的集合.

函数式编程的感觉就是在传递数据.

- 封装
  是指面向对象编程中,将一段能够操纵数据的代码打包在一起
- 闭包
  在js中,数据的隐藏通过闭包的来实现
  下面这个是啥意思,闭包是各种函数?
  > Closures are not covered in any depth until Chapter 3, but for now you should keep in mind that closures are kinds of functions.

- 函数作为comparator
  js中的sort()函数, 不提供任何参数的情况下,默认是从小到大排序,使用**字符串**比较.

  提供函数(comparator)的情况下,返回-1表示地一个数小于第二个数,返回1表示第一个数大于第二个数,返回0表示两个数相等.

- 函数作为predicates
  predicates: 永远返回布尔值的函数

  ```
  function comparator(pred){
    return function(x, y){
      if(truthy(pred(x, y))){
        return -1;
      } else if(truthy(pred(y, x))) {
        return 1;
      } else {
        return 0;
      }
    };
  }
  ```
  上述函数 comparator()是一个高阶函数,它接受一个函数作为参数然后返回一个函数.  
  它的作用是将pred函数(返回布尔值的比如lessThan,greaterThan之类的比较函数)转换成返回-1, 0, 1形式的函数.  
  pred函数能够独立发挥作用.  
  使用comparator转换的目的是为了能在sort中使用.

- data as abstraction