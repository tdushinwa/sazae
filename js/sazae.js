// 描画関連の初期化
var width = window.innerWidth;
var height = window.innerHeight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 500; // カメラ位置
renderer.setClearColor(0xffffff, 1.0); // 背景色
document.body.appendChild(renderer.domElement);
renderer.setSize(width, height); // レンダラのサイズをここで決定


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
function treeNode(id, parent, marrige, children, depth, x, y, z){
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
        data[i] = new treeNode(
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
            depth = Math.max(
                getDepth(data[node.parent[0]], depth + 1),
                getDepth(data[node.parent[1]], depth + 1)
            );
        }
        return depth;
    };
    for(i = 1; i < data.length; i++){
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
    for(i = 1; i < data.length; i++){
        nodeDepth[data[i].depth]++;
    }
    // 最大幅を求める
    var maxWidth = Math.max.apply(null, nodeDepth);

    // x,y,z座標を計算
    // 親の座標を計算 -> それをもとに子の座標を計算
    for(i = 0; i <= maxDepth; i++){
        var newLine = data.filter(function(item, index){
            if(item.depth == i){
                return true;
            }
            else{
                return false;
            }
        });
        for(var j = 0; j < newLine.length; j++){
            data[newLine[j].id].y = -200 * i + 100 * maxDepth;
            data[newLine[j].id].z = 0;
            // 親がいる場合はその下に描画
            if(data[newLine[j].id].parent == null){
                console.log(nodeDepth[i]);
                data[newLine[j].id].x = j * (100 * maxWidth) / nodeDepth[i] - 50 * maxWidth;
            }else{
                data[newLine[j].id].x = (data[newLine[j].parent[0]].x + data[newLine[j].parent[1]].x) / 2;
                // ついでに線も引く
                lineMesh(
                    data[newLine[j].id].x,
                    data[newLine[j].id].y,
                    data[newLine[j].id].z,
                    (data[newLine[j].parent[0]].x + data[newLine[j].parent[1]].x) / 2,
                    data[newLine[j].parent[0]].y,
                    data[newLine[j].parent[0]].z,
                    0x0000ff
                );
            }
            // idが幼い婚姻相手とは線を結ぶ
            if(data[newLine[j].id].marrige != null && newLine[j].id > data[newLine[j].id].marrige){
                var marrigeId = data[newLine[j].id].marrige;
                // console.log(newLine[j].id, marrigeId);
                lineMesh(
                    data[newLine[j].id].x,
                    data[newLine[j].id].y,
                    data[newLine[j].id].z,
                    data[marrigeId].x,
                    data[marrigeId].y,
                    data[marrigeId].z,
                    0x0000ff
                );
            }
        }
    }

    for(i = 1; i < data.length; i++){
        // console.log(data[i].id, data[i].x, data[i].y, data[i].z);
        squareMesh(data[i].x, data[i].y, data[i].z, 50, 0xff0000);
    }

    var render = function(){renderer.render(scene, camera);};
    render();
});

// フォントデータに問題有り？
// textMesh("テスト", 30, 0xffffff);

