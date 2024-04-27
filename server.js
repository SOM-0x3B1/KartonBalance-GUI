
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
    baudRate: 57600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r' }))


let gPitch, gRoll;
parser.on('data', function (data) {
    const line = data.toString().split(' ');
    gPitch = parseInt(line[0]) / 100;
    gRoll = parseInt(line[1]) / 100;
});


const io = new Server(server);

io.on('connection', (socket) => {
    const x = setInterval(() => {
        socket.emit('sendData', { pitch: gPitch, roll: gRoll });
    }, 50);

    socket.on('disconnect', () => {
        clearInterval(x);
    })
});