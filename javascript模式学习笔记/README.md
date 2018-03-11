
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
  - 没有通过var隐式创建的”全局变量“在进入执行上下文第一阶段不会出现在VO（AO）中。

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
  这个要用起来~用起来啊~巴扎黑~
- for循环
  主要用于数组对象
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
  用于**非数组对象**做遍历,也被称作枚举.  （以后要多用这个！！！）

for-in循环中属性的**遍历顺序是不固定的**,所以**普通数组使用for循环,对象使用for-in循环**

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
    >方法2的优点:当man对象中重新定义了hasOwnProperty方法时，可以避免调用时的命名冲突（译注：明确指定调用的是Object.prototype上的方法而不是实例对象中的方法），这种做法同样可以避免冗长的属性查找过程（译注：这种查找过程多是在原型链上进行查找），一直查找到Object中的方法.

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
>说明:后两种方法要比第一种要快,因为顾名思义parseInt()是一种“解析”而不是简单的“转换”。但当你期望将“08 hello”这类字符串转换为数字，则必须使用parseInt()，其他方法都会返回NaN。

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


### 第四章 直接量和构造函数(2018.3.8~2018.3.8)
- javascript函数背景知识
  **一说到javascript函数,我们首先认为它是对象,它具有一个*可以执行*的特性,也就是说我们可以调用这个函数**=>这个就是函数和一般对象的不同点。
  - 主要特征: 
    1. **函数是一等对象**:
      1. 可以在程序执行时动态创建函数
      2. 可以将函数赋值给变量,可以将函数的引用拷贝至另一个变量,可以扩充函数,除了*某些特殊场景外*(**哪些特殊场景?**)均可被删除
      3. 可以将函数作为参数传入另一个函数,也可以被当作返回值返回
      4. 函数可以包含自己的属性和方法
    2. 函数提供作用域支持
      **函数提供函数作用域**

- 术语
  - 命名函数表达式vs匿名函数表达式
    命名函数表达式和匿名函数表达式唯一的区别是**函数对象的name属性**是否是一个空字符串.

  - 函数声明VS函数表达式
    多数情况下,函数声明和带命名的函数表达式在外观上没有多少不同,只是它们在函数执行时对上下文的影响有所区别,*好期待下面的详细讲解,嘻嘻~*

    **函数声明和命名函数表达式的主要区别----声明提前**

    **函数声明定义的函数不仅能让声明提前,还能让定义提前.**

    1. 在不能使用函数声明语法的场景下,只能使用函数表达式 
  - **不要使用函数直接量这个术语**

