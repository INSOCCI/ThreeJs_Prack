// 🍊 19. Galaxy Generator

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
// 매번 새로 생성해주기 귀찮으니까~
let geometry = null;
let material = null;
let points = null;

const parameters = {}; // 은하의 반지름이나 사이즈, 회전? 매개변수를 담을 객체 생성
parameters.count = 1000;
parameters.size = 0.02;

// 실행될 때마다 은하를 랜덤하게 생성해줄 함수
const generateGalaxy = () => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3); //3을 해주는 이유 : 각 꼭지점이 X,Y,Z 3개의 값을 가져서
  // 랜덤으로 위치 설정. -> 대신 겹치지 않게 차례대로 해줄 것임.
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    positions[i3 + 0] = Math.random(); // x 0 3 6
    positions[i3 + 1] = Math.random(); // y 1 4 7
    positions[i3 + 2] = Math.random(); // z 2 5 8
  }
  console.log(positions); // 간편하게 3000개의 배열이 생성된 것을 확인할 수 있음

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  /**
   * Material
   */
  const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  /**
   * Points
   */
  const points = new THREE.Points(geometry, material);
  scene.add(points);
};
generateGalaxy();

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
camera.position.x = 3;
camera.position.y = 3;
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
