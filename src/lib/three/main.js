//@ts-nocheck

import * as THREE from 'three';

import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene;
let renderer;
let controls;
let raycaster;

const pointer = new THREE.Vector2();
let intersected;
let castingMeshes = [];

let cube;

let metalic = 0.13;

const moveSpeed = 25;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const init = (el) => {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 0.2, 2);

	renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
	renderer.shadowMap.enabled = true;

	raycaster = new THREE.Raycaster();

	controls = new PointerLockControls(camera, document.body);

	const blocker = document.getElementById('blocker');
	const instructions = document.getElementById('instructions');

	instructions.addEventListener('click', function () {
		controls.lock();
	});

	controls.addEventListener('lock', function () {
		instructions.style.display = 'none';
		blocker.style.display = 'none';
	});

	controls.addEventListener('unlock', function () {
		blocker.style.display = 'block';
		instructions.style.display = '';
	});

	scene.add(controls.getObject());

	const onKeyDown = function (event) {
		switch (event.code) {
			case 'ArrowUp':
			case 'KeyW':
				moveForward = true;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = true;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = true;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = true;
				break;
		}
	};

	const onKeyUp = function (event) {
		switch (event.code) {
			case 'ArrowUp':
			case 'KeyW':
				moveForward = false;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = false;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = false;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = false;
				break;
		}
	};

	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
	document.addEventListener('mousemove', onPointerMove);
};

function onPointerMove(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

const initSceneEnv = () => {
	const geometry = new THREE.BoxGeometry();

	const material = new THREE.MeshStandardMaterial({
		color: 0x00ff00,
		metalness: 0.13
	});

	cube = new THREE.Mesh(geometry, material);
	// scene.add(cube);

	const texture = new THREE.TextureLoader().load('/images/marble.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(4, 4);

	const floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
	floorGeometry.rotateX(-Math.PI / 2);
	const floorMaterial = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		metalness: metalic,
		map: texture
	});
	const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.receieveShadow = true;
	scene.add(floor);

	const loader = new OBJLoader();
	loader.load(
		'/models/cake2.obj',
		function (object) {
			object.castShadow = true;
			scene.add(object);
			castingMeshes.push(object);
		},
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		},
		function (error) {
			console.log('An error happened');
		}
	);

	const directionalLight = new THREE.DirectionalLight(0x9090aa);
	directionalLight.position.set(-10, 10, -10).normalize();
	directionalLight.castShadow = true;
	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 10;
	scene.add(directionalLight);

	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
	hemisphereLight.position.set(1, 1, 1);
	scene.add(hemisphereLight);

	const gui = new GUI(),
		folderLocal = gui.addFolder('Material Properties'),
		propsLocal = {
			get metalic() {
				return metalic;
			},
			set metalic(v) {
				metalic = v;
				floor.metalic = v;
			}
		};
	folderLocal.add(propsLocal, 'metalic', 0, 1);
};

const animate = () => {
	requestAnimationFrame(animate);
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	const time = performance.now();
	if (controls.isLocked === true) {
		const delta = (time - prevTime) / 1000;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		velocity.y = 0;
		// velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
		direction.z = Number(moveForward) - Number(moveBackward);
		direction.x = Number(moveRight) - Number(moveLeft);
		direction.normalize(); // this ensures consistent movements in all directions
		if (moveForward || moveBackward) velocity.z -= direction.z * moveSpeed * delta;
		if (moveLeft || moveRight) velocity.x -= direction.x * moveSpeed * delta;

		controls.moveRight(-velocity.x * delta);
		controls.moveForward(-velocity.z * delta);
	}
	prevTime = time;

	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects(castingMeshes, false);
	if (intersects.length > 0) {
		if (intersected != intersects[0].object) {
			if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
			intersected = intersects[0].object;
			intersected.currentHex = INTERSECTED.material.emissive.getHex();
			intersected.material.emissive.setHex(0xff0000);
		}
	} else {
		if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
		intersected = null;
	}

	renderer.render(scene, camera);
};

const resize = () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
};

export const createScene = (el) => {
	init(el);
	initSceneEnv();
	resize();
	animate();
};

window.addEventListener('resize', resize);
