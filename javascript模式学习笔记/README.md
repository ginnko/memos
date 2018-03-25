
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
    **说明:构造函数中可以返回任意对象,只要返回的东西是对象即可.如果返回值不是对象(字符串,数字或布尔值),程序不会报错,但这个返回值会被忽略,最终还是返回this所指的对象.**

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

### 第五章 对象创建模式(2018.3.12~2018.3.14)

- 命名空间模式
  为了避免产生全局污染,可以为应用或者类库创建一个全局对象,然后将所有功能都添加到这个对象上.
  - 命名空间的缺点:
    1. 代码量稍有增加,每个函数和变量前增加了这个命名空间对象的前缀,会增加代码量,增大文件大小;
    2. 该全局实例可以被随时修改;(这个不太明白...)
    3. 命名的深度嵌套会减慢属性值的查询
  - 通用命名空间函数
  ```
  var MYAPP = MYAPP || {};
  MYAPP.namespace = function(ns_string){
    var parts = ns_string.split('.'),
        parent = MYAPP,
        i;
    if(parts[0] === 'MYAPP'){
      parts = parts.slice(1);
    }
    for(i = 0; i < parts.length; i += 1){
      if(typeof parent[parts[i]] === 'undefined'){
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;
  };
  //使用
  MYAPP.namespace('modules.module51');
  MYAPP.namespace('once.upon.a.time.there.was.this.long.nested.property');
  ```
  - 声明依赖
    - 声明就是创建一个本地变量,指向需要用到的模块,比如下述代码:
    ```
    var myFunction = function () {
      // dependencies
      var event = YAHOO.util.Event,
        dom = YAHOO.util.Dom;

      // use event and dom variables
      // for the rest of the function...
    };
    ```
    - 好处
      1. 明确依赖;
      2. 将声明放在顶部容易被查找和解析;
      3. 本地变量用于会比全局变量要快,甚至比全局变量的属性还要快.使用了依赖声明模式之后，全局变量的解析在函数中只会进行一次，在此之后将会使用更快的本地变量。
  - 私有属性和方法
    - 私有成员
    通过闭包来实现.在构造函数中创建一个闭包,任何在这个闭包中的部分都不会暴露到构造函数之外,如下代码:
    ```
    function Gadget() {
      // private member
      var name = 'iPod';
      // public function
      this.getName = function () {
        return name;
      };
    }
    var toy = new Gadget();

    // `name` is undefined, it's private
    console.log(toy.name); // undefined
    // public method has access to `name`
    console.log(toy.getName()); // "iPod"
    ```
    **在js中创建私有成员很容易,只需要将私有成员放在一个函数中,保证它是函数的本地变量,也就是说让它在函数之外不可以被访问.**
    - 特权方法
      - 定义: 特权方法的概念不涉及任何语法,只是给一个可以访问到私有成员的公有方法的名字
      - 应用: 上述栗子中getName()就是特权方法,因为它有能访问到name属性的特殊权限
      - 问题: 如果返回的私有成员是对象,由于返回的是引用,会导致从外部可以修改这个私有成员
      - 解决办法: 最低授权原则(POLA),永远不要给出比需求更多的东西
      - 另一种解决办法: 使用通用的对象赋值函数创建这个私有成员(对象类型)的一个副本.两个这样的函数——一个叫extend()，它会浅复制一个给定的对象（只复制顶层的成员）。另一个叫extendDeep()，它会做深复制，遍历所有的属性和嵌套的属性。(**underscore中这两个函数都有用到诶**)
  - 使用对象字面量创建私有成员
    - 原理:  使用一个立即执行的匿名函数创建的闭包。
    - 方式1:
      ```
      var myobj; // this will be the object
      (function () {
        // private members
        var name = "my, oh my";

        // implement the public part
        // note -- no `var`
        myobj = {
          // privileged method
          getName: function () {
            return name;
          }
        };
      }());

      myobj.getName(); // "my, oh my"
      ```
    - 方式2:
      ```
      //类似模块模式
      var myobj = (function () {
        // private members
        var name = "my, oh my";

        // implement the public part
        return {
          getName: function () {
            return name;
          }
        };
      }());

      myobj.getName(); // "my, oh my"
      ```
  - 原型和私有成员
    结合上述两种创建私有成员的方法,将共同的私有成员在原型对象中创建

  - 暴露模式
    将私有函数暴露为公有的方法.具体做法是将直接定义在返回对象属性中的函数移到闭包中,将函数表达式赋值给一个变量,让这个变量成为返回对象的某个属性值,这样即使对这个对象的属性做了修改也不会殃及对象闭包中的函数.


  - 模块模式
    模块模式是上述集中模式的组合
  
  - 创建构造函数的模块
  ```
  MYAPP.namespace('MYAPP.utilities.Array');

  MYAPP.utilities.Array = (function () {

      // dependencies
    var uobj = MYAPP.utilities.object,
      ulang = MYAPP.utilities.lang,

      // private properties and methods...
      Constr;

      // end var

      // optionally one-time init procedures
      // ...

      // public API -- constructor
      Constr = function (o) {
        this.elements = this.toArray(o);
      };
      // public API -- prototype
      Constr.prototype = {
        constructor: MYAPP.utilities.Array,//constructor只是原型对象的一个属性
        version: "2.0",
        toArray: function (obj) {
          for (var i = 0, a = [], len = obj.length; i < len; i += 1) {
            a[i] = obj[i];
          }
          return a;
        }
      };
    
    return Constr;
    // return the constructor
    // to be assigned to the new namespace return Constr;

  }());

  //使用
  var arr = new MYAPP.utilities.Array(obj);
  ```
  - 在模块中引入全局上下文
  通常会传递全局变量甚至是全局对象本身。引入全局上下文可以加快函数内部的全局变量的解析，因为引入之后会作为函数的本地变量.**这个感觉和underscore中的不太一样,感觉underscore只是利用了立即执行函数创建独立作用域的特性,又感觉很相似...**
  ```
  MYAPP.utilities.module = (function (app, global) {

    // references to the global object
    // and to the global app namespace object
    // are now localized
    
  }(MYAPP, this));
  ```
  - 沙箱模式
  ---

  **沙箱模式暂且搁置**
  沙箱模式为模块提供了一个环境,模块在这个环境中的任何行为都不会影响到其他的模块和其他模块的沙箱.
    - 沙箱模式的主要目的是解决命名空间模式的短处: 
      1. 依赖一个全局变量成为应用的全局命名空间。在命名空间模式中，没有办法在同一个页面中运行同一个应用或者类库的不同版本，在为它们都会需要同一个全局变量名，比如MYAPP。
      2. 代码中以点分隔的名字比较长，无论写代码还是解析都需要处理这个很长的名字，比如MYAPP.utilities.array。
    - 在沙箱模式中,唯一的全局变量是一个构造函数,命名为Sandbox()
  **沙箱模式暂且搁置**
  ---
  - 静态成员
  在javascript中没有专门用于静态成员的语法,但是通过给构造函数添加属性的方法,可以拥有和基于类的语言一样的使用语法.之所以可以这样做是因为构造函数和其他的函数一样,也是对象,也可以拥有属性.
  - 静态方法
    定义为构造函数的属性的函数即可成为构造函数的静态方法
  - 公有静态成员，即可以在不实例化类的情况下使用。
  - 私有静态成员
    1. 被所有由同一构造函数创建的对象共享
    2. 不允许在构造函数外部访问
  - 对象常量
  - 链式调用模式
    **underscore中有用到这个,promise也可以使用这个诶**
    当你创建了一个没有有意义的返回值的方法时，你可以让它返回this，也就是这些方法所属的对象。这使得对象的使用者可以将下一个方法的调用和前一次调用链起来
    ```
    var obj = {
      value: 1,
      increment: function () {
        this.value += 1;
        return this;
      },
      add: function (v) {
        this.value += v;
        return this;
      },
      shout: function () {
        alert(this.value);
      }
    };
    ```
    - 弊端
    一个弊端是调用这样写的代码会更困难。你可能知道一个错误出现在某一行，但这一行要做很多的事情。当链式调用的方法中的某一个出现问题而又没报错时，你无法知晓到底是哪一个出问题了。
  - method()方法


