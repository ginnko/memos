## 涉及正则表达式的常用函数

- 概况

  - 定义在RegExp对象上的
    1. [exec](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)
    2. [test](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test)
    3. [match](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)

  - 定义在String对象上的
    1. [search](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search)
    2. [replace](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
    3. [split](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)

  - [在线网站](https://regexr.com/)

- 详细介绍
  1. exec()
    语法： `regexObj.exec(str)`
    返回值： 
      - 匹配成功： 返回一个数组
      - 匹配失败： 返回null
      实例：
      ````
      var re = /quick\s(brown).+?(jumps)/ig;
      var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');

      ````
    结果：
      - result的元素：

          - `[0]:'Quick Brown Fox Jumps'`
          - `[1]: 'Brown'`
          - `[2]:'Jumps'`

      - result的属性：

          - `index: 4-首次索引值`
          - `input: 'The Quick Brown Fox Jumps Over The Lazy Dog'-原始字符串`

      - re的属性

          - `lastIndex: 25-下次匹配的起始位置`

            ```
            //正则表达式不能放在while循环判断中，因为每次迭代都会重置lastIndex，导致死循环

            var myRe = /ab*/g;
            var str = 'abbcdefabh';
            var myArray;
            while ((myArray = myRe.exec(str)) !== null) {
              var msg = 'Found ' + myArray[0] + '. ';
              msg += 'Next match starts at ' + myRe.lastIndex;
              console.log(msg);
            }
            ```

            ​

