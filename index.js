const gltfLoader = new THREE.GLTFLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1.5, 0.2, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x3090ff } );
const cube = new THREE.Mesh( geometry, material );
cube.receiveShadow = true;

let gyroModel;
gltfLoader.load( 'gyro.glb', function ( gltf ) {
	gyroModel = gltf;
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

//scene.add( cube );

const light = new THREE.PointLight( 0xffffff, 6, 100 );
light.position.set( 10, 5, 10 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );


//Create a DirectionalLight and turn on shadows for the light
const light2 = new THREE.PointLight( 0xffffff, 3, 100 );
light2.position.set( -10, -5, 10 ); //default; light shining from top
light2.castShadow = true; // default false
scene.add( light2 );


//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default


camera.position.z = 12;


document.body.addEventListener("keydown", (e) => {
	if(e.key == 'w')
	gyroModel.scene.rotation.x -= 0.1;
	 if(e.key == 's')
	 gyroModel.scene.rotation.x += 0.1;
	 if(e.key == 'd')
	 gyroModel.scene.rotation.z -= 0.1;
	 if(e.key == 'a')
	 gyroModel.scene.rotation.z += 0.1;
	
	 
});

const socket = io();

const dtr = 3.14159 / 180;
socket.on('sendData', (data) => {
	if(gyroModel){
		gyroModel.scene.rotation.x = data.roll * dtr;
		gyroModel.scene.rotation.z = -data.pitch * dtr;
	}
});



//let gPitch = 0, gRoll = 0;


function animate() {
	requestAnimationFrame( animate );

	/*cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;*/

	renderer.render( scene, camera );
}



animate();