function treeNode(id, parent, marrige, children, x, y, z){
    this.id = id;
    this.parent = parent;
    this.marrige = marrige;
    this.children = children;
    this.x = x;
    this.y = y;
    this.z = z;
}

// 描画に最低限の情報を読み込む
var url = "data/tree.json";
// var httpObj = new XMLHttpRequest();

// httpObj.onload = function(){
//     if(this.readyState == 4 && this.status == 200){
//         console.log(httpObj.getResponseHeader('Content-Type'));
//         if(this.getResponseHeader('Content-Type').indexOf('application/json') != -1){
//             var obj;
//             if(window.JSON){
//                 obj = JSON.parse(httpObj.responseText);
//                 document.write("foo");
//             }
//             else{
//                 obj = eval('(' + httpObj.responseText + ')');
//                 document.write("bar");
//             }
//         }
//     }
// };

// httpObj.open("GET", url, true);
// if(httpObj.overrideMimeType){
//     httpObj.overrideMimeType("application/json");
// }
// httpObj.responseType = 'json';
// httpObj.send(null);
$.get(url, function(){
    alert("ok");
});
