import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
// const myTexture = textureLoader.load('/ACcurrent.jpg')
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener('resize', onWindowResize);
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  render()

}
function render(){
  renderer.render(scene, camera);
}
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  render()
}
animate();