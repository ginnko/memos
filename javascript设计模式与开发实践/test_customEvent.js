var salesOffices = {}; // 定义售楼处

salesOffices.clientList = {}; // 缓存列表，存放订阅者的回调函数

salesOffices.listen = function(key, fn) { // 增加订阅者
  if (!this.clientList[key]) {  // 如果没有订阅过此类消息，给该类消息创建一个缓存列列表
    this.clientList[key] = []; 
  }
  this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
};

salesOffices.trigger = function() { // 发布消息
  var key = Array.prototype.shift.call(arguments);
  var fns = this.clientList[key]; // 取出该消息对应的回调函数的集合

  if (!fns || fns.length === 0) {
    return false;
  }
  for(var i = 0, fn; fn = fns[i++]; ) {
    fn.apply(this, arguments); // arguments是发布消息时带上的参数
  }
};

// 一些简单测试

// 小明订阅88平米房子的消息
salesOffices.listen('squareMeter88', function(price) {
  console.log('价格=' + price);
});

// 小红订阅110平米房子的消息
salesOffices.listen('squareMeter110', function(price) {
  console.log('价格=' + price);
});

salesOffices.trigger('squareMeter88', 20000000);
salesOffices.trigger('squareMeter110', 3000000);