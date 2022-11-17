// 🍊 16. Shadows(그림자)
/*  *주의* Three.js에서 Shadows를 표현할 때 주의할 점은 PointLight, DirectionalLight, SpotLight만이 shadow를 지원함!

    1. 실제로 그림자를 계산하려면 많은 CPU작업이 필요함, 컴퓨터에서는 그림자를 어떻게 그릴까?
      -> 사용자 입장에서 카메라에 '안보였던 영역'을 그림자로 칠함.
      즉, 빛의 입장에서 장면을 렌더링 하고 빛이 닿지 않는 영역을 그림자로 인식.
    
    2. 그림자 적용 후 그림자 화질이 비트맵 현상처럼 깨질 때 이를 해결할수 있는 방법이 다양하게 있음.
    1) 빛의 카메라 해상도를 높이기.
    2) 빛의 카메라를 최적화해주기.
       - 보통 빛의 카메라는 near / far 값이 굉장히 크므로, z-fighting을 방지하는 것도 하나의 방법!
    3) 그림자의 테두리를 약간 흐리게 해주기. (radius 옵션)
    4) 다양한 Shadow map 알고리즘 활용.
    5) Shadow 역시 Lights와 같이 비용이 많이 들어서, 그림자를 사진으로 저장해두고 꺼내쓰는 (baking) 방법이 있음.
       - 그림자 사진을 material로 plain에 넣고, 바닥 평면과 물체의 거리가 멀어질수록 그림자의 투명도를 높게 해서 안보이게 하는 꼼수 전략ㅋ-ㅋ
       (성능면에서도 훨씬 좋음.) 
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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

directionalLight.castShadow = true; // 그림자는 빛이 만들어 냈기에, 마지막으로 빛에게도 castShadow라는 옵션 ON

// 2-1 적용 예제 (조금 개선 되는 것 같음.)
// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;

// 2-3 적용 예제 (엥 수치를 바꿔도 다 이상하다... 이 방법이 제일 별로인듯...)
// directionalLight.shadow.radius = 5;

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true; // 그림자를 만들어낼 대상에게 catShadow라는 옵션을 ON

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

plane.receiveShadow = true; // 그림자가 나타날 대상에게 receiveShado라는 옵션을 ON

scene.add(sphere, plane);

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

// 2-2 적용 예제

// Near and Far 조정 -> 그림자의 품질 개선보다는 그림자가 갑자기 보이지 않거나 잘리는 버그를 방지할 수있음.
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

// Amplitude가 너무 커졌음. DirectionalLight를 사용하기 때문에 OrthographickCamera를 사용함. -> 카메라의 top,bottom,left,right 값 조정.
// 이 값들을 조정하니 비로소 개선 되는 것이 보임. (값이 작아질수록 그림자가 선명해진다!)
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

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

// Shadow ON
renderer.shadowMap.enabled = true;

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
