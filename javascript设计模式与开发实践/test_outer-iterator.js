const Iterator = (obj) => {
  let counter = 0;
  const next = () => {
    counter++;
  };
  const isDone = () => {
    return counter >= obj.length;
  };
  const getCurrentItem = () => {
    return obj[counter];
  };
  return {
    next: next,
    isDone: isDone,
    getCurrentItem: getCurrentItem
  };
};

const arr1 = [1, 2, 3, 4, 6];
const arr2 = [1, 2, 3, 4, 5];

const iterator1 = Iterator(arr1);
const iterator2 = Iterator(arr2);

const compare = (iterator1, iterator2) => {
  while(!iterator1.isDone() && !iterator2.isDone()) {
    if(iterator1.getCurrentItem() !== iterator2.getCurrentItem()) {
      throw new Error('iterator1 和 iterator2 不相等！');
    }
    iterator1.next();
    iterator2.next();
  }

  console.log('iterator1和iterator2相等。');
};

compare(iterator1, iterator2);