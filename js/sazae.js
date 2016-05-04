// 描画関連の初期化
var scene = new THREE.Scene();
var camera = new THREE.Camera();
var renderer = new THREE.WebGLRenderer();

// 描画に最低限の情報を読み込む
var url = "data/tree.json";
$.getJSON(url, function(data){
    console.log(data.list[0].id);
});

