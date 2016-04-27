// 描画に最低限の情報を読み込む
var node = [];
httpObj = new XMLHttpRequest();
httpObj.open("get", "data/tree.json");
httpObj.onload = function(){
    var data = JSON.parse(this.responseText);
    var txt = "";
    for(var i = 0; i < data.list.length; i++){
        // 扱いやすいように整形
        node.push({"id": data.list[i].id,
                   "parent": data.list[i].parent,
                    "marrige": data.list[i].marrige,
                    "children":data.list[i].children}
                  );
    }
};
httpObj.send(null);
httpObj.close();

// 各ノードの詳細を格納する
var detail = [];
httpObj.open("get", "data/family.json");
httpObj.onload = function(){
    var data = JSON.parse(this.responseText);
    var txt = "";
    for(var i = 0; i < data.list.length; i++){
        // 扱いやすいように整形
        detail.push({"id": data.list[i].id,
                   "name":data.list[i].name}
                 );
    }
};
httpObj.send(null);
httpObj.close();

// 階層構造を保持する
var path = [];
