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
  ㄴ> parameters = width, height, depth, wSegments, hSegments, dSegments
      - segments : subdivision(해당 면이 몇 개의 삼각형으로 나눌지)의 개수. 
        segrments와 subdivision이 세분화되고 많아질수록 성능 저하 문제 주의! */        

// BufferGeometry
const geometry = new THREE.BufferGeometry();
const positionsArray = new Float32Array([
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,
  -1.0, -1.0, 1.0,
]);  // 3개씩 묶은 element(x,y,z)t는 하나의 버텍스를 나타냄.

// BufferAttribute
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true, // 각 세그먼트를 구분하는 선을 빨간선으로 보여줌 !
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
