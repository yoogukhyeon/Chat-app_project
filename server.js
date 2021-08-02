
const express = require('express');
const app = express();

//chat-app 활설화 하기위해서 http 서버 연결
const http = require('http');

//socketIO 모듈
const socketIO = require('socket.io')


//http 서버 인자로 express 넣기
let server = http.createServer(app)
//socketIO 서버 연결
let io = socketIO(server)

//public 미들웨어 
const path = require('path');
const { Socket } = require('dgram');
const PublicPath = path.join(__dirname , '/Chat-app/public');
app.use(express.static(PublicPath))

//io 연결

io.on('connection' , (socket) => {
    console.log('A new user just connected')

    socket.on('disconnect' , () => {
        console.log('User was disconnected')
    })
    
})




const port = process.env.PORT || 5000;

server.listen(port , () => {
    console.log(`${port}포트 포트로 이동중.....`)
}) 

