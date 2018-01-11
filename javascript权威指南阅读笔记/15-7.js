
window.addEventListener("onload", test()); 
function test(){
  console.log("123");
  var toc = document.getElementById("TOC");
  if(!toc){
    toc = document.createElement("div");
    toc.id = "TOC";
    document.body.insertBefore(toc, document.body.firstChild);
  }
  var headings;
  if(document.querySelectorAll)
    headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  else
    headings = findHeadings(documents.body, []);
  
  function findHeadings(root, sects){
    for(var c = root.firstChild; c != null; c = c.nextSibling){
      if(c.nodeType !== 1) continue;
      if(c.tagName.length == 2 && c.tagName.charAt(0) == "H")//tagName定义在Element上，nodeName定义在node上，二者多返回大写字母表示的字符串，但是对于textNode类型，nodeName返回“text”,tagName返回undefined
        sects.push(c);
      else
        findHeadings(c, sects);
    }
  }

  // 初始化数组保持跟踪章节号
  var sectionNumbers = [0, 0, 0, 0, 0, 0];

  for(var h =0; h < headings.length; h++){
    var heading = headings[h];
    if(heading.parentNode == toc) continue;

    var level = parseInt(heading.tagName.charAt(1));
    if(isNaN(level) || level < 1 || level > 6) continue;

    sectionNumbers[level-1]++;
    for(var i =level; i < 6; i++) sectionNumbers[i] = 0;//之所以可以这么写是因为headings中的元素是按照文档中标题从上到下，从外到内的顺序查找排列的
    var sectionNumber = sectionNumbers.slice(0, level).join(".");

    var span = document.createElement("span");
    span.className = "TocSectNum";
    span.innerHTML = sectionNumber;
    heading.insertBefore(span, heading.firstChild);

    var anchor = document.createElement("a");
    anchor.name = "TOC" + sectionNumber;
    heading.parentNode.insertBefore(anchor, heading);
    anchor.appendChild(heading);//heading从原来的位置自动删除，移入a内？

    var link = document.createElement("a");
    link.href = "#TOC" + sectionNumber;
    link.innerHTML = heading.innerHTML;

    var entry = document.createElement("div");
    entry.className = "TocEntry TocLevel" + level;
    entry.appendChild(link);

    toc.appendChild(entry);
  }
}