const express = require('express');
const app = express();

//chat-app 활설화 하기위해서 http 서버 연결
const http = require('http');

//socketIO 모듈
const socketIO = require('socket.io')

//textserver 연결
const {generateMessage , generateLocationMessage} = require('./src/utils/message');
//string 유효검사 and 문자공백
const {isRealString} = require('./src/utils/isRealString')


//http 서버 인자로 express 넣기
let server = http.createServer(app)
//socketIO 서버 연결
let io = socketIO(server)

//public 미들웨어 
const path = require('path');
const { Socket } = require('dgram');
const PublicPath = path.join(__dirname , '/src/public');
app.use(express.static(PublicPath))

//io 연결
io.on('connection' , (socket) => {
    console.log('A new user just connected');

    socket.on('join' , (params , callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('이름과 방제목을 입력해주세요!');
        }

        socket.join(params.room);

        socket.emit('newMessage' , generateMessage('admin' , 'Welcome to the Chat app!'))
    
        socket.broadcast.emit('newMessage' , generateMessage('Admin' , "New User Joined"));

        callback();
    })

    socket.on('createMessage' , (message , callback) => {
        console.log('createMessage' , message)
        io.emit('newMessage' , generateMessage(message.from , message.text))
        callback('This is The Server');
    })

    socket.on('createLocationMessage' , (coords) => {
        io.emit('newLocationMessage' , generateLocationMessage('Admin' , coords.lat , coords.lng))
    })





    socket.on('disconnect' , () => {
        console.log('User was disconnected')
    })    
})



const port = process.env.PORT || 5000;
server.listen(port , () => {
    console.log(`${port}포트 포트로 이동중.....`)
}) 