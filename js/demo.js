;(function (doc) {
   
  // 1、独立的作用域
  // 2、执行即销毁 
  // 3、带来闭包效应

  // 6列  8列    5px   图片真的写死吗？

  // {
  // 	column: 6,
  // 	gap: 5,
  // 	imgApi: 
  // }


  var oItems = doc.getElementsByClassName('wf-item'),
      oItemsLen = oItems.length,
      _arr = [];

  var init = function () {
    setImgPos();
  }

  function setImgPos () {
    var item,
        minIdx = -1;

    for (var i = 0; i < oItemsLen; i ++) {
    	item = oItems[i];
    	item.style.width = '232px';

      if (i < 5) {
      	_arr.push(item.offsetHeight);
      	item.style.top = 0;

      	if ((i + 1) % 5 === 1) {
      		item.style.left = '0';
      	} else {
      		item.style.left = i * (232 + 10) + 'px';
      	}
      } else {
        minIdx = getMinIdx(_arr);
        item.style.left = oItems[minIdx].offsetLeft + 'px';
        item.style.top = (_arr[minIdx] + 10) + 'px';
        _arr[minIdx] += (item.offsetHeight + 10);
      } 
    }
  }

  function getMinIdx (arr) {
    return [].indexOf.call(arr, Math.min.apply(null, arr));
  }

  window.onload = function () {
  	init();
  }

})(document);

