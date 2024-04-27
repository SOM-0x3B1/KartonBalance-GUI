const socket = io();

const gltfLoader = new THREE.GLTFLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 8;


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


let gyroModel;
gltfLoader.load( 'gyro.glb', function ( gltf ) {
	gyroModel = gltf;
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );


const light = new THREE.PointLight( 0xffffff, 6, 100 );
light.position.set( 10, 5, 10 ); 
light.castShadow = true;
scene.add( light );

const light2 = new THREE.PointLight( 0xffffff, 3, 100 );
light2.position.set( -10, -5, 10 ); 
light2.castShadow = true;
scene.add( light2 );



const dtr = 3.14159 / 180;
socket.on('sendData', (data) => {
	if(gyroModel){
		//console.log(data);
		gyroModel.scene.rotation.x = data.roll * dtr;
		gyroModel.scene.rotation.z = -data.pitch * dtr;
	}
});


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}


animate();