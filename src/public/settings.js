var gyroEnabled = true;
var motorEnabled = true;

const gyroButton = document.getElementById("toggleGyro");
const motorButton = document.getElementById("toggleMotor");

/// Toggle gyro data stream
gyroButton.onclick = () => {
    gyroEnabled = !gyroEnabled;
    socket.emit("setEG", gyroEnabled ? 1 : 0);
    if(gyroEnabled)
        gyroButton.style.color = 'white';
    else
        gyroButton.style.color = 'red';
}
/// Toggle motor data stream
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

const sliderA = document.getElementById("sliderA"); // target angle
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

let lastSliderP = undefined;
let lastSliderI = undefined;
let lastSliderD = undefined;

/// Send slider values
const getGyroInterval = setInterval(async () => {
    if(lastSliderP != sliderP.value){
        socket.emit("setP", sliderP.value);
        lastSliderP = sliderP.value;
    }
    await sleep(20);
    if(lastSliderI != sliderI.value){
        socket.emit("setI", sliderI.value);
        lastSliderI = sliderI.value;
    }
    await sleep(20);
    if(lastSliderD != sliderD.value){
        socket.emit("setD", sliderD.value);
        lastSliderD = sliderD.value;
    }
    /*await sleep(20);
    socket.emit("setA", sliderA.value);  // send target angle*/
}, 120);


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}