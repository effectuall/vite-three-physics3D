import "./styles.css";
import * as THREE from "three";
import createLight from "./createLight";
import createCamera from "./createCamera";
import createRenderer from "./createRenderer";
import createScene from "./createScene";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const camera = createCamera(40, 10, 10, 20);
const renderer = createRenderer();
const scene = createScene();
const controls = createControls(0, 0, -6);



function createControls(x, y, z) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.target.set(x, y, z);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.1;
  return controls;
}

let plane, labelRenderer, line;
let Label = [];
let Helper = [];
let ARROW = [];
let BODY = new THREE.Group();
let bodyOrbit, bodyCurve, body, cone;
let scaleHorizontal, scaleVertical, axesHelper;
let width = window.innerWidth, height = window.innerHeight;
let lineText, lineLabel, bodyText, bodyLabel;
let axisVisible = false, labelVisible = false;
let mouse = new THREE.Vector2();
let clock = new THREE.Clock();
let v = new THREE.Vector3();
let t = 0, requestA;

let buttonStop = document.getElementById('stop');
let buttonShow = document.getElementById('show');
let inputRadius = document.getElementById('radius');
let radiusDisplay = document.getElementById('radiusDisplay');

let stop = false;
let show = true;
let params = {
  radius: 20,
  n: 20 / 2,
  speed: 0.08 / 20
}
//10,5,0.005//20,10,0.001//30,15,0.0005
//L= r x v , 0.05, 0.02, 0.015

const animations = {

  Labels: function () {

    labelVisible = !labelVisible
    if (labelVisible) {
      console.log(Label)
      showElements(Label)

    } else {
      hideElements(Label)
    }

  },
  Helper: function () {
    axisVisible = !axisVisible;
    if (axisVisible) {
      console.log(Helper)
      showElements(Helper)
    } else {
      hideElements(Helper)
    }
  }
}


const n0 = new THREE.Vector3(0, 1, 0); // normal, first up
const n = new THREE.Vector3(); // normal,
const b = new THREE.Vector3(); // binormal
let X;
const N0 = new THREE.Vector3(0, 1, 0), N = new THREE.Vector3(0, 1, 0), B = new THREE.Vector3();
let matrix3 = new THREE.Matrix3();
let matrix4 = new THREE.Matrix4();
let P = new THREE.Vector3();

init();

function changePath() {
  while (BODY.children.length > 0) {
    const A = BODY.children[0];
    A.parent.remove(A);
  }
  bodyOrbit = helixCurve().mesh;
  bodyCurve = helixCurve().curve;
  BODY.add(bodyOrbit)
  cone = new THREE.Mesh(new THREE.CircleGeometry(1, 3).rotateY(1.57).rotateZ(1.57).translate(0, .1, 0), new THREE.MeshBasicMaterial({
    color: 0x3a1afa,
    side: THREE.DoubleSide

  }));
  let tail = new THREE.Mesh(new THREE.BoxGeometry(.1, 0.1, (params.radius / 2)).translate(0, 0, (params.radius / 4)), new THREE.MeshBasicMaterial({
    color: 0x3a1afa,
    side: THREE.DoubleSide

  }));
  cone.add(tail)
  BODY.add(cone)
  // console.log('BODY-', BODY)
}

function motionPlane() {

  scaleHorizontal = new THREE.GridHelper(100, 10);
  scene.add(scaleHorizontal);
  scaleHorizontal.position.y = 0.05;


  //Add Plane
 
  plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({
    color: 0x90EE90,
    side: THREE.DoubleSide

  }));
  scene.add(plane);
  plane.rotation.x = -1.57;
  // plane.position.y = -0.1;


}

function hideVectors(name) {

  for (let i = 0; i < name.length; i++) {
    name[i].visible = false;
  }
  render()
}

function showVectors(name) {
  for (let i = 0; i < name.length; i++) {
    name[i].visible = true;
  }
  render()
}


