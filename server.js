
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
app.use(express.static('/'));


app.get('/', (_, res) => {
    res.sendFile(join(__dirname, 'index.html'));
    //visits++;
});

app.get('*', (req, res) => {
    const hasExtension = req.path.includes('.');
    const joinedPath = join(__dirname, '/', (hasExtension ? req.path : (req.path + '.html')));

    console.log(joinedPath)

    if (fs.existsSync(joinedPath))
        res.sendFile(joinedPath);
    else {
        res.writeHead(307, { 'Location': 'https://www.onekilobit.eu/404' });
        res.end();
    }
});



const server = http.createServer(app)
server.listen(80, () => { });


const port = new SerialPort({
    path: 'COM4',
    baudRate: 9600,
});


const parser = port.pipe(new ReadlineParser({ delimiter: '\n\r' }))


let gPitch, gRoll;
parser.on('data', function (data) {   
    const line = data.toString().split(' ');    
    gPitch = parseInt(line[0]);
    gRoll = parseInt(line[1]);
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