- extend类型方法

  |            | _extend                                  | _extendOwn                               | _defaults                                |
  | :--------- | :--------------------------------------- | :--------------------------------------- | :--------------------------------------- |
  | 介绍         | _.extend({name: 'moe'}, {age: 50});<br />=> {name: 'moe', age: 50}<br /><br />浅复制，会将第一参数之外的所有对象中的属性（包括从原型链中继承来的属性）复制到第一个对象中，返回一个新的对象。如果有相同属性名，后续属性值覆盖前面的属性值 | 类似_extend()，不过复制的属性只是对象本身的属性，不包括从原型链上继承来的属性。 | var iceCream = {flavor: "chocolate"};<br />=> {flavor: "chocolate", sprinkles: "lots"}<br /><br />复制后续对象的属性到第一个对象中，但是相同属性名的属性值不会发生覆盖，以第一个值为准。 |
  | 通用函数       | createAssigner()                         | createAssigner()                         | createAssigner()                         |
  | 作为参数的key函数 | _.allKeys                                | _.keys                                   | _.allKeys                                |
  | 调用方式       | _ _.extend = createAssigner(_.allKeys);  | _ _.extendOwn = createAssigner(_.keys);  | _ _.defaults = createAssigner(_.allKeys, true); |

  1. 内部函数定义**createAssigner(keysFunc, undefinedOnly)** ——返回一个函数

     1. 先处理没有复制对象的情况：直接返回原对象。`if (length < 2 || obj == null) return obj;`

     2. 使用key获取函数获取对象的属性并返回一个由属性组成的数组。

        - _.allKeys函数，接受一个对象作为参数。

          1. 容错机制

             `if (!_.isObject(obj)) return [];`

          2. 使用for in 提取出obj对象中的属性名称，组成一个数组。

             for in循环会遍历对象本身的所有可枚举属性，以及对象从其构造函数原型中继承的属性。

          3. `if (hasEnumBug) collectNonEnumProps(obj, keys);`

             由于IE9及以下浏览器不能遍历某些重写的属性，所以通过判断这些属性可以确定当前的环境是否是在IE9及以下。

             `var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');`

             ```
             ['valueOf', 'isPrototypeOf', 'toString','propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];//IE9不能遍历的属性集合 还有一个constructor
             ```

             ```
             if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                     keys.push(prop);
                   }//如果属性被重写且key中没有这个属性才添加
                   //搜集的是被添加对象的属性，还没有合到第一个对象上
             ```

        - _.keys()函数，接受一个对象作为参数

          1. 如果浏览器支持 ES5 Object.key() 方法。Object.key() 接受一个对象作为参数，返回一个给定对象的自身可枚举属性组成的数组。这个方法和for in的一个区别是是否在原型链上检查。

     3. 控制复制过程

        ```
        if (!undefinedOnly || obj[key] === void 0)
            obj[key] = source[key];
        ```

        - _.extend()和 _.extendOwn()两个函数不传递undefinedOnly参数，!undefinedOnly永远为true，条件判断始终为真。
        - _defaults()传递undefinedOnly = true，!undefinedOnly为false，条件判断由obj[key] === void 0决定，实现了属性不会覆盖的操作。

- 用void 0 替代undefined

  1. undefined不是保留词，在低版本的IE中可以被重写；ES5中，全局undefined是只读，但是局部undefined依然可以被重写。


  2.  void 运算符能对给定的表达式进行求值，然后返回 undefined。**用 void 0 代替 undefined 能节省不少字节的大小。**

- 对象不能为null或undefined的判断

  `obj ！== null`

