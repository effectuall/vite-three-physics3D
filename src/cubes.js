import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function createCamera(view, x, y, z) {
  const camera = new THREE.PerspectiveCamera(
    view,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(x,y,z);
  return camera;
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 2);
  const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(ambientLight);

  mainLight.position.set(10, 10, 10);

  scene.add(ambientLight, mainLight);
}

function createRenderer() {
  const root = document.getElementById("app");
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  root.appendChild(renderer.domElement);
  return renderer;
}

function createCube({ color, x, y }) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, 0);

  return cube;
}

function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  return scene;
}



function createControls(x,y,z) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.target.set(x,y,z);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.1;
return controls;
}

const cubes = {
  pink: createCube({ color: 0xff00ce, x: -1, y: -1 }),
  purple: createCube({ color: 0x93fffb, x: 1, y: -1 }),
  blue: createCube({ color: 0x0065d9, x: 1, y: 1 }),
  cyan: createCube({ color: 0x00d7d0, x: -1, y: 1 })
};

const camera = createCamera(75, 0, 0, 5);
const renderer = createRenderer();
const scene = createScene();
createLights();
const controls = createControls(0,0,-6);

for (const object of Object.values(cubes)) {
  scene.add(object);
}



function animate() {
  controls.update();
  render()
  requestAnimationFrame(animate);
}

animate()

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

function render() {
  renderer.render(scene, camera);
}