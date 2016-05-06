// 描画関連の初期化
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

camera.position.z = 500;
renderer.setSize(window.innerHeight, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 四角の描画関数
function squareMesh(x, y, z, color){
    var geometry = new THREE.PlaneGeometry(100, 100);
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

// 文章の描画関数
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

function TreeNode(id, parent, marrige, children){
    this.id = id;
    this.parent = parent;
    this.marrige = marrige;
    this.children = children;
}

// 描画に最低限の情報を読み込む
var url = "data/tree.json";
var data = [];
$.getJSON(url, function(temp){
    for(var i = 0; i < temp.list.length; i++){
        data[i] = new TreeNode(
            temp.list[i].id,
            temp.list[i].parent,
            temp.list[i].marrige,
            temp.list[i].children
        );
    }
    console.log(data[1].id); //この関数内じゃないと保持されない…かなしい
});

// フォントデータに問題有り？
// textMesh("テスト", 30, 0xffffff);

var render = function(){renderer.render(scene, camera);};
render();
