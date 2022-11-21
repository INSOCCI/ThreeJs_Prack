// 🍊 19. Galaxy Generator

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI(); //gui 추가

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */

const parameters = {}; // 은하의 반지름이나 사이즈, 회전? 매개변수를 담을 객체 생성
parameters.count = 10000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;

// 매번 새로 생성해주어야 하므로, 아래 변수들은 함수 밖으로 꺼내준다.
let geometry = null;
let material = null;
let points = null;

// 실행될 때마다 은하를 랜덤하게 생성해줄 함수
const generateGalaxy = () => {
  // Destroy old galaxy
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3); // x,y,z 3개

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3; // 0 3 6 9 12 ...

    // 은하 모양 속성
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

    //x, y, z 차례대로 겹치지 않게 랜덤한 위치값 설정
    positions[i3 + 0] = (Math.random() - 0.5) * 3; // x 0 3 6
    positions[i3 + 1] = (Math.random() - 0.5) * 3; // y 1 4 7
    positions[i3 + 2] = (Math.random() - 0.5) * 3; // z 2 5 8
  }
  console.log(positions); // 콘솔창을 확인해보면 3000개의 위치값이 담긴 배열이 생성된 것을 확인 가능.

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
  points = new THREE.Points(geometry, material);
  scene.add(points);
};
generateGalaxy();

//gui - count
gui
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy); // onChange로 하면 드래그 클릭 시작한 순간부터 어마하게 은하 생성->컴터 힘드렁
//gui - size
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
//gui - radius
gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);
  //gui - branches
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);

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
