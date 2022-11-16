//🍊 9. Geometry(기하)

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/* Object

// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
  ㄴ> parameters = width, height, depth, wSegments, hSegments d,Segments
      - segments : subdivision(해당 면을 몇 개의 삼각형으로 나눌지)의 개수. 
        segrments와 subdivision이 세분화되고 점차 나뉠수록 성능 저하 문제 주의! */        

// Buffer Geometry - (너무 복잡하지 않은) Geometry 직접 만들 수 있음.
const geometry = new THREE.BufferGeometry();

// 비어있는 Geometry에 꼭짓점을 추가해주기 위해서 js 내장함수인 Float32Array를 활용.
// 왜? 배열을 인자로 넘겨주게 되느네, 이 배열은 오직 실수만 요소로 가질 수 있고, 배열의 길이도 고정되어 있어서,
// 요소가 셋식 짝을 위뤄 하나의 vertex의 위치를 이렇게 생성한 배열을 BufferGeometry에 넘겨주기 전에 
// 우리는 해당 배열을 BufferAttirbute 메소드를 통해서 변환해주면 됌. (첫 번째 인자는 위에서 생성해준 Array이고 두번째 인자는 몇 개의 value들이 모여 하나의 vertex를 구성하는지를 의미)

const positionsArray = new Float32Array([
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,
  -1.0, -1.0, 1.0,
]);  // 3개씩 묶은 element(x,y,z)t는 하나의 버텍스를 나타냄.

// Buffer Attribute
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true, // true->각 세그먼트를 구분하는 선을 빨간선으로 보여줌 !
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();