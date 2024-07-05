const socket = io();

const stats = document.getElementById('stats');
const logs = document.getElementById('logs');


socket.on('sendGyro', (data) => {
	let pitch = data.pitch * dtr;
	let roll = data.roll * dtr;
	if(gyroModel){
		gyroModel.scene.rotation.x = pitch;
		gyroModel.scene.rotation.z = roll;
	}
	addToGyroChart(data.pitch - sliderA.value / 10, data.sr);	
});

socket.on('sendPID', (data) => {
	addToPIDChart(data.P, data.I, data.D, data.PID)
});

socket.on('sendSpeed', (data) => {
	addToSpeedChart((data.sl + data.sr) / 2)
});


socket.on('sendLog', (data) => {
	console.log(data);
	if(data.line.startsWith('COM'))
		logs.innerText = '';
	
	if(data.line[0] != '\r')
		logs.innerText += data.line + '\n';
});