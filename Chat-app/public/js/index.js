

let socket = io();
socket.on('connect' , () => {
    console.log('connected to server');
})

socket.on('disconnect' , () => {
    console.log('disconnect from server')
})

socket.on('newMessage' , function (message){
    console.log('newMessage' ,  message);
});

