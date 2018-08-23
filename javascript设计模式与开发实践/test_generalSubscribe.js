var event = {
  clientList: {},
  listen: function(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
  },
  trigger: function() {
    var key = Array.prototype.shift.call(arguments),
        fns = this.clientList[key];

    if (!fns || fns.length === 0) {
      return false;
    }

    for(var i = 0, fn; fn = fns[i++]; ) {
      fn.apply(this, arguments);
    }
  },
  remove: function(key, fn) {
    var fns = this.clientList[key];

    if (!fns) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (var l = fns.length - 1; l >= 0; l--) {
        var _fn = fns[l];
        if (_fn === fn) {
          fns.splice(l, 1);
        }
      }
    }
  }
};

// 下面这个installEvent函数可以给所有的对象都动态安装发布-订阅功能：
var installEvent = function(obj) {
  for (var i in event) {
    obj[i] = event[i];
  }
};

// 测试
// 给售楼处对象salesOffices动态增加发布-订阅功能：
var salesOffices = {};
installEvent(salesOffices);

salesOffices.listen('squareMeter88', fn1 = function(price) {
  console.log('价格=', price);
})

salesOffices.listen('squareMeter88', fn2 = function(price) {
  console.log('价格=', price);
});


salesOffices.remove('squareMeter88', fn1);

salesOffices.trigger('squareMeter88', 200000);