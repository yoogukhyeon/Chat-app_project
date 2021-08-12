let socket = io();

function scrollToBottom(){
    let messagess = document.querySelector('#messages')
    let messages = document.querySelector('#messages').lastChild
    messagess.addEventListener('click' , function(){
        messages.scrollIntoView({behavior: "smooth" , block: "end" , inline: "nearest"});
    })    
}

socket.on('connect' , () => {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g , '","').replace(/\+/g , '').replace(/=/g, '":"') + '"}')

    socket.emit('join' , params , function (err) {  
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('No error');
        }
    })
})

socket.on('disconnect' , () => {
    console.log('disconnect from server')
});

socket.on('updateUsersList' , function(users){
    let ol = document.createElement('ol');

    users.forEach(function(user){
        let li = document.createElement('li');

        li.innerHTML = user;

        ol.appendChild(li);
    })

    let userList = document.querySelector('#users');
    userList.innerHTML = "";
    userList.appendChild(ol)
})


socket.on('newMessage' , function (message){
    const formattedTime = moment(message.createdAt).format('LT')
    const template = document.getElementById('message-template').innerHTML;
    const html = Mustache.render(template , {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    const div = document.createElement('div');
    div.innerHTML = html;

    document.getElementById('messages').appendChild(div);
    scrollToBottom();
 
});

socket.on('newLocationMessage' , function (message){
    const formattedTime = moment(message.createdAt).format('LT')
    console.log('newLocationMessage' ,  message);
    const template = document.getElementById('location-message-template').innerHTML;
    const html = Mustache.render(template , {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    const div = document.createElement('div');
    div.innerHTML = html;

    document.getElementById('messages').appendChild(div);
     
});

socket.emit('createMessage' , {
    from: 'John',
    text: 'Hey'
}, function(message){
    console.log('server got it.' , message)
})

document.querySelector('#submit-btn').addEventListener('click' , (e) => {
      e.preventDefault();

      socket.emit("createMessage" , {
        from: "User",
        text: document.querySelector('input[name="message"]').value
      }, function(){

      })
      document.querySelector('input[name="message"]').value = "";
})


document.querySelector('#send-location').addEventListener('click' , (e) => { 
   if(!navigator.geolocation){
       return alert('Geolocation is not supported by your browser');
   }

   navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
   } , function(){
       alert('Unable to fetch location')
   })

})
