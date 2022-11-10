import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 1
mesh.position.y = -1
mesh.position.z = 1
mesh.scale.x = 2
mesh.scale.y = 0.5
mesh.scale.z = 1
// 축 코드 순서에 따라 rotation 모양에 영향받음.
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.z = Math.PI * 0.25

scene.add(mesh);

// 축을 보여주는 오브젝트, x=적색, y=녹색, z=청색
const axisHelper = new THREE.AxisHelper()
scene.add(axisHelper)

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);
// console.log(mesh.position.length())
// console.log(mesh.position.distanceTo(camera.position))
// console.log(mesh.position.normalize())




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
