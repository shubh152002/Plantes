import "./style.css";

// Import Three.js and OrbitControls
import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import gsap from "gsap";

// Get the canvas element
const canvas = document.getElementById("canvas");

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 11;

// Create a renderer with proper pixel ratio
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
renderer.setClearColor(0x000000, 1);

// Add HDRI environment map for realistic lighting
const loader = new RGBELoader();
loader.load(
 "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/clarens_night_02_1k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture;
  }
);

const radius = 1.8;
const segments = 70;
const orbitRadius = 6;
const colors = ["red", "green", "blue", "yellow"];
const textures = [
  "/csilla/color.png",
  "/earth/map.jpg",
  "/venus/map.jpg",
  "/volcanic/color.png",
];
const spheres = new THREE.Group([]);
// Create a big sphere with stars texture for the background
const starRadius = 50; // Much larger than the planets
const starSegments = 64;
const starGeometry = new THREE.SphereGeometry(
  starRadius,
  starSegments,
  starSegments
);

// Load stars texture
const starsTextureLoader = new THREE.TextureLoader();
const starsTexture = starsTextureLoader.load("/stars.jpg");
starsTexture.colorSpace = THREE.SRGBColorSpace;
// Create material with the texture on the inside of the sphere
const starsMaterial = new THREE.MeshStandardMaterial({
  map: starsTexture,
  opacity: 0.5,
  transparent: true,
  side: THREE.BackSide, // Render the inside of the sphere
});

// Create the star sphere mesh
const starsSphere = new THREE.Mesh(starGeometry, starsMaterial);
scene.add(starsSphere);

for (let i = 0; i < 4; i++) {
  // Add texture to the sphere
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);

  // material.map = texture;
  // material.needsUpdate = true;

  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);
  spheres.add(sphere);
}
spheres.rotation.x = 0.1;
spheres.position.y = -1;
scene.add(spheres);

//gsap animation
// setInterval(() => {
//   gsap.to(spheres.rotation, {
//     y: `+=${Math.PI / 2}`,
//     duration: 2,
//     ease: "expo.easeInOut",
//   });
// }, 2500);

// Handle window resize
window.addEventListener("resize", () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Simple wheel event handler
// Throttle wheel events to run once every 2 seconds
let lastWheelTime = 0;
let throttleDelay =2000;
let scrollCount = 0;

function handleWheel(event) {
  const currentTime = Date.now();
  if (currentTime - lastWheelTime >= throttleDelay) {
    lastWheelTime = currentTime;
    const direction = event.deltaY > 0 ? "down" : "up";
    scrollCount = (scrollCount +1) % 4;
    
    const heading = document.querySelectorAll(".heading")
    gsap.to(heading,{
      duration:2,
      y:`-=${100}%`,
      ease:"power2.inOut",

     
    });
    gsap.to(spheres.rotation,{
      duration:2,
      y:`-=${Math.PI / 2}%`,
      ease:"power2.inOut"
    })

    if(scrollCount === 0){
      gsap.to(heading,{
        duration:2,
        y:`0`,
        ease:"Power2.inOut"
      });
    }
  }
}
window.addEventListener("wheel", handleWheel);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  // controls.update();

  // Rotate the cube

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