function createLabelrenderer() {
  
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';

  labelRenderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(labelRenderer.domElement);

}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 1);
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.3);
  scene.add(ambientLight);
  mainLight.position.set(0, 60, 0);
  scene.add(ambientLight, mainLight);
}
function init() {
  
  scene.background = new THREE.Color(0xbfd1e5);
  
  createLights()
  motionPlane();
  // Add body
  let bodyGeometry = new THREE.BoxGeometry(4, 1, 1).translate(0, .5, 0);
  let bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0xA020F0
  });
  body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  scene.add(body)
  bodyOrbit = helixCurve().mesh;
  bodyCurve = helixCurve().curve;
  BODY.add(bodyOrbit)

  scene.add(BODY);

  let arrowVtail = new THREE.Mesh(new THREE.BoxGeometry(6, .1, .1).translate(-4, 1, 0), new THREE.MeshBasicMaterial({
    color: 0xff20ff,
    side: THREE.DoubleSide

  }));
  let arrowVhead = new THREE.Mesh(new THREE.CircleGeometry(1, 3).rotateZ(1).translate(-7, 1, 0), new THREE.MeshBasicMaterial({
    color: 0xff20ff,
    side: THREE.DoubleSide

  }));
  arrowVtail.add(arrowVhead)
  ARROW.push(arrowVtail);
  body.add(arrowVtail);
  let arrowVlabel = addLabel('<b>V</b>');
  arrowVlabel.position.x = -6;
  arrowVhead.add(arrowVlabel)
  Label.push(arrowVlabel);

  bodyText = document.createElement('div');
  bodyText.className = 'label';
  bodyText.innerHTML = '(' + 0 + ',' + 20 + ')';

  bodyLabel = new CSS2DObject(bodyText);
  bodyLabel.position.set(0, 2, 0)
  body.add(bodyLabel);
  bodyLabel.visible = false;
  Label.push(bodyLabel);


  let points = [new THREE.Vector3(0, 0, 0), body.position];
  let lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  let lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  line = new THREE.Line(lineGeometry, lineMaterial);

  cone = new THREE.Mesh(new THREE.CircleGeometry(1, 3).rotateY(1.57).rotateZ(1.57).translate(0, .1, 0), new THREE.MeshBasicMaterial({
    color: 0x3a1afa,
    side: THREE.DoubleSide

  }));
  let tail = new THREE.Mesh(new THREE.BoxGeometry(.1, 0.1, (params.radius / 2)).translate(0, 0, (params.radius / 4)), new THREE.MeshBasicMaterial({
    color: 0x3a1afa,
    side: THREE.DoubleSide

  }));
  cone.add(tail)
  scene.add(line);
  line.add(cone);
  BODY.add(cone)
  // let arrowRlabel = addLabel('<b>r</b>');
  // cone.add(arrowRlabel)
  // Label.push(arrowRlabel);
  let arrowLlabel = addLabel('<b>L</b>');
  arrowLlabel.position.y = 6;
  scene.add(arrowLlabel)
  Label.push(arrowLlabel);
  let arrowLtail = new THREE.Mesh(new THREE.BoxGeometry(.1, 6, .1).translate(0, 3, 0), new THREE.MeshBasicMaterial({
    color: 0x3afa1a,
    side: THREE.DoubleSide

  }));
  let arrowLhead = new THREE.Mesh(new THREE.CircleGeometry(1, 3).rotateZ(1.57).translate(0, 6, 0), new THREE.MeshBasicMaterial({
    color: 0x3afa1a,
    side: THREE.DoubleSide

  }));
  arrowLtail.add(arrowLhead)
  scene.add(arrowLtail)
  ARROW.push(arrowLtail)

  lineText = document.createElement('div');
  lineText.className = 'label';
  let measure = new THREE.Vector3(0, 0, 0).distanceTo(body.position);
  let r = measure.toFixed(0);
  lineText.innerHTML = '<b>r</b> = ' + r + ' units ';

  lineLabel = new CSS2DObject(lineText);
  lineLabel.position.set(body.position.x / 2, 2, body.position.z / 2)
  line.add(lineLabel);
  Label.push(lineLabel)

  bodyMovement();
  buttonLoad();
  createLabelrenderer()
  window.addEventListener('resize', onWindowResize);

  // document.addEventListener( 'click', onClick );

}