### 第六章 代码复用模式(2018.3.14~2018.3.17)

- 类式继承 && 现代继承模式
  现代继承模式是指那些不需要你去想类这个概念的模式
  - 类式继承
    1. 默认模式
    属性和方法均可通过原型链访问
    ```
    //parent构造函数
    function Parent(name) {
      this.name = name || 'Adam';
    }

    //给原型增加方法
    Parent.prototype.say = function () {
      return this.name;
    };

    //空的child构造函数
    function Child(name) {}

    //继承
    inherit(Child, Parent);

    function inherit(C, P) {
      C.prototype = new P();
    }
    ```
    - 一个在构造函数上常用的规则是,用于复用的成员(属性和方法)应该被添加到原型上.
    - 缺点:
      1. 继承了父对象自己的属性,这些属性可能不需要复用
      2. 在使用inherit()函数时另外一个不便是它不能够让你传参数给子构造函数,这些参数有可能是想再传给父构造函数.
    - 借用构造函数
      ```
      function Child(a, c, b, d) {
        Parent.apply(this, arguments);
      }
      ```
      比较传统类式继承和借用构造函数继承
      ```
      //父构造函数
      function Article() {
        this.tags = ['js', 'css'];
      }
      var article = new Article();

      //BlogPost通过类式继承1（默认模式）从article继承
      function BlogPost() {}
      BlogPost.prototype = article;
      var blog = new BlogPost();
      //注意你不需要使用`new Article()`，因为已经有一个实例了

      //StaticPage通过借用构造函数的方式从Article继承
      function StaticPage() {
        Article.call(this);
      }
      var page = new StaticPage();

      alert(article.hasOwnProperty('tags')); // true
      alert(blog.hasOwnProperty('tags')); // false
      alert(page.hasOwnProperty('tags')); // true
      ```
      **注意上面的hasOwnProperty方法,之前的认识认为这个方法只能用来区分自定义方法和原生自定义的方法(原型链上的),其实人家对于方法和属性均可以使用,且对于自定义的原型链也是适用的!!!**
      **其实对上面那个`Artical.call(this)`不太明白为啥是复制,肯定不是引用就对了,它也没有返回值,只是位于一个函数的作用域中,不过是把this的指向给锁定了**

