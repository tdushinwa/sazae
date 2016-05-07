// 描画関連の初期化
var width = window.innerWidth;
var height = window.innerHeight;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

camera.position.z = 500; // カメラ位置
renderer.setSize(width, height); // レンダラのサイズ
renderer.setClearColor(0xffffff, 1.0); // 背景色
document.body.appendChild(renderer.domElement);

// 四角の描画関数
function squareMesh(x, y, z, size, color){
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshBasicMaterial({color: color});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
}

// 線の描画関数
function lineMesh(x1, y1, z1, x2, y2, z2, color){
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({
        color: color
    });
    geometry.vertices.push(
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x2, y2, z2)
    );
    var line = new THREE.Line(geometry, material);
    scene.add(line);
}

// 文章の描画関数(今は使用不可)
function textMesh(text, size, color){
    var geometry = new THREE.TextGeometry(text, {
        size: size,
        height: 1,
        weight: "regular",
        style: "normal",
        curveSegments: 10,
        font: "mplus-2m_regular"
    });
    var material = new THREE.MeshBasicMaterial({color: color});
    var mesh = THREE.Mesh(geometry, material);
    scene.add(mesh);
}

// 描画に必要なデータを格納しておく
function TreeNode(id, parent, marrige, children, depth, x, y, z){
    this.id = id;
    this.parent = parent;
    this.marrige = marrige;
    this.children = children;
    this.depth = depth;
    this.x = x;
    this.y = y;
    this.z = z;
}

// 描画に最低限の情報を読み込む
var url = "data/tree.json";
var data = [];
var nodeDepth = [];
$.getJSON(url, function(temp){ //これが最後に呼ばれる
    for(var i = 0; i < temp.list.length; i++){
        data[i] = new TreeNode(
            temp.list[i].id,
            temp.list[i].parent,
            temp.list[i].marrige,
            temp.list[i].children,
            0,
            0.0,
            0.0,
            0.0
        );
    }

    // 各ノードの深度を記憶する(リファクタリングしたい)
    var maxDepth = 0; // 最大の深さを出しておく
    function getDepth(node, depth){
        if(node.parent != null){
            depth = getDepth(data[node.parent[0]], ++depth);
        }
        return depth;
    };
    for(i = 0; i < data.length; i++){
        data[i].depth = getDepth(data[i], 0);
        if(data[i].marrige != null && data[i].id > data[i].marrige){
            data[i].depth = data[data[i].marrige].depth;
        }
        if(maxDepth < data[i].depth){
            maxDepth = data[i].depth;
        }
        console.log(data[i].id, data[i].depth);
    }
    // 空の配列作る
    for(i = 0; i <= maxDepth; i++){
        nodeDepth.push(0);
    }
    // 各深度に対するデータの量
    for(i = 0; i < data.length; i++){
        nodeDepth[data[i].depth]++;
    }
    // 最大幅を求める
    var maxWidth = Math.max.apply(null, nodeDepth);

    // x,y,z座標を計算
    for(i = 0; i < maxDepth; i++){
        for(var j = 0; j < maxWidth; j++){
            
        }
    }
    // 描画
    render();
});

// フォントデータに問題有り？
// textMesh("テスト", 30, 0xffffff);

var render = function(){renderer.render(scene, camera);};
