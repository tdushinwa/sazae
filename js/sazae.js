httpObj = new XMLHttpRequest();
httpObj.open("get", "data/family.json");
httpObj.onload = function(){
    var data = JSON.parse(this.responseText);
    var txt = "";
    for(var i = 0; i < data.list.length; i++){
        txt = txt + data.list[i].id + " " + data.list[i].name + "<br />";
    }
    document.getElementById("result").innerHTML = txt;
};
httpObj.send(null);
