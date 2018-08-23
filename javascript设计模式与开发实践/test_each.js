let each = (arr, fn) => {
  for (let i = 0, e; e = arr[i++]; ) {
    fn(e, i);
  }
};

let test_arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

each(test_arr, function(ele, i){
  let po;
  switch(i) {
    case 1: 
      po = '1st';
      break;
    case 2:
      po = '2nd';
      break;
    case 3:
      po = '3rd';
      break;
    default:
      po = `${i}th`;
  }
  console.log(`${ele} is at the ${po} position.`);
});