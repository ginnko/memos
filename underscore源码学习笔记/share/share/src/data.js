const Cases = [
  [{'title': '简介',
    'content': 'Underscore使用原生的javascript扩充了已有的方法或添加了原生javascript中不存在方法,\
是一个工具库，目的是提高写代码的效率。\n\n共有112个方法，分为集合类（25）、数组类（20）、函数类（14）、\
对象类（37）、实用功能（14）、链式语法（2）。\n\nunderscore很久没有更新了，现在最近的版本是1.8.3，很多人都在用lodash。'
  },
  {'title': '学到的',
  'content': '前后断断续续大概看了一个多月，关注的主要内容：\n\
  1.这个库如何引入到环境中以及整体架构\n\
  2.函数的创建，特别是闭包的使用\n\
  3.一些写代码的思路\n\
  4.更加熟悉了一些js的基础，比如原型链、this、原生函数等\n\
  5.学到一些小技术'
  
},

  ],
  [
    {'title': '_符号',
    'content': '_，这个符号相当于jQuery中的$。变成全局变量的方法：',
    'code': '1. (function() { ... }.call(this));\
    \n2.最开头 var root = this;//在客户端比如浏览器，root=window\
    \n3.  var _ = function(obj) \{\n      if (obj instanceof _\)\n\
          return obj\;\n      if (!(this instanceof _)\)\n\
          return new _(obj)\;\n\
        this._wrapped = obj\;\n\
      };\
    \n4.if (typeof exports !== \'undefined\')\{\n\
      if (typeof module !== \'undefined\' && module.exports)\{\n\
        exports = module.exports = _\;\n\
      \}\n\
      exports._ = _\;\n\
    } else \{\n\
      root._ = _\;\n\
    }'
    },
    {
      'title': '调用方式',
      'content': '\
      1. 大多数时候使用这种形式: _.each([1, 2, 3], alert);\n\
      2. oop调用:_([1, 2, 3]).each(alert);\n\
      3. 链式调用:\n\
        _.chain([1, 2, 3]\)\n\
        .map(function(a) {return a * 2;}\)\n\
        .reverse(\)\n\
        .value();'

    }
  ],
  [
    {
      'title': '_.object()',
      'code': '_.isObject = function(obj) \{\n\
        var type = typeof obj\;\n\
        return type === \'function\' || type === \'object\' && !!obj\;\n\
      };',
    },
    {
      'title': 'isArrayLike()',
      'content': '满足三个条件：length属性是number类型，length值大于0，小于最大值。\
      能让这个函数返回true的类型有：数组、arguments、HTML Collection、NodeList、字符\
      串、函数、{length：10}这种对象。'
    },
    {
      'title': '_.isArray(obj)',
      'code': '_.isArray = nativeIsArray || function(obj) \{\n\
        return toString.call(obj) === \'[object Array]\'\;\n\
      };'
    },
    {
      'title': 'Arguments, Function, String, Number, Date, RegExp, Error类型判断',
      'code': '_.each([\'Arguments\', \'Function\', \'String\', \'Number\', \'Date\', \'RegExp\', \'Error\'], function(name)\{\n\
        \_[\'is\' + name] = function(obj)\{\n\
          return toString.call(obj) === \'[object \' + name + \']\'\;\n\
        }\;\n\
  })\;\n\n\
  //针对ie<9 的情况\n\n\
  if (!_.isArguments(arguments)) \{\n\
    _.isArguments = function(obj) \{\n\
      return _.has(obj, \'callee\')\;\n\
    }\;\n\
  }',
      'linkName': '注1：关于\_.each()',
      'link': 'http://underscorejs.org/#each'
    }
  ],
  [
    {
      'title': '分类',
      'content': '1.内部函数（路由函数）;2.创建其他函数的函数'
    },
    {
      'title': '内部函数1：optimizeCb()',
      'content': '处理函数的函数, 针对函数是否指定上下文以及传入参数的数量来指定对应的返回函数',
      'linkName':'注1:参见optimizeCb()的定义',
      'link':'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L107',
    },
    {
      'title': '内部函数2：cb()',
      'content': '针对null,对象,函数,其他类型返回相应值的路由函数',
      'linkName': '注2:参加cb()的定义',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L149',
    },
    {
      'title': '利用闭包创建函数1：createReduce()',
      'content': '用来创建reduce和reduceRight两个函数',
      'linkName': '注3:参见createReduce()的定义',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L337',
    },
    {
      'title': '利用闭包创建函数2：group()',
      'linkName': '注4:参见group()的定义',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L704',
    },
    {
      'title': '已有函数拼凑的函数：_.pluck()',
      'code': '  _.pluck = function(obj, key)\{\n\
        return _.map(obj, _.property(key))\;\n\
    };',
      'linkName': '注5:pluck函数的使用',
      'link': 'http://underscorejs.org/#pluck',
    },
  ],

];

export {Cases};

/*
1.介绍部分加上整体架构：https://github.com/hanzichi/underscore-analysis/issues/27（1）
2：有用的技术：增加节流和去抖（2）
3.函数思路：增加void 0，对数组和对象key的使用，对不同对象的归一化的使用（3）

*/ 