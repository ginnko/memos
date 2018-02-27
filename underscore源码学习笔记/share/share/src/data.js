const Cases = [
  [{'title': '简介',
    'content': 'Underscore使用原生的javascript扩充了已有的方法或添加了原生javascript中不存在方法,\
    是一个工具库，目的是提高写代码的效率。共有112个方法，分为集合类（25）、数组类（20）、函数类（14）、\
    对象类（37）、实用功能（14）、链式语法（2）。'
  },
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
  ],
  [
    {
      'title': '_.object()',
      'code': '返回type === \'function\' || type === \'object\' && !!obj;',
    },
    {
      'title': 'isArrayLike()',
      'content': '满足三个条件：length属性是number类型，length值大于0，小于最大值。\
      能让这个函数返回true的类型有：数组、arguments、HTML Collection、NodeList、字符\
      串、函数、{length：10}这种对象。'
    },
    {
      'title': '_.isArray(obj)',
      'code': '使用的方法 object.prototype.toString.call(obj) === \'[object Array]\''
    },
    {
      'title': 'Arguments, Function, String, Number, Date, RegExp, Error类型判断',
      'code': '_.each([\'Arguments\', \'Function\', \'String\', \'Number\', \'Date\', \'RegExp\', \'Error\'], function(name)\{\n\
        \_[\'is\' + name] = function(obj)\{\n\
          return toString.call(obj) === \'[object \' + name + \']\'\;\n\
        }\;\n\
  });',
      'linkName': '注1：关于\_.each()',
      'link': 'http://underscorejs.org/#each'
    }
  ],
  [
    {
      'title': '分类',
      'content': '1.针对不同类型对象做出不同处理的的路由函数;2.创建其他函数的函数'
    },
    {
      'title': 'optimizeCb()',
      'content': '处理函数的函数, 针对函数是否指定上下文以及传入参数的数量来指定对应的返回函数',
      'linkName':'注1:参见optimizeCb()的定义',
      'link':'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L107',
    },
    {
      'title': 'cb()',
      'content': '针对null,对象,函数,其他类型返回相应值的路由函数',
      'linkName': '注2:参加cb()的定义',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L149',
    },
    {
      'title': 'createReduce()',
      'content': '用来创建reduce和reduceRight两个函数',
      'linkName': '注3:参见createReduce()的定义',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L337',
    }
  ],
  [
    {
      'title': 'underscore中的函数构建方式',
      'content': '基本可以分成两种:1.由现有函数进行组合;2.使用高阶函数',
    },
    {
      'title': '_.pluck()',
      'code': '  _.pluck = function(obj, key)\{\n\
        return _.map(obj, _.property(key))\;\n\
    };',
      'linkName': '注1:pluck函数的使用',
      'link': 'http://underscorejs.org/#pluck',
    },
    {
      'title': 'group()',
      'linkName': '注2:参见group()的定义',
      'link': 'https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js#L704',
    }
  ],
  [
    {
      'title': '洗牌算法_.shuffle()',
      'linkName': '注1:洗牌算法',
      'link': 'https://github.com/hanzichi/underscore-analysis/issues/15',
    }
  ]

];

export {Cases};