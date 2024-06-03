const dtr = 3.14159 / 180; // degree to radian


const gltfLoader = new THREE.GLTFLoader(); // 3D model loader

// Add scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = -8;
camera.rotation.y = -90 * dtr;
camera.position.y = 2;


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Load gyroscope model
let gyroModel;
gltfLoader.load( 'gyro.glb', function ( gltf ) {
	gyroModel = gltf;
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );


// Add lights
const light = new THREE.PointLight( 0xffffff, 6, 100 );
light.position.set( -10, 5, 10 ); 
light.castShadow = true;
scene.add( light );

const light2 = new THREE.PointLight( 0xffffff, 3, 100 );
light2.position.set( -10, -5, 10 ); 
light2.castShadow = true;
scene.add( light2 );


// Start animation
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();