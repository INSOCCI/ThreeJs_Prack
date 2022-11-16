/**
🍊 11. Textures

 * Textures? Geometry들의 표면을 덮는 이미지.
 * 대표적인 Textures 종류
    1) Color(or Albedo) : Texture의 픽셀만 가져다 적용해주는 가장 단순한 Texture
    2) Alpha : 색상이나 질감이 아닌 불투명도를 이용해 질감 표현 = 흑백(흰색-보여지는 부분, 검은색-안보이는 부분)
    3) Height : 흑백, 각 버텍스의 높이를 이용하여 지오메트리를 세분화하여 산맥과 같은 지형을 표현할 때 좋으나 성능 문제에 됴딤..ㅠ
    4) Normal : 빛의 방향을 이용하여 입체적으로 보이게끔하는 질감 표현
       -> 3)과 달리, 지오메트리의 점들을 세분화할 필요가 없어서 비교적 좋은 성능으로 디테일 추가 가능! 
    5) Ambient occlusion (빛의 차폐?) : 흑백, 대비를 이용하여 가짜 그림자를 만들어 자연스러운 입체느낌을 표현.
    6) Metalness(금속성) : 흑백(흰색-금속성, 검정색-비금속성), 주로 반사를 위해 사용함.
    7) Roughness 거칠기 : 흑백, 금속성과 함께 제공 (흰색-거친 부분, 검은색-매끄러운 부분), 주로 빛의 분산을 위해 사용함.
        6), 7)은 PBR(Physically Based Rendering, 물리 기반 렌더링 기법)의 원칙을 따름.
 * Texture 포맷과 최적화
    - 용량 : Texture를 다운 받을 때 파일의 용량 고려. (jpg-손실 압축,가벼움 / png-비손실 압축,무거움)
    - 크기(해상도) : Texture의 각 픽셀은 용량에 상관없이 GPU에 저장되어야하는데 GPU는 용량 제한이 있다는 것...
        -> mipmapping은 저장할 픽셀 수를 늘리기 때문에 더 나빠질 수 있음.
    - 데이터 : Texture는 투명도를 지원하므로 alpha값이나 투명도를 사용할 땐 .png를 사용하기!
        -> Normal Texture 사용 권장.
 */

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextureLoader } from "three";

/**
 * Texture loader
 */

// LoadingManager : 로드할 이미지가 여러개있고, 그동안 알림 등의 이벤트를 상호작용하고 싶을 때 사용.
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("로딩을 시작합니당");
};
loadingManager.onLoad = () => {
  console.log("로딩 성공!");
};
loadingManager.onProgress = () => {
  console.log("잠시만 기다려주시오..");
};
loadingManager.onError = () => {
  console.log("에 로딩 실패했움");
};

const textureLoader = new THREE.TextureLoader(loadingManager); // 상단에 생성한 로딩매니저 인스턴스를 텍스쳐 로더에 전달 후 모든 이미지를 로드하면 끄읕.

const colorTexture = textureLoader.load("/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// Rotation
colorTexture.rotation = Math.PI * 0.25;

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
const material = new THREE.MeshBasicMaterial({ map: colorTexture }); // map 속성을 주면 큐브에 텍스쳐가 반영된 것을 확인 가능!
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
