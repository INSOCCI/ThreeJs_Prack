import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

import * as dat from "lil-gui";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Debug - gui로 다양한 속성 컨트롤 해보기.
 */
const gui = new dat.GUI({ width: 1000 }); // 컨트롤러의 width 값 등 설정 가능!

gui.add(mesh.position, "y");
// OR gui.add(mesh.position, "y", -3, 3, 0.01); 으로도 작성 가능.

gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
// name() 메소드를 이용하면 gui 패널에 등장하는 label의 이름을 변경.

gui.add(mesh, "visible"); // 머테리얼 숨김 속성
gui.add(material, "wireframe"); // 와이어프레임 속성
gui.addColor(material, "color"); // color 변경 속성

// GUI를 통해 큐브를 한 바퀴 돌리는 spin 함수를 트리거 해줄 수도 있음.
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};
gui.add(parameters, "spin");

// 단축key이벤트 생성 (lil-gui에서 더이상 제공하지 않아 아래 함수로 지정.)
window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    if (gui._hidden) gui.show();
    else gui.hide();
  }
});

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
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

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
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
