/* 🍊 18. Particles(입자) 

* particles? 별, 연기, 먼지등 자연이나 특수한 효과를 묘사할 때 사용, 하나의 particle을 4개의 vertex로 
  이뤄진 평면이라고 생각하고 그 사각 평면에 어떤 사이즈/효과를 주냐에 따라 다양하게 묘사할 수 있음.
* particles을 생성하는 것은 mesh와 똑같아서 쉬운 일이라 particles 자체를 만드는 법보다는 여기서 발생하는 문제들을
  다루는 것에 초점을 두어야 할 것 같음.
*/

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png"); // 입자 모양 이미지 불러오기

/**
 * Particles
 */

// Geometry
//const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

const particlesGeometry = new THREE.BufferGeometry();
const count = 5000; // 입자 갯수

// particlesGeometry의 color 속성을 변경해 입자들의 색깔을 모두 다르게 설정.(반드시 particlesMaterial.vertesColor를 true로 해줘야 반영됨!)
const position = new Float32Array(count * 3);
const color = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  position[i] = (Math.random() - 0.5) * 10;
  color[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(position, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(color, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1, // 입자 크기
  sizeAttenuation: true, // 멀리 있는 입자가 가까운 입자보다 작아야하는지의 여부
});
particlesMaterial.color = new THREE.Color("#ff88ff"); // 입자 색상 변경
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;

// particlesMaterial.map = particleTexture; // 입자 모양 변경

// 💡자세히보면 앞의 입자의 네모 모양 배경이 뒤에 있는 입자를 가리고 있는 문제가 발생 !
//  -> 🔎 trnsparency를 활성화하고, map을 alphaMap으로 변경하여 해결.
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;

// 💡alphaMap도 만능은 아니다! 여전히 실제 입자들의 순서와 상관없이 무작위로 앞, 뒤에 나타나는 문제 발생.
//   이는 입자들을 랜덤하게 배치하는 바람에 위치 순서와 상관없이 생성되는 순서로 그려지기 때문.

// 🔎 해결법1) alphaTest : WebGL이 픽셀의 투명도에 따라 픽셀을 렌더링할 지 말지 판단할 수 있도록 하는 값.
// particlesMaterial.alphaTest = 0.001; 조금 나아졌지만 그 효과가 미비하여 잘 모르겠음.

// 🔎 해결법2) depthTest : WebGL은 지금 그려지는 것이 이미 그린 것보다 가끼이 있는가를 테스트하는데, 이를 off하기.
// particlesMaterial.depthTest = false;
// 얼추 해결된 것 같지만 이는 다른 object나 다른 색상의 particle이 앞에 있을 때 위치를 따지지 않고 그려지는 버그가 발생.

// 🔎 해결법3) depthWrite : WebGL은 depthTest를 거치는데, 여기서 앞으로 그려질 것의 depth는 depth buffer에 저장됨.
//   depth buffer에 있는 것보다 파티클이 가까이 있는 지 검사를 하는 것이 아닌, depth buffer에 있는 것을 그리지 않게 하는 법.
//  (해당 파티클들을 그릴 때만 depth Test를 안하는 방법)
particlesMaterial.depthWrite = false; // 해결법2의 단점은 해결됐지만 파티클 간 opacity가 들어간다면 여전히 문제 발생 예상.
// Particle을 그릴 때 위치 순서가 없음으로 인한 이상 현상(버그)에 대한 완벽한 해결책은 없으니, 상황에 맞는 방법을 사용하면 되겠음.

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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
  // Update particles

  // particles.rotation.y = elapsedTime * 0.2;  y축으로 회전

  // 각 vertex의 위치를 옮겨 물결 효과
  for (let i = 0; i < count; i++) {
    let i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true; // 위치를 변경할 때는 needUpdate 속성 On!

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
