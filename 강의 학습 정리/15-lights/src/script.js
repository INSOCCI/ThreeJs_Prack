// 🍊 15. Lights(조명)
// Lights는 성능 면에서 많은 비용이 소모되어, 최대한 빛을 적게 쓰고 비용이 적은 빛을 사용하는 것이 좋음.
// Minimal Cost(AmbientLight,HemisphereLight) < Moderate Cost(DirectionalLight,PointLight) < Hight Cost(SpotLight,RectAreaLight)
// -> 조명 설정을 따로 하지 않아도 되는 Baking(Bake the light into the texture)을 많이 사용함. 
//   (Texture에 아에 빛을 고정? 박아놔서? 입혀서... 성능 면에서는 좋지만 추후 조명 위치 변경은 불가함.)

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
 * Lights
 */

// Ambient Light : 모든 방향에서 동일하게 조명이 비춰지는 효과(빛 바운스를 연출할 때.)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 매개변수(컬러,빛의 강도? 밝기)
scene.add(ambientLight);

// Directional Light : 평행하게 한 방향으로만 빛이 비춰지는 효과 (태양광 같은 빛 효과)
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);

// 위에서 오는 듯한 빛 연출을 위해 전체 조명을 이동.
directionalLight.position.set(1, 0.25, 0);

// 그 외 조명 종류
// Hemisphere Light : 지상에서 오는 색상과 하늘에서 보는 색상이 다른 것을 연출.(모든 방향에서 빛이 오는 것은 AmbientLight와 유사.)
// Point Light : 한 지점에서 시작하여 모든 방향으로 균일하게 퍼져나가는 작은 범위(?)의 빛. 
// Rect Area Light : 사진관에서 볼 수 있는 큰 직사각형 조명과 유사한 효과. (directional light + diffuse light)
// Spot Light : 한 점에서 시작하여 한 방향으로 향하는 원뿔 모양으로 생기는 빛 효과. (ex;손전등)

// 빛을 다루고 계산하는 것이 상당히 까다롭고 어려움, 빛이 어디서부터 쬐여지는지 보여주는 Helper를 사용하면 도움이 됌. 

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
