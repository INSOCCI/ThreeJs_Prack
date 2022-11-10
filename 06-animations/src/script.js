import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Animate
 */

// 모든 사이트 이용자에게 같은 속도의 애니메이션을 보여줄 수 있게 하는 함수 생성.
// let time = Date.now();
// const clock = new THREE.Clock()s;
gsap.to(mesh.position, { duration: 1, delay:1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay:2, x: 0 });

const tick = () => {
  // time
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;

  // clock (time에 비해 코드가 간단해져서 추천)
  // const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);
  // mesh.position.x = Math.cos(elapsedTime);
  // mesh.position.y = Math.sin(elapsedTime);
  // camera.lookAt(mesh.position);

  // Update objects
  // camera.rotation.y = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