### 第七章 设计模式(2018.3.22~2018.3.25)

- 单例
  单例模式的核心思想是让制指定的类只存在唯一一个实例.这意味着当你第二次使用相同的类去创建对象的时候,你得到的应该和第一次创建的是同一个对象.

  在js中,没有类,只有对象.当你创建一个对象时,事实上根本没有另一个对象和它一样,这个对象其实已经是一个单例.使用对象字面量创建一个简单的对象也是一种单例的例子.

  **有的时候,当人们在js中提出单例的时候,它们可能实在指第五章讨论过的模块模式,这个要返回去再看一下...不记得了...**

- 使用new
  在javascript中使用new语法实现单例:缓存实例.
  - 方法1:将实例放到静态属性中
    ```
    function Universe(){
      if(typeof Universe.instance === "object"){
        return Universe.instance;
      }
      this.stacrt_time = 0;
      this.bang = "Big";
      Universe.instance = this;
      return this;
    }

    var uni = new Universe();
    var uni2 = new Universe();
    uni === uni2;//true
    ```
    上面这个例子中,函数的属性可以直接在函数中操作,把函数视为对象就好理解了.
    *这种模式的缺陷,instance属性可以从外部被修改*
  - 方法2:将实例放到闭包中
    ```
    function Universe(){
      var instance = this;
      this.start_time = 0;
      this.bang = "Big";
      Universe = function(){
        return instance;
      };
    }
    ```
    说明:第一次调用时,原始的构造函数调用并且正常返回this.在后续的调用中,被重写的构造函数被调用.被重写的这个构造函数可以通过闭包访问私有的instance变量并且将它返回.

    这种模式的缺点是被重写的函数将丢失那些在**初始定义**和**重新定义**之间添加的属性.在这个列子中任何添加到Universe()原型上的属性将不会被链接到使用原来的实现创建的实例上.(这里的原来的实现是指实例由未被重写的构造函数创建的,而Universe()则是被重写的构造函数.)

    使用下述代码实例化Universe()构造函数的结果如下,这证明了上述说明
    ```
    // adding to the prototype
    Universe.prototype.nothing = true;

    var uni = new Universe();

    // again adding to the prototype
    // after the initial object is created
    Universe.prototype.everything = true;

    var uni2 = new Universe();

    Testing:
    // only the original prototype was
    // linked to the objects
    uni.nothing; // true
    uni2.nothing; // true
    uni.everything; // undefined
    uni2.everything; // undefined

    // that sounds right:
    uni.constructor.name; // "Universe"

    // but that's odd:
    uni.constructor === Universe; // false
    ```
    另一个示例,这个示例会修改实例的构造函数为重写的函数
    ```
    function Universe() {

      // the cached instance
      var instance;
      //此处instance为undefined
      
      // rewrite the constructor
      Universe = function Universe() {
      //此处instance为undefined
        return instance;
      };
      
      // carry over the prototype properties
      Universe.prototype = this;
      //此处重写了重写后的Universe函数的原型对象为重写前的Universe函数new调用时创建的对象
      
      // the instance
      instance = new Universe();
      //由于上面instance为undefined,js规定当构造函数的返回值不是对象的时候,会默认返回this指向的对象,也就是重写后的Universe函数通过new调用时创建的空对象.
      
      // reset the constructor pointer
      instance.constructor = Universe;
      //由于constructor属性是定义在对象原型上的,对象本身没有这个属性,通过原型链查找到这个属性,由于上面Universe.prototype = this;这个操作,顺着原型链找到的constructor属性指向的是修改前的Universe函数,所以此处要改成重写后的Universe函数
      
      // all the functionality
      instance.start_time = 0;
      instance.bang = "Big";
      
      return instance;
    }
  - 另一种解决办法
    ```
    var Universe;
    (function(){
      var instance;
      Universe = function Universe(){
        if(instance){
          return instance;
        }
        instance = this;
        this.start_time = 0;
        this.bang = "Big";
      };
    }());
    ```
    将构造函数和实例包在一个立即执行函数中,当构造函数第一次被调用时,它返回一个对象并将私有的instance指向它.
    **这种方法不会重写构造函数,感觉简单好多啊**

    **可问题是单例有个鸡鸡用?!**

- 工厂模式
  使用**工厂模式的目的就是创建对象**.它通常被在类或者类的静态方法中实现(**擦的,静态方法已经不是什么jiba玩意了**)

  一个工厂模式的示例实现
  ```
  function CarMaker(){}

  CarMaker.prototype.drive = function(){
    return "Vroom, I have " + this.doors + " doors";
  };

  CarMaker.factory = function(type){
    var constr = type,
      newcar;
      <!-- 功能1 -->
      //检查属性构造函数是否存在
    if(typeof CarMaker[constr] !== "function"){
      throw(
        name: "Error",
        message: constr + " doesn't exist"
      );
    }
    <!-- 功能2 -->
    //属性构造函数的原型是否继承了CarMaker构造函数原型的方法
    if(typeof CarMaker[constr].prototype.drive !== "function"){
      CarMaker[constr].prototype = new CarMaker();//父类的实例是子类的原型
    }
    <!-- 功能3 -->
    //使用属性构造函数创建对象
    newcar = new CarMaker[constr]();
    return newcar;
  };
  CarMaker.Compact = function(){
    this.doors = 4;
  };
  CarMaker.Convertible = function(){
    this.doors = 2;
  };
  CarMaker.SUV = function(){
    this.doors = 24;
  };
  ```
  内置对象工厂
  内置的全局构造函数Object()会根据不同的输入创建不同的对象,如果传入一个数字,它会使用Number()构造函数创建一个对象,在传入字符串和布尔值的时候也会发生同样的事情.

- 迭代器模式
  在迭代器模式中,你的对象需要提供一个next()方法.按顺序调用next()方法必须放回序列中的下一个元素,但是"下一个"在你的特定的数据结构中指什么由你自己来决定.

  在迭代器模式中，聚合对象通常也会提供一个方便的方法hasNext()，这样对象的使用者就可以知道他们已经获取到你数据的最后一个元素。

- 装饰器模式
  在装饰器模式中,一些额外的功能可以在运行时被动态地添加到一个对象中.装饰器模式的一个很方便的特性是可以对我们需要的特性进行定制和配置.刚开始时,我们有一个拥有基本功能的对象,然后可以从可用的装饰器中去挑选一些需要用到的去增加这个对象,甚至如果顺序很重要的话,还可以制定增强的顺序.

  - 装饰器实现
    - 方法1： 基于原型链
    ```
    function Sale(price){
      this.price = price || 100;
    }
    Sale.prototype.getPrice = function(){
      return this.price;
    };

    //装饰器对象都将被作为构造函数的属性实现
    Sale.decorators = {};

    Sale.decorators.fedtax = {
      getPrice: function(){
        var price = this.uber.getPrice();//从父对象中取值？这是从哪里看到的？
        price += price * 5 / 100;
        return price;
      }
    };

    Sale.decorators.quebec = {
      getPrice: function(){
        var price = this.uber.getPrice();
        price += price * 7.5 / 100;
        return price;
      }
    };

    Sale.decorators.money = {
      getPrice: function(){
        return "$" + this.uber.getPrice().toFixed(2);
      }
    };

    Sale.decorators.cdn = {
      getPrice: function(){
        return "CDN$" + this.uber.getPrice().toFixed(2);
      }
    };

    //神奇方法decorate()
    Sale.prototype.decorate = function(decorator){
      var F = function(){},
        overrides = this.constructor.decorators[decorator],
        i, newobj;
      <!-- =========================== -->
      //这三行代码是实现的关键啊！！！
      F.prototype = this;
      newobj = new F();
      newobj.uber = F.prototype;
      <!-- =========================== -->
      for (i in overrides){
        if (overrides.hasOwnProperty(i)){
          newobj[i] = overrides[i];
        }
      }
      return newobj;
    };

    //使用
    var sale = new Sale(100);
    sale = sale.decorate('fedtax');
    sale = sale.decorate('cdn');
    sale.getPrice();
    ```

    - 方法2： 使用列表实现
    ```
    function Sale(price){
      this.price = (price > 0) || 100;
      this.decorators_list = [];
    }

    Sale.decorators = {};

    Sale.decorators.fedtax = {
      getPrice: function(price){
        return price + price * 5 / 100;
      }
    };

    Sale.decorators.quebec = {
      gePrice: function(price){
        return price + price * 7.5 / 100;
      }
    };

    Sale.decorators.money = {
      getPrice: function(price){
        return "$" + price.toFixed(2);
      }
    };

    Sale.prototype.decorate = function(decorator){
      this.decorators_list.push(decorator);
    };

    Sale.prototype.getPrice = function(){
      var price = this.price,
        i,
        max = this.decorators_list.length,
        name;
      for(i = 0; i < max; i += 1){
        name = this.decorators_list[i];
        price = Sale.decorators[name].getPrice(price);
      }
      return price;
    };

    //使用
    var sale = new Sale(100);
    sale = sale.decorate('fedtax');
    sale = sale.decorate('cdn');
    sale.getPrice();
    ```
    方法2要简单好多啊！！！原型链理解起来真不容易，真是乱的一匹。

- 策略模式
  策略模式允许在运行的时候选择算法。你的代码使用者可以在处理特定任务的时候根据即将要做的事情的上下文从一些可用的算法中选择一个。

  使用策略模式的一个例子是解决表单验证的问题。你可以创建一个validator对象，有一个validate（）方法。这个方法被调用时不用区分具体的表单类型，它总是会返回同样的结果----一个没有通过验证的列表和错误信息。

  但是根据具体的需要验证的表单和数据，你的代码的使用者可以选择进行不同类别的检查。你的validator选择最佳的策略来处理这个任务，然后将具体的数据检查工作交给合适的算法去做。

  假设你不要姓， 名字可以接受任何内容，但要求年龄是一个数字，并且用户名只允许包含字母和数字，可用的配置：

  ```
    validator.config = {
      first_name: 'isNonEmpty',
      age: 'isNumber',
      username: 'isAlphaNum'
    };

    //调用validate（）方法，然后将任何验证错误打印到控制台上

    validator.validate(data);
    if(validator.hasErrors()){
      console.log(validator.messages.join("\n"));
    }
  ```
  - validator的实现
    这个实现的写法真是前所未见，还是看的太少。在核心对象中定义好属性，然后在对象外使用这些属性进行扩充。这是为了分割代码？看起来更清楚？
    ```
    validator.types.isNonEmpty = {
      validate: function(value){
        return value !== "";
      },
      instructions: "the value cannot be empty"
    };

    validator.types.isNumber = {
      validate: function(value){
        return !isNaN(value);
      },
      instructions: "the value can only be a valid number, e.g. 1, 3.14 or 2010"
    };

    validator.types.isAlphaNum = {
      validate: function(value){
        return !/[^a-z0-9]/i.test(value);
      },
      instructions: "the value can only contain characters and numbers, no special symbols"
    };

    //validator对象的核心实现

    var validator = {
      types: {},
      messages: [],
      config: {},
      validate: function(data){
        var i, msg, type, checker, result_ok;
        this.messages = [];
        for(i in data){
          if(data.hasOwnProperty(i)){
            type = this.config[i],
            checker = this.types[type];
            if(!type){
              continue;
            }
            if(!checker){
              throw {
                name: "ValidationError",
                message: "No handler to validate type " + type
              };
            }

            result_ok = checker.validate(data[i]);
            if(!result_ok){
              msg = "Invalid vale for *" + i + "*, " + checker.instructions;
            }
          }
        }
        return this.hasErrors();
      },
      hasErrors: function(){
        return this.messages.length !== 0;
      }
    };
    ```
    书中给出的说法是：validator对象是通用的，在所有的需要验证的场景下都可以保持这个样子。改进它的办法就是增加更多类型的检查。如果你将它用在很多页面上，很快就会有一个非常好的验证类型的集合。然后在每个新的使用场景下需要做的仅仅是配置validator然后调用validate（）方法。**看样子保持通用性才是这个对象如此设计的最根本的目的。**
- 外观模式
  外观模式是一种很简单的模式，它只是为对象提供了更多的可供选择的接口。使方法保持短小而不是处理太多的工作是一种很好的实践。
  - 用法1:将一些通常可以共同使用的方法合并在一起
    ```
    var myevent = {
      stop: function(e){
        e.preventDefault();
        e.stopPropagation();
      }
    };
    ```
  - 用法2：弥合浏览器的兼容性
    ```
    var myevent = {
      stop: function(e){
        if(typeof e.preventDefault === "function"){
          e.preventDefault();
        }
        if(typeof e.stopPropagation === "function"){
          e.stopPropagation();
        }
        //ie
        if(typeof e.returnValue === "boolean"){
          e.returnValue = false;
        }
        if(typeof e.cancelBubble === "boolean"){
          e.cancelBubble = true;
        }
      }
    };
    ```
- 代理模式
  在代理设计模式中，一个对象充当了另一个对象的接口角色。它和外观模式不一样，外观模式带来的方便仅限于将几个方法调用联合起来。而代理对象位于某个对象和它的客户之间，可以保护对象的访问。

  在真正的主体做某件工作开销很大时，代理模式很有用处。在web应用中，开销最大的操作之一就是网络请求，此时尽可能地合并http请求是有意义的。
- 中介者模式
- 观察者模式

### 第八章 设计模式(2018.3.25~2018.3.2？)
以下推荐的访问和修改DOM树的模式，主要考虑点是性能方面。

Dom操作性能不好，这是影响javascript性能最主要的原因。性能不好是因为浏览器的Dom实现通常是和js引擎分离的。

一个原则就是Dom访问的次数应该减少到最低
1. 避免在环境中访问dom
2. 将dom引用赋给本地变量，然后操作本地变量
3. 当可能的时候使用selectors API（这个是what）
4. 遍历HTML collections时缓存length（貌似是动态的）

说曹操曹操到

使用selectorAPI是指使用这个方法：
```
document.querySelector("ul .selected");
document.querySelectorAll("#widget .class");
```
这两个方法接受一个css选择器字符串，返回匹配这个选择器的dom列表，querySlector只返回第一个匹配的dom。**selectors API在现代浏览器可用，它总是会比你使用其他dom方法做同样的选择要快。**

**document.getElementById(id)是找到一个dom元素最容易也是最快的方法**

- dom操作
除了访问dom元素之外，改变它们，删除其中的一些或是添加新的元素。更新dom会导致浏览器重绘屏幕，也经常导致重新计算元素的位置，这些操作的代价是很高的。

**通用的原则是尽量少的更新dom**

当你需要添加一棵相对较大的子树的时候，应该在完成这个树的构建之后再放到文档树中。**为了达到这个目的可以使用文档碎片来包含节点。**
`frag = document.createDocumentFragment();`

- 事件
在浏览器脚本编程中，另一块充满兼容性问题并且带来很多不愉快的区域就是李安琪事件。借用库。

  - 事件处理
  - 事件委托