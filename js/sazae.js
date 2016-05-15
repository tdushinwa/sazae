// 描画関連の初期化
var width = window.innerWidth;
var height = window.innerHeight;
var canvasFrame, scene, renderer;
var camera, trackball;
var directionalLight;

// threejsの初期化
function init(){
    canvasFrame = document.getElementById('canvas_frame');
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1.0);
    canvasFrame.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    window.addEventListener('resize', onWindowResize, false);
}

// カメラの初期化
function initCamera(){
    camera = new THREE.PerspectiveCamera(100, width / height, 0.05, 5000);
    camera.position.set(0, 0, 500);
    camera.lookAt({x: 0, y: 0, z: 0});

    trackball = new THREE.TrackballControls(camera);
    trackball.noRotate = false;
    trackball.noZoome = false;
    trackball.zoomSpeed = 0.1;
    trackball.noPan = false;
    trackball.panSpeed = 0.3;
    trackball.staticMoving = false;
    trackball.dynamicDampingFactor = 0.2;
}

function initLight(){
    directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(-100, 100, 200);
    scene.add(directionalLight);
}

function onWindowResize(){
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}


// 四角の描画関数
function squareMesh(x, y, z, size, color){
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshLambertMaterial({color: color});
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
$.getJSON(url, function(tree){ //これが最後に呼ばれる
    for(var i = 0; i < tree.list.length; i++){
        data[i] = new treeNode(
            tree.list[i].id,
            tree.list[i].parent,
            tree.list[i].marrige,
            tree.list[i].children,
            0,
            0.0,
            0.0,
            0.0
        );
    }

    init();
    initCamera();
    initLight();

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
        // 各ノードの深さを更新
        data[i].depth = getDepth(data[i], 0);
        // 婚姻関係を持っていてかつ相手が自分よりIDが幼いときは深度を同じにする
        if(data[i].marrige != null && data[i].id > data[i].marrige){
            data[i].depth = data[data[i].marrige].depth;
        }
        if(maxDepth < data[i].depth){
            maxDepth = data[i].depth;
        }
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
    var newLine = data.filter(function(item, index){
        if(item.depth == 0){
            return true;
        }
        else{
            return false;
        }
    });
    var nextOrder = []; // 現在の層の一つ下の層の順序を格納
    for(var j = 0; j < newLine.length; j++){
        nextOrder.push(newLine[j].id);  // 初期化(0層目)
    }
    var centerPointX = 0;
    // 1層ずつ描画していく
    for(i = 0; i <= maxDepth; i++){

        var len = nextOrder.length;
        for(j = 0; j < len; j++){
            console.log(nextOrder);
            var current = nextOrder[0];
            var marrigeId = data[current].marrige;
            var parentId = data[current].parent;
            data[current].y = -200 * i + 100 * maxDepth;
            data[current].z = 100;
            data[current].x = j * (100 * maxWidth) / nodeDepth[i] - 50 * maxWidth + centerPointX;
            // 親がいるときの処理(線を結ぶ)
            if(parentId != null){
                lineMesh(
                    data[current].x,
                    data[current].y,
                    data[current].z,
                    (data[parentId[0]].x + data[parentId[1]].x) / 2,
                    data[parentId[0]].y,
                    data[parentId[0]].z,
                    0x0000ff
                );
                centerPointX = (data[parentId[0]].x + data[parentId[1]].x) / 2;
            }

            // 婚姻関係がある場合の処理
            if(data[current].children != null && current > marrigeId){
                // 婚姻相手と線を結ぶ
                lineMesh(
                    data[current].x,
                    data[current].y,
                    data[current].z,
                    data[marrigeId].x,
                    data[marrigeId].y,
                    data[marrigeId].z,
                    0x0000ff
                );
                for(var k = 0; k < data[current].children.length; k++){
                    nextOrder.push(data[current].children[k]);
                    if(data[data[current].children[k]].marrige != null){
                        nextOrder.push(data[data[current].children[k]].marrige);
                    }
                }
            }
            nextOrder.shift();
        }
    }

    for(i = 1; i < data.length; i++){
        // console.log(data[i].id, data[i].x, data[i].y, data[i].z);
        squareMesh(data[i].x, data[i].y, data[i].z, 50, 0xaa0000);
    }

    var animate = function(){
        requestAnimationFrame(animate);
        trackball.update();
        renderer.render(scene, camera);
    };
    animate();
});
