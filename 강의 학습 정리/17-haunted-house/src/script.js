// 🍊 17. Haunted House(귀신의 집)

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

// Door Texture 이미지 불러오기.
const colorTextureDoor = textureLoader.load("/textures/door/color.jpg");
const alphaTextureDoor = textureLoader.load("/textures/door/alpha.jpg");
const heightTextureDoor = textureLoader.load("/textures/door/height.jpg");
const normalTextureDoor = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTextureDoor = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTextureDoor = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTextureDoor = textureLoader.load("/textures/door/roughness.jpg");

// Bricks Texture 이미지 불러오기.
const ambientOcclusionTextureBrick = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const colorTextureBrick = textureLoader.load("/textures/bricks/color.jpg");
const normalTextureBrick = textureLoader.load("/textures/bricks/normal.jpg");
const roughnessTextureBrick = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

// Grass Testure 이미지 불러오기.
const ambientOcclusionTextureGrass = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const colorTextureGrass = textureLoader.load("/textures/grass/color.jpg");
const normalTextureGrass = textureLoader.load("/textures/grass/normal.jpg");
const roughnessTextureGrass = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

/**
 * Object - House container 생성 (css에서의 container랑 비슷, 모든 객체를 묶고 전체적으로 이동하거나 크기를 조정하기 위함.)
 */
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: colorTextureBrick,
    aoMap: ambientOcclusionTextureBrick,
    normalMap: normalTextureBrick,
    roughnessMap: roughnessTextureBrick,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25; // y축(2.5)/2  -> 좌표 값 0부터 시작하게 해야겠쥬?

walls.castShadow = true; // 그림자를 받을 개체 활성화

house.add(walls); // house 그룹 안에 넣기

// Roof (뾰족한 피라미드 형태를 만들고 싶으나, three.js에서 지원X -> 원뿔에서 변의 수를 4로 주면 OK )
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.rotation.y = Math.PI * 0.25; // 지붕과 벽의 각을 맞추기 위해 45도 회전
roof.position.y = 3; // (2.5 + 1 / 2) 벽의 높이 2.5 + 지붕의 높이 / 2
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: colorTextureDoor,
    transparent: true,
    alphaMap: alphaTextureDoor,
    aoMap: ambientOcclusionTextureDoor,
    displacementMap: heightTextureDoor,
    displacementScale: 0.1,
    normalMap: normalTextureDoor,
    metalnessMap: metalnessTextureDoor,
    roughnessMap: roughnessTextureDoor,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2 + 0.01; // 0.01값을 더해 z-fighting 방지
house.add(door);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: colorTextureGrass,
  })
);
floor.receiveShadow = true; // receiveShadow 활성화

// 이미지 한 장을 바닥 전체로 하니, 잔디 크기가 크고 부자연스러워서 이미지를 작게 축소하고 타일처럼 반복되게 함.
colorTextureGrass.repeat.set(8, 8);
ambientOcclusionTextureGrass.repeat.set(8, 8);
normalTextureGrass.repeat.set(8, 8);
roughnessTextureGrass.repeat.set(8, 8);

colorTextureGrass.wrapS = THREE.RepeatWrapping;
ambientOcclusionTextureGrass.wrapS = THREE.RepeatWrapping;
normalTextureGrass.wrapS = THREE.RepeatWrapping;
roughnessTextureGrass.wrapS = THREE.RepeatWrapping;

colorTextureGrass.wrapT = THREE.RepeatWrapping;
ambientOcclusionTextureGrass.wrapT = THREE.RepeatWrapping;
normalTextureGrass.wrapT = THREE.RepeatWrapping;
roughnessTextureGrass.wrapT = THREE.RepeatWrapping;

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

// Bushes(덤불) 4개 - 지오메트리와 머테리얼을 한 번만 생성하고, 4개의 mesh를 만들어 처리하는 것이 성능에 좋음.
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

bush1.castShadow = true; // 그림자를 받을 개체 활성화
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

house.add(bush1, bush2, bush3, bush4);

// Graves(묘비)
const graves = new THREE.Group(); // 묘비 객체들을 그룹으로 묶어주기
scene.add(graves);

// 공통으로 사용할 geometry, material 생성
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

// 묘비 50개 추가
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2; // 랜덤 앵글 값 생성(0~180도)
  const radius = 3 + Math.random() * 6; // 집의 가운데에서 멀어지고 (3) 랜덤한 위치로 이동
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.position.set(x, 0.3, z);

  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;

  grave.castShadow = true; // 그림자를 받을 개체 활성화

  graves.add(grave);
}

/**
 * Lights
 */

// Ambient light - 전체적으로 어두운 조명 깔고
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.2);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.1);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);

moonLight.castShadow = true; // 그림자를 드리워야 하는 조명 ON

scene.add(moonLight);

// DoorLight - 문 위 현관 뽀인트 조명
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 3.5);

doorLight.castShadow = true; // 그림자를 드리워야 하는 조명 ON

house.add(doorLight);

// Fog - Three.js에서 기본으로 제공해주는 안개 같은 효과 (마우스 드래그 시 멀어질수록 안개가 덮친 것 마냥 뿌옇게 보임.)
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

// Ghosts (귀신이라 썼지만 사실 도깨비 불, 하지만 왜 클럽 조명같다......수정해보기....)
const ghost1 = new THREE.PointLight("#ff00ff", 1, 2);
ghost1.castShadow = true; // 그림자를 드리워야 하는 조명 ON
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 1, 3);
ghost2.castShadow = true;
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ff00ff", 1.5, 3);
ghost3.castShadow = true;
scene.add(ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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

renderer.setClearColor("#262837"); // 배경색(하늘?)과 안개색을 비슷하게 맞춤.

renderer.shadowMap.enabled = true; // 그림자 맵 ON
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.1;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.3;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.5;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
