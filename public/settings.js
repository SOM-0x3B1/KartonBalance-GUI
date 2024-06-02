var gyroEnabled = true;
var motorEnabled = true;

const gyroButton = document.getElementById("toggleGyro");
const motorButton = document.getElementById("toggleMotor");

gyroButton.onclick = () => {
    gyroEnabled = !gyroEnabled;
    socket.emit("setEG", gyroEnabled ? 1 : 0);
    if(gyroEnabled)
        gyroButton.style.color = 'white';
    else
        gyroButton.style.color = 'red';
}
motorButton.onclick = () => {
    motorEnabled = !motorEnabled;
    socket.emit("setEM", motorEnabled ? 1 : 0);
    if(motorEnabled)
        motorButton.style.color = 'white';
    else
        motorButton.style.color = 'red';
}


const sliderP = document.getElementById("sliderP");
const valueP = document.getElementById("valueP");

const sliderI = document.getElementById("sliderI");
const valueI = document.getElementById("valueI");

const sliderD = document.getElementById("sliderD");
const valueD = document.getElementById("valueD");

const sliderA = document.getElementById("sliderA");
const valueA = document.getElementById("valueA");


sliderP.oninput = function() {
    valueP.innerHTML = this.value;    
}
sliderI.oninput = function() {
    valueI.innerHTML = this.value;   
}
sliderD.oninput = function() {
    valueD.innerHTML = this.value;    
}
sliderA.oninput = function() {
    valueA.innerHTML = this.value / 10;    
}

const getGyroInterval = setInterval(async () => {
    socket.emit("setP", sliderP.value);
    await sleep(20);
    socket.emit("setI", sliderI.value);
    await sleep(20);
    socket.emit("setD", sliderD.value);
    await sleep(20);
    socket.emit("setA", sliderA.value);
}, 120);


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}