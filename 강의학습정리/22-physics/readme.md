# 🍎22.Physics(물리)

<br /><br />

## Theory

- Three.js에서 지원하는 RayCaster 등을 이용해서 직접 물리 현상을 구현할 수도 있지만, <br />
  조금 더 사실적인 구현을 위해서는 라이브러리를 사용하는 것도 좋음. -> Cannon.js 사용해볼 예정!<br />
  `$ npm install --save cannon` <br />
  <br />
- 물리 세계를 가상으로 만들고, 그 가상 물리 세계에서 계산한 위치를 통해 실제 three.js로 <br />
  만든 환경에서 업데이트하는 방식. (물리현상이라는 옷을 만들어서 입힌다고 생각하면 될듯?)<br />
  <br />
- 3D를 만들지만 2D 라이브러리를 사용하는 것도 좋은 방법, 오히려 성능 향상에 좋음. <br />
  <br />
  <br />

## Apply Forces : 힘을 추가하는 함수

`다양한 method
`- applyImpluse: 힘 대신 힘에 영향을 주는 속도를 직접 추가하는 함수(not force)
`- applyLocalForce: 힘을 추가하지만 좌표계의 기준이 Body(힘에서의 0,0,0이 body의 중심이 됨.)
`- applyLocalImpluse

1. Force 추가 
```javascript
sphereBody.applyLocalForce(
  new CANNON.Vec3(150, 0, 0),
  new CANNON.Vec3(0, 0, 0),
);
```

2. 바람 만들기

```javascript
const tick = () => {
    ...
    sphereBody.applyForce(new CANNON.Vec3(-0.5,0,0), sphereBody.position) ;
}
```
