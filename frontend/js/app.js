const roomSelect = document.getElementById('room-select')
const btnJoin = document.getElementById('btn-join')
const chatForm = document.getElementById('chat-form')
const messages = document.getElementById('messages')
const usernameInput = document.getElementById('username')
const chatInput = document.getElementById('chat-message')
const userList = document.getElementById('users')

const socket = io("http://localhost:3500") // backend url

let currentUsername = null 
let currentRoom = null

btnJoin.addEventListener('click',()=>{
    const username = usernameInput.value
    const selectRoom = roomSelect.value

    if(currentRoom){
        socket.emit("leaveRoom",{
            room:currentRoom
        })
        messages.innerHTML=""
    }
    currentUsername = usernameInput.value.trim()
    currentRoom= selectRoom

    socket.emit('joinRoom',{
        room:currentRoom, 
        username
    })
    usernameInput.disabled=true
    roomSelect.disabled = true

    renderChatInRoom(currentRoom)
})
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const message = chatInput.value
    if(!currentRoom||!currentUsername){
        alert("Join a room first")
        return
    }

    socket.emit('chatRoom',{
        username: currentUsername,
        message,
        room:currentRoom,
    })


    // if(!currentUsername){
    //     currentUsername = usernameInput.value.trim()
    //     if(!usernameInput.value.trim()){
    //         alert("Enter username first")
    //         return
    //     }
    //     //socket.emit('join',currentUsername)
    //     renderChat();
    //     usernameInput.disabled=true
    // }

    // socket.emit('sendMessage',{
    //     username:currentUsername,
    //     message:chatInput.value
    // })
    chatInput.value=""
})

socket.on('chatRoom', (data)=>{
    const li = document.createElement('li')
    li.innerHTML = `
    <span>${data.username}:</span>
    ${data.message}`

    messages.appendChild(li)
})



const renderChatInRoom = async(roomString)=>{
    const roomNum = roomString.split('-')[1]

    const url = `http://localhost:3500/api/chat/room/${roomNum}`

    try{
        const res = await fetch(url)

        if(!res){
            console.error("server issue");
            return
        }
        const data = await res.json()
        writeChat(data)
    }catch(err){
        console.log(err)
    }

}

const writeChat=(data)=>{
    messages.innerHTML=""
    
    data.forEach(u => {
        const li = document.createElement('li')
        li.innerHTML = `
        <span>${u.username}:</span>
        ${u.message}`
        messages.appendChild(li)
    });

}