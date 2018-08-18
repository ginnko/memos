
// 一种写法
// 这种写法和书里的写法不一样的地方在[1]
// 这样写会导致在触发事件的时候不停的重置setTimeout
// 这段代码带来的效果能正确显示停止事件触发那一刻的状态
const throttle = (fn, interval) => {
  let firstCall = true;
  let timer = null;

  return function() {
    const _me = this;
    if (firstCall) {
      fn.apply(_me, arguments);
      firstCall = false;
    } else {
      clearTimeout(timer); // ..............................[1]
      timer = setTimeout(() => {
        fn.apply(_me, arguments);
      }, interval || 500);
    }
  }
};

// 另一种写法
// 书里的代码
// 这段代码的效果没有办法正确显示事件停止触发的那一刻的状态
// 显示的那一刻的状态完全不由代码控制
const throttle = (fn, interval) => {
  let timer = null;
  let firstCall = true;
  return funtion() {
    const _me = this;
    if (firstCall) {
      fn.apply(_me, arguments);
      return firstCall = false;
    }
    if (timer) {
      return false;
    }
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null; // 感觉这行代码完全没有必要诶，反正setTimeout的返回值也会重新赋给timer，为何要多些这行
      fn.apply(_me, arguments);
    }, interval || 500);
  }
};

const size = () => {
  console.log(document.documentElement.clientWidth);
};

const size_throttled = throttle(size, 1000);

window.addEventListener('resize', size_throttled);