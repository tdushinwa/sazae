var node = [];

httpObj = new XMLHttpRequest();
httpObj.open("get", "data/family.json");
httpObj.onload = function(){
    var data = JSON.parse(this.responseText);
    var txt = "";
    for(var i = 0; i < data.list.length; i++){
        txt = txt + data.list[i].id + " " + data.list[i].name + " " + data.list[i].parent + "<br />";
        // 扱いやすいように整形
        node.push({"id": data.list[i].id,
                    "name": data.list[i].name,
                    "parent": data.list[i].parent,
                    "marrige": data.list[i].marrige,
                    "children":data.list[i].children}
                  );
    }
    document.getElementById("result").innerHTML = txt;
};
httpObj.send(null);
