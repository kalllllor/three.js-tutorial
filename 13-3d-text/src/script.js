import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { DodecahedronBufferGeometry } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector(
  "canvas.webgl"
);
const particles = new THREE.Group();
// Scene
const scene = new THREE.Scene();

//Axes helper

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matCapsTexture = textureLoader.load(
  "textures/matcaps/4.png"
);
/**
 * Fonts
 */

const fontLoader = new FontLoader();
fontLoader.load(
  "/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const textGeometry = new TextGeometry(
      "Ale jajca",
      {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      }
    );

    const textMaterial =
      new THREE.MeshMatcapMaterial({
        matcap: matCapsTexture,
      });
    textMaterial.matcap;
    const text = new THREE.Mesh(
      textGeometry,
      textMaterial
    );
    textGeometry.center();
    scene.add(text);
    const hendronGeometry =
      new DodecahedronBufferGeometry(0.1, 0);

    const radius = 4;
    const randomness = 3;
    for (let i = 0; i < 400; i++) {
      const hendron = new THREE.Mesh(
        hendronGeometry,
        textMaterial
      );
      hendron.position.set(
        Math.sin((Math.PI * 2 * i) / 100) *
          radius +
          (Math.random() - 0.5) * randomness,
        (Math.random() - 0.5) * randomness,
        Math.cos((Math.PI * 2 * i) / 100) *
          radius +
          (Math.random() - 0.5) * randomness
      );
      particles.rotation.z = 0.1;
      particles.add(hendron);
    }
    scene.add(particles);
  }
);
/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

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
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );
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
camera.position.x = -1.7;
camera.position.y = 0.7;
camera.position.z = 4;
gui.add(camera.position, "x", -5, 5, 0.01);
gui.add(camera.position, "y", -5, 5, 0.01);
gui.add(camera.position, "z", -5, 5, 0.01);
scene.add(camera);

// Controls
const controls = new OrbitControls(
  camera,
  canvas
);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  particles.rotation.y = elapsedTime * 0.01;
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
