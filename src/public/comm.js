const socket = io();

const stats = document.getElementById('stats');
const logs = document.getElementById('logs');


socket.on('sendData', (data) => {
	let pitch = data.pitch * dtr;
	let roll = data.roll * dtr;
	if(gyroModel){
		//console.log(data);
		gyroModel.scene.rotation.x = pitch;
		gyroModel.scene.rotation.z = roll;
	}
	/*stats.innerText = `Pitch:\t${data.pitch}° \nRoll:\t${data.roll}° \nSpeed left:\t${data.sr} m/s \nSpeed right:\t${data.sr} m/s \n` +
        `P:\t${data.P} \nI:\t${data.I} \nD:\t${data.D} \nPID:\t${data.PID} \n`;*/
    

	addToGyroChart(data.pitch - sliderA.value / 10, data.sr);	
    addToPIDChart(data.P, data.I, data.D, data.PID)
});

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

socket.on('sendLog', (data) => {
	console.log(data);
	if(data.line.startsWith('COM'))
		logs.innerText = '';
	
	if(data.line[0] != '\r')
		logs.innerText += data.line + '\n';
});