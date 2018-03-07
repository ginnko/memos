
### 第一章 概述(2018.3.5)
- 变量定义:首先，变量自动变为一个被称作“活动对象”的内置对象的属性（如果是全局变量的话，就变为全局对象的属性）。第二，这个变量实际上也是“伪对象”，因为它有自己的属性（属性特性），用以表示变量是否可以被修改、删除或在for-in循环中枚举。

- 对象分类:
  - 本地对象:本地对象也可以被归类为内置对象（比如Array，Date）或自定义对象（var o = {}）。
  - 宿主对象: 宿主对象包含window和所有DOM对象。

### 第二章 高质量javascript基本要点(2018.3.5~2018.3.6)
- 避免全局变量的方法: 使用命名空间,立即执行函数.减少全局变量最有效的方法是坚持使用var来声明变量(解释:1.不声明而直接使用变量,这个变量就会成为全局变量;2.'隐式全局对象的概念':任何不通过var声明的变量都会成为全局对象的一个属性)

- 显式创建全局变量vs隐式创建全局变量
  - 通过var创建的全局变量(在任何函数体之外创建的变量)不能被删除;
  - 没有通过var创建的隐式全局变量(不考虑函数内的情况**what?!意思函数内创建的可以被删除**)可以被删除
  - *隐式全局变量不算是真正的变量,它们是全局对象的属性成员.属性可以通过delete运算符删除,变量不能被删除.***在浏览器环境中,全局变量实质都是window下的一个属性,故可以用delete删除,但在nodejs等非浏览器环境下,显式声明的全局变量无法用delete删除(nodejs也有全局对象?)**

- 访问全局对象(**通用的方法,可在多个平台上使用,在严格模式下无效!!!嘛哒!!!**)
```
var global = (function(){
  return this;
})();
```
上述代码可以在任意层次嵌套的函数作用域内执行,因为**在被当做函数执行的函数体内(而不是被当做构造函数执行的函数体内),this总是指向全局对象***这个解释真是好绕啊!!!!!!*

> 比如，如果你在开发一个库，你会将你的代码包装在一个立即执行的匿名函数中（在第四章会讲到），然后从全局作用域中给这个匿名函数传入一个指向this的参数。
> **上面这个在underscore中见过,嘻嘻~**

- 单var模式是最佳实践

-for循环
  - 缓存数组,类数组的length属性可以提高效率,特别是针对HTMLCollection对象
  - 从性能角度进行的优化
  ```
  var i, myarray = [];
  for (i = myarray.length; i--;) {
    // do something with myarray[i]
  }
  ```
>上述代码:1.减少了一个存储length的变量;2.减量循环至零,这种方式更快,因为和零比较要和非零数字或数组长度比较要高效的多

- for in循环
  用于**非数组对象**做遍历,也被称作枚举.  

for-in循环中属性的遍历顺序是不固定的,所以**普通数组使用for循环,对象使用for-in循环**

添加hasOwnProperty()的目的:**当你对当前要遍历的对象不确定的时候，添加hasOwnProperty()则更加保险些。**

  - 对象的hasOwnProperty()方法的使用写法:
    1. obj.hasOwnProperty()
    ```
    for (var i in man) {
      if (man.hasOwnProperty(i)) { // filter
        console.log(i, ":", man[i]);
      }
    }
    ```

    2. 通过Object.prototype直接调用hasOwnProperty()方法
    ```
    for (var i in man) {
      if (Object.prototype.hasOwnProperty.call(man, i)) { // filter
        console.log(i, ":", man[i]);
      }
    }
    ```
    >方法2的有点:当man对象中重新定义了hasOwnProperty方法时，可以避免调用时的命名冲突（译注：明确指定调用的是Object.prototype上的方法而不是实例对象中的方法），这种做法同样可以避免冗长的属性查找过程（译注：这种查找过程多是在原型链上进行查找），一直查找到Object中的方法.

  - 缓存hasOwnProperty():
      `var hasOwn = Object.prototype.hasOwnProperty;` **这个在underscore中有见过,嘻嘻~**
- switch模式
  该书对于case语句的连续执行给出的态度很有意思诶~
>避免连续执行多个case语句块（当省略break时会发生），如果你坚持认为连续执行多case语句块是最好的方法，请务必补充文档说明，对于其他人来说，这种情况看起来是错误的。

- 避免使用隐式类型转换
  方法:使用`===`以及`!==`

