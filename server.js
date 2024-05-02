
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
    path: 'COM4',
    baudRate: 57600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))


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
    }, 16);

    socket.on('disconnect', () => {
        clearInterval(x);
    })
});