window.onload = function () {
  // init();
  animate();
}

function buttonLoad() {

  buttonStop.addEventListener('click', function () {
    stop = !stop;
    if (stop) {
      bodyLabel.visible = true;
      adjustLabel(bodyText, body.position);
      stopAction()

    } else {
      bodyLabel.visible = false;
      startAction()
    }
  });
  buttonShow.addEventListener('click', function () {
    show = !show;
    if (show) {

      showVectors(ARROW)
      showVectors(Label)

    } else {

      hideVectors(ARROW)
      hideVectors(Label)
    }
  });
  
  inputRadius.addEventListener('change', function () {
    // console.log(inputRadius.value);
    radiusDisplay.innerHTML = inputRadius.value;
    params.radius = inputRadius.value;
    params.n = params.radius / 2;
    params.speed = 0.08 / params.radius;
    changePath()
  })
}

function stopAction() {
  cancelAnimationFrame(requestA)
  buttonStop.innerHTML = 'START BODY';
}

function startAction() {
  requestAnimationFrame(bodyMovement)
  buttonStop.innerHTML = 'STOP BODY';
}


function render() {
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();

}

function bodyMovement() {
  // t = clock.getElapsedTime();
  requestA = requestAnimationFrame(bodyMovement);

  if (t === 0 || t > 1) {

    N.copy(N0);
    t = 0; // loop

  }

  t += params.speed;

  // X tangent, N normal, B binormal
  X = bodyCurve.getTangent(t);
  B.crossVectors(X, N);
  N.crossVectors(X, B.negate());

  matrix3.set(-X.x, N.x, B.x, -X.y, N.y, B.y, -X.z, N.z, B.z); // transposed arranged
  matrix4.setFromMatrix3(matrix3);

  P = bodyCurve.getPoint(t);

  body.setRotationFromMatrix(matrix4);
  cone.setRotationFromMatrix(matrix4);
  body.position.set(P.x, P.y, P.z);
  cone.position.set(P.x / 2, P.y / 2, P.z / 2);

  labelChange(line, lineText, lineLabel, body)
}

function helixCurve() {
  let curvePoints = [];
  let r = params.radius;
  let rad = Math.PI / (params.n)

  for (let i = -params.n; i <= params.n - 1; ++i) {
    curvePoints.push(new THREE.Vector3(r * Math.sin(rad * i), 0, r * Math.cos(rad * i)))

  }
  let curve = new THREE.CatmullRomCurve3(curvePoints)
  let geoPoints = curve.getPoints(1);
  curve.curveType = 'chordal'; //centripetal, chordal and catmullrom.
  curve.closed = true;
  let tubeGeometry = new THREE.TubeGeometry(curve, r * 5, .1, 4, false);
  let material = new THREE.MeshLambertMaterial({ color: 0xb00000 });
  let mesh = new THREE.Mesh(tubeGeometry, material);

  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;

  return { curve, mesh }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();

}

function adjustLabel(text, value) {

  text.innerHTML = '(' + (value.x).toFixed(2) + ',' + (value.z).toFixed(2) + ')';

}

function labelChange(obj, text, label, ref) {
  let points = [new THREE.Vector3(0, 0, 0), ref.position];
  let newlineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  obj.geometry = newlineGeometry;

  let measure = new THREE.Vector3(0, 0, 0).distanceTo(ref.position);
  let r = measure.toFixed(1);
  text.innerHTML = '<b>r</b> = ' + r + ' units ';
  label.position.set(ref.position.x / 2, 0, ref.position.z / 2)
}

function addLabel(name) {
  let text = document.createElement('div');
  text.className = 'label';
  text.innerHTML = name;

  let label = new CSS2DObject(text);
  return label
}