- 字符串转换为数字的三种方法
  1. 使用parseInt()
  2. +"08"
  3. Numnber("08)
>说明:后两种方法要比第一种快快,因为顾名思义parseInt()是一种“解析”而不是简单的“转换”。但当你期望将“08 hello”这类字符串转换为数字，则必须使用parseInt()，其他方法都会返回NaN。

- 使用parseInt()进行数字转换
  - 第二个表示基数的参数不能省略,避免'0809'(八月九号)这种字符串产生错误

- 规范
  **遵循规范比规范本身要重要**
  - 缩进
    - JSLint使用4个空格
    - ESLint使用2个空格?

  - 空格
    其他的推荐形式都已遵守,要增加一个:
    - **在函数,if-else语句,循环,对象直接量的左花括号之前补充空格**
    - **在右花括号和else和while之间补充空格**

  - 命名规范
    - 构造函数:使用'大驼峰':`MyConstructor()`
    - 普通函数:使用'小驼峰':`myFunction()`
    - 变量名:使用'小驼峰'
    - 常量:使用全部大写字母
    - 全局变量:使用全部大写字母
    - 私有变量:前面加下划线
- 注释需要对所有函数,它们的参数和返回值做补充注释,对于那些有趣的或是怪异的算法和技术也应当配备注释.

### 第三章 直接量和构造函数(2018.3.7~2018.3.7)
- 对象直接量语法
  - 对象内的属性或方法之间使用逗号分隔。最后一个名值对后也可以有逗号，但在IE下会报错，所以尽量不要在最后一个属性或方法后加逗号。

- 空对象
>JavaScript中根本不存在真正的空对象，理解这一点至关重要。即使最简单的{}对象包含从Object.prototype继承来的属性和方法。我们提到的“空（empty）对象”只是说这个对象没有自己的属性，不考虑它是否有继承来的属性。

- 使用对象直接量而不是new funciton(){}来创建对象的原因
  1. 使用对象直接量更简洁
  2. 对象直接量不需要作用域解析.
  >因为新创建的实例有可能包含了一个本地的构造函数，当你调用Object()的时候，解析器需要顺着作用域链从当前作用域开始查找，直到找到全局Object构造函数为止。(**这个有些不明白!!!**)

- 给原生构造函数传入参数

```
// an empty object
var o = new Object();
console.log(o.constructor === Object); // true

// a number object
var o = new Object(1);
console.log(o.constructor === Number); // true
console.log(o.toFixed(2)); // "1.00"

// a string object
var o = new Object("I am a string");
console.log(o.constructor === String); // true
// normal objects don't have a substring()
// method but string objects do
console.log(typeof o.substring); // "function"

// a boolean object
var o = new Object(true);
console.log(o.constructor === Boolean); // true
```
- 自定义构造函数
  当通过关键字new来调用这个构造函数时,函数体内将发生这些事情:
  1. 创建一个空对象,将它的引用赋给this,继承函数的原型;
    `// var this = Object.create(Person.prototype);`
  2. 通过this将属性和方法添加至这个对象;
  3. 最后返回this指向的新对象(如果没有手动返回其他对象).
    说明:构造函数中可以返回任意对象,只要返回的东西是对象即可.如果返回值不是对象(字符串,数字或布尔值),程序不会报错,但这个返回值会被忽略,最终还是返回this所指的对象.

- 强制使用new的模式
  下述代码是基于上面陈述的通过new关键字创建调用构造函数时,函数体内发生的三件事
```
function Waffle(){
  if(!(this instanceof Waffle)){
    return new Waffle();
  }
  this.tastes = 'yummy';
}
Waffle.prototype.wantAnother = true;
```
- 判断数组的方法
```
if(typeof Array.isArray === 'undefined'){
  Array.isArray = function(arg){
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}
```

- JSON
  - JSON.parese():解析JSON string为对象?**感觉不止对象**
  - JSON.stringify():可以将对象或数组(或任何原始值)转换为JSON字符串

- 正则表达式直接量
  - 一种不得不使用new RegExp()构造函数的情形:正则表达式不确定,直到运行时才能确定下来
  - 说明:即便参数相同,每次创建的RegExp对象都是不同的对象,因此在循环体中,多次创建的RegExp对象是不同的对象,它们并不共享属性!!!
  - 不带new调用RegExp()（作为普通的函数）和带new调用RegExp()是完全一样的。

- 原始值的包装对象
  js中5种原始类型:数字,字符串,布尔值,null,undefined.除了null,undefined之外,其他三种都有对应的包装对象,可以通过内置构造函数来生成包装对象

  包装对象带有一些有用的属性和方法，比如，数字对象就带有toFixed()和toExponential()之类的方法。字符串对象带有substring()、chatAt()和toLowerCase()等方法以及length属性。这些方法非常方便，和原始值相比，这让包装对象具备了一定优势。其实**原始值也可以调用这些方法，因为原始值会首先转换为一个临时对象，如果转换成功，则调用包装对象的方法。***这个可以说是相当方便了*

  当省略new时，包装器将传给它的参数转换为原始值：
  ```
  typeof Number(1); // "number"
  typeof Number("1"); // "number"
  typeof Number(new Number()); // "number"
  typeof String(1); // "string"
  typeof Boolean(1); // "boolean"
  ```
- Error对象
  name

  name属性是指创建这个对象的构造函数的名字，通常是“Errora”，有时会有特定的名字比如“RangeError”

  message

  创建这个对象时传入构造函数的字符串

  throw可以抛出任何对象，并不限于“错误对象”，因此你可以根据需要抛出自定义的对象。这些对象包含属性“name”和“message”或其他你希望传递给异常处理逻辑的信息，异常处理逻辑由catch语句指定。
  ```
  try {
    // something bad happened, throw an error
    throw {
      name: "MyErrorType", // custom error type
      message: "oops",
      extra: "This was rather embarrassing",
      remedy: genericErrorHandler // who should handle it
    };
  } catch (e) {
    // inform the user
    alert(e.message); // "oops"

    // gracefully handle the error
    e.remedy(); // calls genericErrorHandler()
  }
  ```
  **通过new调用和省略new调用错误构造函数是一模一样的，他们都返回相同的错误对象。**

  通常除了Date()构造函数之外，其他的内置构造函数并不常用，下面的表格中对这些构造函数以及它们的直接量语法做了整理。


| 内置构造函数（不推荐）                       | 直接量语法和原始值（推荐）                            |
| --------------------------------- | ---------------------------------------- |
| var o = new Object();             | var o = {};                              |
| var a = new Array();              | var a = [];                              |
| var re = new RegExp("[a-z]","g"); | var re = /[a-z]/g;                       |
| var s = new String();             | var s = "";                              |
| var n = new Number();             | var n = 0;                               |
| var b = new Boolean();            | var b = false;                           |
| throw new Error("uh-oh");         | throw { name: "Error",message: "uh-oh"};或者throw Error("uh-oh"); |