- 函数模式
  - 回调模式
  >当你给函数writeCode()传入一个函数参数introduceBugs()，在某个时刻writeCode()执行了（或调用了）introduceBugs()。在这种情况下，我们说introduceBugs()是一个“回调函数”，简称“回调”. 
  >[一个栗子](https://github.com/ginnko/javascript-patterns/blob/master/chapter4.markdown#%E4%B8%80%E4%B8%AA%E5%9B%9E%E8%B0%83%E7%9A%84%E4%BE%8B%E5%AD%90)

- 回调和作用域

>当你调用findNodes(myapp.paint)，运行结果和我们期望的不一致，因为this.color未定义。因为findNodes()是全局函数，this指向的是全局对象。如果findNodes()是dom对象的方法（类似dom.findNodes()），那么回调函数内的this则指向dom，而不是myapp。

**关于上述这段内容,还是有些不太理解,需要再看下那篇外国人写的关于this的讨论**

---

**此处穿插一段关于this的学习笔记，来源为下述链接，便于自己对本书中this的理解**
[关于执行上下文、变量对象、this的讨论-原文](http://dmitrysoshnikov.com/)  
[关于执行上下文-译文](http://www.cnblogs.com/justinw/archive/2010/04/16/1713086.html)  
[关于变量对象-译文](http://www.cnblogs.com/justinw/archive/2010/04/23/1718733.html)  
[关于this的讨论-译文](http://www.cnblogs.com/justinw/archive/2010/05/04/1727295.html)  
- 执行上下文
每当控制器转到js可执行代码时，即会进入到一个执行上下文。

**活动的执行上下文**在逻辑上组成一个**堆栈**。堆栈底部永远是全局上下文，堆栈顶部是当前执行上下文。堆栈在EC（执行上文）类型的变量被推入或弹出的同时被修改。**每次进入函数，即使函数被递归调用或作为构造函数使用，都会有一个对应的执行上下文被推入堆栈。**

执行上下文的代码被分成两个基本的阶段来处理：
  1. 进入执行上下文（**感觉这里的进入是调用函数的意思**）；
  2. 执行代码

- 变量对象
变量对象：简称**VO，是执行上下文的属性**，它存储下列内容（且按这个先后顺序）：
  1. 函数声明
  2. 函数形参
  3. 变量
变量对象的变化和上述执行上下文的两个阶段紧密相关。

  - 全局对象
    是在进入任何执行上文之前就已经创建的对象，这个对象只存在一份，它的属性在程序中任何地方都可以访问，全局对象的生命周期终止于程序退出的那一刻。

  - 函数上下文的变量对象
    在函数执行上下文中，VO是不能直接访问的，此时由激活对象（简称AO）扮演VO的角色。

    激活对象是在进入函数上下文时刻被创建的，它通过函数的arguments属性初始化。
  - 变量对象的变化
    - 进入执行上下文的变量对象
    ```
    function test(a, b) {
      var c = 10;
      function d() {}
      var e = function _e() {};
      (function x() {});
    }
    
    test(10); // call

    AO(test) = {
      a: 10,
      b: undefined,
      c: undefined,
      d: <reference to FunctionDeclaration "d">
      e: undefined
    };
    ```
    AO中不包含函数x，因为x是一个函数表达式而不是函数声明，函数表达式不会影响VO（AO）。未保存的函数表达式只有在它自己的定义或递归中才能被调用。x并不存在于AO/VO中。
    - 执行代码的变量对象
    上一阶段值为undefined的属性在这个阶段被赋值。
- this
  this是执行上下文的一个属性
  ```
  activeExecutionContext = {
    VO: {...},
    this: thisValue
  };
  ```
  - this在函数代码中的值
    - 函数的调用方式影响this的值
    - 引用类型
      - 用伪代码可以把引用类型表示为拥有两个属性的对象——base（即拥有属性的那个对象），和base中的propertyName 。
        ```
        var valueOfReferenceType = {
          base: <base object>,
          propertyName: <property name>
        };
        ```
      - 引用类型的值仅存在于两种情况中
        1. 处理一个标示符时----标识符是变量名，函数名，函数参数名和全局对象中未识别的属性名；
        2. 处理一个属性访问器
      - 在一个函数上下文中，this的值由调用者提供，且由调用函数的方式决定。如果调用括号左边是引用类型的值，this将设为这个引用类型值的base对象。其他情况设为null，隐式转换为全局对象。
---

[关于回调和this指向的说明](https://github.com/ginnko/javascript-patterns/blob/master/chapter4.markdown#%E5%9B%9E%E8%B0%83%E5%92%8C%E4%BD%9C%E7%94%A8%E5%9F%9F)

**上面这段说明完美解释了underscore中大量的context的使用,比如cb(),optimiseCb()两个函数**

另一种替代写法:其实还有一种替代写法，就是将函数当作字符串传入findNodes()，这样就不必再写一次对象了

  - 回调模式的典型应用
    1. 异步事件监听

    回调模式能够让程序“异步”执行，换句话说，就是让程序不按顺序执行。
    **其实不太理解异步的意思...**

    2. 超时
      setTimeout()和setInterval()两个函数

    **传入的回调函数不能带括号,带括号会立即执行,不带括号传入的是一个变量是对函数的引用**,以便在超时函数的逻辑中调用到它.

    3. 库中的回调
    >回调模式非常简单，但又很强大。可以随手拈来灵活运用，因此这种模式在库的设计中也非常得宠。库的代码要尽可能的保持通用和重用，而回调模式则可帮助库的作者完成这个目标。你不必预料和实现你所想到的所有情形，因为这会让库变的膨胀而臃肿，而且大多数用户并不需要这些多余的特性支持。相反，你将精力放在核心功能的实现上，提供回调的入口作为“钩子”，可以让库的方法变得可扩展、可定制。
    >**哇擦!!!underscore就是个栗子啊!!!**

- 返回函数
  **闭包啦!!!在underscore中也有大量的使用诶!!!holy shit!**

- 自定义函数

[函数是个对象!将它赋给一个变量,然后给这个变量添加属性.但如果重新给这个变量赋了新的函数,也就是新的变量,那么怎么可能使用变量点属性名的形式访问到那个添加的属性?!对象都不一样了!!!!!牢记函数是个对象!!!!!!!](https://github.com/ginnko/javascript-patterns/blob/master/chapter4.markdown#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%87%BD%E6%95%B0)

- 立即执行函数模式
  - 立即执行函数的写法,JSLint推荐写法1:
    1. 写法1
    ```
    (function () {
      alert('watch out!');
    }());
    ```
    2. 写法2
    ```
    (function () {
      alert('watch out!');
    })();
    ```

  >这种模式很有用，它为我们提供一个作用域的沙箱，可以在执行一些初始化代码的时候使用。设想这样的场景：当页面加载的时候，你需要运行一些代码，比如绑定事件、创建对象等等。所有的这些代码都只需要运行一次，所以没有必要创建一个带有名字的函数。但是这些代码需要一些临时变量，而这些变量在初始化完之后又不会再次用到。显然，把这些变量作为全局变量声明是不合适的。正因为如此，我们才需要立即执行的函数。它可以把你所有的代码包裹到一个作用域里面，而不会暴露任何变量到全局作用域中

  - 注意:
    1. 会把全局对象当作一个参数传给立即执行的函数，以保证在函数内部也可以访问到全局对象，而不是使用window对象，这样可以使得代码在非浏览器环境中使用时更具可移植性。
    2. 一般情况下尽量不要给立即执行的函数传入太多的参数，否则会有一件麻烦的事情，就是你在阅读代码的时候需要频繁地上下滚动代码。

- 立即初始化对象
  - 下面两种语法都是有效的:
    ```
    ({...}).init();
    ({...}.init());
    ```
  - 这种模式主要用于一些一次性的工作，并且在init()方法执行完后就无法再次访问到这个对象。如果希望在这些工作完成后保持对对象的引用，只需要简单地在init()的末尾加上return this;即可。

- 条件初始化
  环境不改变时只初始化一次

- 函数属性
  - 对一个函数来说,不管用什么语法创建,它会自动拥有一个length属性来标识这个函数期待接受的参数个数
  ```
  function func(a, b, c) {}
  console.log(func.length); // 3
  ```
  - Memoization模式
    注意!!!下述代码在myFunc函数体中直接使用了myFunc
  ```
  var myFunc = function () {

    var cachekey = JSON.stringify(Array.prototype.slice.call(arguments)),
      result;

    if (!myFunc.cache[cachekey]) {
      result = {};
      // ... expensive operation ...
      myFunc.cache[cachekey] = result;
    }
    return myFunc.cache[cachekey];
  };

  // cache storage
  myFunc.cache = {};
  ```
- 配置对象模式
>举些实例，这个模式对创建DOM元素的函数或者是给元素设定CSS样式的函数会非常实用，因为元素和CSS样式可能会有很多但是大部分可选的属性。

- 函数柯里化
  - 公式
  ```
    function schonfinkelize(fn) {
    var slice = Array.prototype.slice,
    stored_args = slice.call(arguments, 1);
    return function () {
      var new_args = slice.call(arguments),
      args = stored_args.concat(new_args);
      return fn.apply(null, args);
    };
  }
  ```
  上述代码中`fn.apply(null, args);`这行代码的使用真是极好的,这本书现在上面介绍了函数的应用,真是循序渐进,感觉这次看这本书不是过眼云烟,貌似看进去了些,好书!!!

  - 这句话说的好!函数调用实际是在处理参数,就是上面合并新旧参数的过程.(哇擦~两天过去了已然忘记当时的意境，体会不出这句的精妙了，呜呜呜~)

- 第四章小结
```
介绍了一些有用的模式，按分类列出：

    API模式，它们帮助我们为函数给出更干净的接口，包括：

        回调模式

        传入一个函数作为参数

        配置对象

         帮助保持函数的参数数量可控

        返回函数

         函数的返回值是另一个函数

        柯里化

         新函数在已有函数的基础上再加上一部分参数构成

    初始化模式，这些模式帮助我们用一种干净的、结构化的方法来做一些初始化工作（在web页面和应用中非常常见），通过一些临时变量来保证不污染全局命名空间。这些模式包括：

        立即执行的函数

         当它们被定义后立即执行

        立即初始化的对象

         初始化工作被放入一个匿名对象，这个对象提供一个可以立即被执行的方法

        条件初始化

         使分支代码只在初始化的时候执行一次，而不是在整个程序生命周期中反复执行

    性能模式，这些模式帮助提高代码的执行速度，包括：

        Memoization

         利用函数的属性，使已经计算过的值不用再次计算

        自定义函数

         重写自身的函数体，使第二次及后续的调用做更少的工作

```
