// 描画に最低限の情報を読み込む
var url = "data/tree.json";
var obj;
$.getJSON(url, function(data){
    console.log(data.list[0].id);
    obj = data;
});
