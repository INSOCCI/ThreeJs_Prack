// 🍊 20. Raycater

/* Raycaster란? 
게임에서 플레이어 앞에 어떤 벽이 있는지, 레이저 총이 무엇을 명중했는지, 
마우스 아래 현재 무엇이 있는지 감지 하는 것 등이 결국 모두 Raycasting임.
즉, 특정 방향으로 광선을 쏘고 어떤 물체가 해당 광선과 교차하는지 테스트할 수 있는 것을 말함. */

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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster 생성
 */
const raycaster = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirecton = new THREE.Vector3(10, 0, 0);
rayDirecton.normalize(); // Vector3(3D 벡터 클래스:x,y,z,)를 간편하게 단위 길이를 1로 조절해줌.
raycaster.set(rayOrigin, rayDirecton); // (origin의 위치, 나아가는 방향)

scene.add(
  new THREE.ArrowHelper( // ArrowHelpe이용-> raycaster를 눈으로 확인 가능
    raycaster.ray.direction,
    raycaster.ray.origin,
    300,
    0x00ff00
  )
);

// 광선이 교차하는 오브젝트를 담은 객체 얻기
const intersect = raycaster.intersectObject(object2); // 단수
// console.log(intersect);

const intersects = raycaster.intersectObjects([object1, object2, object3]); // 복수
// console.log(intersects); 🤔 근데 왜 옵젝트1,2,3의 값이 왜 다 같게 나올까...?

/*console에서 확인 가능한 정보
- distance: 광선의 origin부터 충돌 포인트까지의 거리
- face: geometry의 어떤 면이 광선에 의해 부딪혔는지
- faceIndex: 해당 face의 index
- object: 어떤 object가 충돌과 관련되어 있는지
- point: 충돌 지점의 Vector3 정보
- uv: 해당 geometry의 UV 좌표
*/

/**raycaster를 사용하면 옵젝트가 마우스 뒤에 있는지 테스트할 수도 있음.
 * Mouse Hovering
 */
const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mousePosition.x = (event.clientX / sizes.width) * 2 - 1;
  mousePosition.y = -(event.clientY / sizes.height) * 2 + 1;

  console.log(mousePosition);
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

let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Cast a ray
  const rayOrigin = new THREE.Vector3(-3, 0, 0);
  const rayDirecton = new THREE.Vector3(1, 0, 0);
  rayDirecton.normalize();

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);
  // console.log(intersects);

  raycaster.setFromCamera(mousePosition, camera); // setFromCamera를 이용하여 광선을 올바른 방향으로 향하게 할 수 있음. raycaster의 origin을 마우스로, direction을 카메라로 설정해주면, 마우스를 기준으로 광선을 던지게 되고, 결국 마우스가 호버됨에 따라 object정보를 받아 옵젝트의 색상도 blue가 된다!

  // objectsToTest에 담긴 세 개의 구체의 색상을 빨간색으로 설정. -> 광선이 교차하지 않을 때의 옵젝트 색상은 red!
  for (const object of objectsToTest) {
    if (!intersects.find((intersect) => intersect.object === object)) {
      object.material.color.set("#ff0000");
    }
  }
  // intersects를 돌면서 그 안에 담긴 object들의 색상을 파란색으로 설정. -> 광선이 오브젝트와 교차하는 동안 옵젝트 색상은 blue!
  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  /* Mouseleave event */
  // 교차하는 Object가 있는데, currentIntersect에 저장된 것이 없으면, mouse가 들어온 것! currentIntersect를 저장해줌.
  if (intersects.length) {
    if (!currentIntersect) {
      console.log("mouse enter : 마우스 입장");
    }

    currentIntersect = intersects[0];
  }
  // 교차하는 것이 없는데 currentIntersect에 저장된 것이 있으면, mouse가 떠난 것! currentIntersect를 다시 null로 바꾸어줌.
  else {
    if (currentIntersect) {
      console.log("mouse leave : 마우스 퇴장");
    }

    currentIntersect = null;
  }

  /* Mouse click event */
  window.addEventListener("click", () => {
    if (currentIntersect) {
      switch (currentIntersect.object) {
        case object1:
          console.log("click on object 1");
          break;

        case object2:
          console.log("click on object 2");
          break;

        case object3:
          console.log("click on object 3");
          break;
      }
    }
  }); // 🤔근데 클릭 후 마우스를 움직이지 않으면 퇴장 인식을 못하면서 클릭 이벤트가 무한번 일어난다;;; 컴퓨터 열받고 있다...

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
