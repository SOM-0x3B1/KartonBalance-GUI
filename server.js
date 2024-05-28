
const http = require('http');
const { urlencoded } = require('express');
const express = require('express');
const { join } = require('path');
const fs = require('fs');

const { Server } = require('socket.io');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')



const app = express();

app.disable('x-powered-by')

app.set('trust proxy', 1);
app.use(urlencoded({ extended: true, limit: '3mb' }));
app.use(express.static('public'))


app.get('/', (_, res) => {
    res.sendFile(join(__dirname, 'public/index.html'));
});

const server = http.createServer(app)
server.listen(80, () => { });


const port = new SerialPort({
    path: 'COM6',
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n\r' }))


/*const getGyroInterval = setInterval(() => {
    port.write('RG\r');
}, 100);

const getMotorInterval = setInterval(() => {
    port.write('RM\r');
}, 202);*/


let gPitch, gRoll;
let speedL, speedR;
parser.on('data', (data) => {
    const line = data.toString().split(' ');
    console.log(line);
    if(line[0] == 'GA'){
        //console.log(line[1]);
        gPitch = parseInt(line[1]) / 100;
        gRoll = parseInt(line[2]) / 100;
    } 
    else {
        speedL = parseInt(line[1]);
        speedR = parseInt(line[2]);
    }
    //console.log(`Roll: ${gRoll}° \nPitch: ${gPitch}° \nSpeed left: ${speedL} \nSpeed right: ${speedR}`);	
});


const io = new Server(server);

io.on('connection', (socket) => {
    const x = setInterval(() => {
        socket.emit('sendData', { p: gPitch, r: gRoll, sl: speedL, sr: speedR });
    }, 32);

    socket.on('setP', (data) => { 
        const value = data * 100;
        console.log(value);
        port.write('SP ' + value + '\r');
    })
    socket.on('setI', (data) => { port.write('SI ' + data * 100 + '\r'); })
    socket.on('setD', (data) => { port.write('SD ' + data * 100 + '\r'); })
    socket.on('setA', (data) => { 
        const value = Math.round(data);
        console.log(value);
        port.write('SA ' + value + '\r'); 
    })

    socket.on('setEG', (data) => { 
        const value = data;
        console.log('Gyro: ' + value);
        port.write(`EG${value}\r`, 'ascii'); 
    })
    socket.on('setEM', (data) => { 
        const value = data;
        console.log('Motor: ' + value);
        port.write(`EM${value}\r`, 'ascii');
    })

    socket.on('disconnect', () => {
        clearInterval(x);
    })
});