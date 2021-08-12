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
//users 클래스 가져오기 
const {Users} = require('./src/utils/users');

//http 서버 인자로 express 넣기
let server = http.createServer(app)
//socketIO 서버 연결
let io = socketIO(server)
//사용자 new 생성자 생성 
let users = new Users();

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
            return  callback('이름과 방제목을 입력해주세요!');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id , params.name , params.room)

        io.to(params.room).emit('updateUsersList' , users.getUserList(params.room));

        socket.emit('newMessage' , generateMessage('운영자 유국현' , `${params.name}님은 ${params.room} 채팅앱에 입장했습니다!`))
    
        socket.broadcast.to(params.room).emit('newMessage' , generateMessage('운영자 유국현' , `새로운 ${params.name}님이 참여했습니다`));

        callback();
    })

    socket.on('createMessage' , (message , callback) => {
        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage' , generateMessage(user.name , message.text))
        }
        callback('This is The Server');
    })

    socket.on('createLocationMessage' , (coords) => {
        let user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage' , generateLocationMessage(`${user.name}` , coords.lat , coords.lng))
        }
    })

    socket.on('disconnect' , () => {
        let user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage' , generateMessage('관리자' , `${user.name}님은 ${user.room} 채팅room을 떠났습니다!`))
        }
    })    
})


const port = process.env.PORT || 5000;
server.listen(port , () => {
    console.log(`${port}포트 포트로 이동중.....`)
}) 