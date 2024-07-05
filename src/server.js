
const http = require('http');
const express = require('express');
const { join } = require('path');

const { Server } = require('socket.io');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')



const app = express();

app.use(express.static('src/public'))

const server = http.createServer(app)
server.listen(80, () => { });


var port;

// Select mode and port by process arguments
if (process.argv[2] == "USB") {
    console.log("Using USB communication");
    port = new SerialPort({
        path: process.argv[3],
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
    });
} else {
    console.log("Using Bluetooth communication");
    port = new SerialPort({
        path: process.argv[3],
        baudRate: 38400,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
    });
}

// Set delimiter
const parser = port.pipe(new ReadlineParser({ delimiter: '\n\r' }))



let gPitch, gRoll;
let speedL, speedR;
let P, I, D, PID;

const io = new Server(server);

io.on('connection', (socket) => {

    /// Data received
    parser.on('data', (data) => {
        const line = data.toString();
        const parameters = data.toString().split(' ');
        console.log(parameters);
        if (parameters[0] == 'GA') { // Gyroscope Angle
            gPitch = parseInt(parameters[1]) / 100;
            gRoll = parseInt(parameters[2]) / 100;
            socket.emit('sendGyro', {pitch: gPitch, roll: gRoll});
        }
        else if (parameters[0] == 'MS') { // Motor Speed
            speedL = parseInt(parameters[1]) / 10000;
            speedR = parseInt(parameters[2]) / 10000;
            socket.emit('sendSpeed', {sl: speedL, sr: speedR});
        }
        else if (parameters[0] == 'PR') { // PID Result
            P = parseInt(parameters[1]) / 10;
            I = parseInt(parameters[2]) / 10;
            D = parseInt(parameters[3]) / 10;
            PID = parseInt(parameters[4]) / 10;
            socket.emit('sendPID', {P: P, I: I, D: D, PID: PID});
        } else
            socket.emit('sendLog', {line: line});
        
        //socket.emit('sendData', { pitch: gPitch, roll: gRoll, sl: speedL, sr: speedR, P: P, I: I, D: D, PID: PID }); // send data to client
    });


    /// Send data from client to the robot
    socket.on('setP', (data) => {
        port.write(`SP${data}\r`, (err) => {
            if (err)
                console.log("write error");
        });
        port.drain();
    })
    socket.on('setI', (data) => {
        port.write(`SI${data}\r`, (err) => {
            if (err)
                console.log("write error");
        });
        port.drain();
    })
    socket.on('setD', (data) => {
        port.write(`SD${data}\r`, (err) => {
            if (err)
                console.log("write error");
        });
        port.drain();
    })
    /*socket.on('setA', (data) => {
        const value = Math.round(data);
        //console.log(value);
        port.write(`SA${value}\r`, (err) => {
            if (err)
                console.log("write error");
        });
        port.drain();
    })*/

    socket.on('setEG', (data) => {
        const value = data;
        console.log('Gyro: ' + value);
        port.write(`EG${value}\r`, (err) => {
            if (err)
                console.log("write error");
        });
        port.drain();
    })
    socket.on('setEM', (data) => {
        const value = data;
        console.log('Motor: ' + value);
        port.write(`EM${value}\r`, (err) => {
            if (err)
                console.log("write error");
        });
        port.drain();
    })
    socket.on('setEP', (data) => {
        const value = data;
        console.log('PID: ' + value);
        port.write(`EP${value}\r`, (err) => {
            if (err)
                console.log("write error");
        });
        port.drain();
    })
});