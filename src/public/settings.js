var gyroEnabled = true;
var motorEnabled = true;
var pidEnabled = true;

const gyroButton = document.getElementById("toggleGyro");
const motorButton = document.getElementById("toggleMotor");
const pidButton = document.getElementById("togglePID");

/// Toggle gyro data stream
gyroButton.onclick = () => {
    gyroEnabled = !gyroEnabled;
    socket.emit("enG", gyroEnabled ? 1 : 0);
    if(gyroEnabled)
        gyroButton.style.color = 'white';
    else
        gyroButton.style.color = 'red';
}
/// Toggle motor data stream
motorButton.onclick = () => {
    motorEnabled = !motorEnabled;
    socket.emit("enM", motorEnabled ? 1 : 0);
    if(motorEnabled)
        motorButton.style.color = 'white';
    else
        motorButton.style.color = 'red';
}

pidButton.onclick = () => {
    pidEnabled = !pidEnabled;
    socket.emit("enPID", pidEnabled ? 1 : 0);
    if(pidEnabled)
        pidButton.style.color = 'white';
    else
        pidButton.style.color = 'red';
}



const sliderP = document.getElementById("sliderP");
const valueP = document.getElementById("valueP");

const sliderI = document.getElementById("sliderI");
const valueI = document.getElementById("valueI");

const sliderD = document.getElementById("sliderD");
const valueD = document.getElementById("valueD");

const sliderTau = document.getElementById("sliderTau");
const valueTau = document.getElementById("valueTau");

const sliderV = document.getElementById("sliderV");
const valueV = document.getElementById("valueV");


sliderP.oninput = function() {
    valueP.innerHTML = this.value;    
}
sliderI.oninput = function() {
    valueI.innerHTML = this.value;   
}
sliderD.oninput = function() {
    valueD.innerHTML = this.value;    
}
sliderTau.oninput = function() {
    valueTau.innerHTML = this.value / 10000;    
}

sliderV.oninput = function() {
    valueV.innerHTML = this.value;    
}

let lastSliderP = undefined;
let lastSliderI = undefined;
let lastSliderD = undefined;
let lastSliderTau = undefined;
let lastSliderV = undefined;

/// Send slider values
const getGyroInterval = setInterval(async () => {
    if(lastSliderP != sliderP.value){
        socket.emit("setP", sliderP.value);
        //lastSliderP = sliderP.value;
    }
    await sleep(30);
    if(lastSliderI != sliderI.value){
        socket.emit("setI", sliderI.value);
        //lastSliderI = sliderI.value;
    }
    await sleep(30);
    if(lastSliderD != sliderD.value){
        socket.emit("setD", sliderD.value);
        //lastSliderD = sliderD.value;
    }
    await sleep(30);
    if(lastSliderTau != sliderTau.value){
        socket.emit("setTau", sliderTau.value);
        //lastSliderTau = sliderTau.value;
    }
    await sleep(30);
    if(lastSliderTau != sliderTau.value){
        //console.log(sliderV.value);
        socket.emit("setV", sliderV.value);
        //lastSliderTau = sliderTau.value;
    }
}, 150);


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}