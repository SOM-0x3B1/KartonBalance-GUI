
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


var port;

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

const parser = port.pipe(new ReadlineParser({ delimiter: '\n\r' }))


let gPitch, gRoll;
let speedL, speedR;
parser.on('data', (data) => {
    const line = data.toString().split(' ');
    console.log(line);
    if (line[0] == 'GA') {
        //console.log(line[1]);
        gPitch = parseInt(line[1]) / 10;
        gRoll = parseInt(line[2]) / 10;
    }
    else {
        speedL = parseInt(line[1]) * 0.00392;
        speedR = parseInt(line[2]) * 0.00392;
    }
    //console.log(`Roll: ${gRoll}° \nPitch: ${gPitch}° \nSpeed left: ${speedL} \nSpeed right: ${speedR}`);	
});


const io = new Server(server);

io.on('connection', (socket) => {
    const x = setInterval(() => {
        socket.emit('sendData', { p: gPitch, r: gRoll, sl: speedL, sr: speedR });
    }, 16);

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
    socket.on('setA', (data) => {
        const value = Math.round(data);
        //console.log(value);
        port.write(`SA${value}\r`, (err) => {
            if (err)
                console.log("write error");
        });
        port.drain();
    })

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

    socket.on('disconnect', () => {
        clearInterval(x);
    })
});