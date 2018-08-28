//这几行真正设计巧妙的地方在于把dom对象封装进自定义对象
//dom对象需要的数据属性全部都来自自定义对象的属性
//这样在控制操作dom对象的时候就不需要受dom对象的制约
//如果自己写的话完全想不到要写成这样，肯定是就直接利用dom对象的属性来控制了

//这一版是上传文件实现的第一版，这段代码里有多少个需要上传的文件，就一共创建了多少个upload对象

var id = 0;

window.startUpload = function(uploadType, files) {
  for (var i = 0, file; file = files[i++]; ) {
    var uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
    uploadObj.init(id++);
  }
};

var Upload = function(uploadType, fileName, fileSize) {
  this.uploadType = uploadType;
  this.fileName = fileName;
  this.fileSize = fileSize;
  this.dom = null;
};

Upload.prototype.init = function(id) {
  var that = this;
  this.id  = id;
  this.dom = document.createElement('div');
  this.dom.innerHTML = 
              `<span>文件名称：${this.fileName}，文件大小：${this.fileSize}</span>
               <button class="delFile">删除</button>`;
  this.dom.querySelector('.delFile').onclick = function() {
    that.delFile();
  };
  document.body.appendChild(this.dom);
};

Upload.prototype.delFile = function() {
  if (this.fileSize < 3000) {// 这个地方设计的真是巧妙
    return this.dom.parentNode.removeChild(this.dom);
  }
  if (window.confirm(`确定要删除该文件么？ ${this.fileName}`)) {
    return this.dom.parentNode.removeChild(this.dom);
  }
};

startUpload('plugin', [
  {
    fileName: '1.txt',
    fileSize: 1000
  }, {
    fileName: '2.html',
    fileSize: 3000
  }, {
    fileName: '3.txt',
    fileSize: 5000
  }
]);

startUpload('flash', [
  {
    fileName: '4.txt',
    fileSize: 1000
  }, {
    fileName: '5.html',
    fileSize: 3000
  }, {
    fileName: '6.txt',
    fileSize: 5000
  }
]);