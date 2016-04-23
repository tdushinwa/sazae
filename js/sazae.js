function person(id, name, parent, marrige, children){
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.marrige = marrige;
    this.children = children;
}

httpObj = new XMLHttpRequest();
httpObj.open("get", "data/family.json");
httpObj.onload = function(){
    var data = JSON.parse(this.responseText);
    var txt = "";
    for(var i = 0; i < data.list.length; i++){
        txt = txt + data.list[i].id + " " + data.list[i].name + " " + data.list[i].parent + "<br />";
        
    }
    document.getElementById("result").innerHTML = txt;
};
httpObj.send(null);
