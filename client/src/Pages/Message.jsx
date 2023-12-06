// ChatApp.js (or any other React component)
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link, useParams } from 'react-router-dom'
import Context from "../context/context"
import SidebarRight from '../Components/sidebarRight';
import SideNav from "../Components/sideNav"

const socket = io('http://localhost:8000'); // Replace with your server URL

function ChatApp({ user, path = "message"}) {
  const apis = useContext(Context)
  const [username, setusername] = useState(user.username)
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [typing, settyping] = useState(false)





  const [Searchedusers, setSearchedusers] = useState([])
  const [SelectedChat, setSelectedChat] = useState([])
  const [chats, setchats] = useState([])
  const [GroupUsers, setGroupUsers] = useState([])
  const [sidePanel, setsidePanel] = useState("all")

  const [chatDetails, setchatDetails] = useState([])
  // const fetch chats = 
  const fetchChats = () => {
    apis.fetchChats().then((data) => {
      setchats(data)
    });
  }

  const FetchMsgs = (chatId)=>{
    apis.fetchMsgs(chatId).then((data) => {
      setMessages(data)
      socket.emit("join chat", chatId._id)
      setSelectedChat(chatId)
    });
  }
  useEffect(() => {
    fetchChats()
  }, [])
  useEffect(() => {
    socket.emit("setup", user && user)
   
  }, [user])

  
  const notification = (type, notif)=>{
   apis.Notification(type,notif)
    
  }
useEffect(() => {
  
  socket.on("recieved", (data)=>{
      if(SelectedChat.length == 0){
        
        // notification("msg",data.sender._id)
        console.log(data)
      }else{
      setMessages([data, ...messages])
    }
      fetchChats()
    })
  socket.on("typing", ()=>settyping(true))
  socket.on("stopTyping", ()=>settyping(false))
}, [messages])

  const SearchuserFunc = (e) => {
    apis.SearchUser(e).then((data) => {
      setSearchedusers(data)

    });
  }


  const handleSendMessage = (chatId) => {

    if(message == ""){
      return
    }else{
      apis.SendMsg(chatId, message).then((data) => {
        setMessages([data, ...messages])
        fetchChats()
        socket.emit("send", data)
        socket.emit("stopTyping", SelectedChat._id)
        setMessage("");
  
      })
  };
}

  const onEnterSend = (e, chatId) => {
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      e.preventDefault();
      handleSendMessage(chatId);
      e.target.value = ""
    }
  };
  const accesChat = async (userId) => {
    apis.accessChat(userId).then((data) => {
      if (!chats.find((c) => c._id == data._id)) {
        setchats([data, ...chats])
      }
      setSelectedChat(data)
      setSearchedusers([])
    });
  }

  const addGroupUsers = (e)=>{

    if(!GroupUsers.find((user)=> user._id == e._id)){
      setGroupUsers([...GroupUsers, e])
      console.log(GroupUsers)
      setSearchedusers([])
    }
  }
  const createGroupChat = ()=>{
    const token = localStorage.getItem("token")
    
    console.log(GroupUsers)
  }
  const getSender = (users)=>{
    if(users[0]._id == user._id){
      return users[1]  
    }else{
      return users[0]  
}
  }

  const typingHandler = (e)=>{
    setMessage(e.target.value)

    if(e.target.value != ""){
      // settyping(true)
      socket.emit("typing", SelectedChat._id);
      console.log("start")
    }
    if(e.target.value == ""){
      socket.emit("stopTyping", SelectedChat._id)
      console.log("stop")
    }
    
  }
  return (

    <>


      <div className="mainContainer MessagePage">
        

      <SideNav authUser={user} path={"messages"} />
        <div className={`Chats  ${SelectedChat.length == 0 ? "" : "hide"}`}>
          <img  className='logo' src="./Images/logo.png" style={{width : "20rem", marginTop : "2rem", marginBottom : "2rem"}} alt="" />
          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
              <path d="M21.4079 21.8958L14.7369 15.125M16.9606 9.48265C16.9606 13.8453 13.476 17.382 9.17767 17.382C4.8793 17.382 1.39478 13.8453 1.39478 9.48265C1.39478 5.11998 4.8793 1.58334 9.17767 1.58334C13.476 1.58334 16.9606 5.11998 16.9606 9.48265Z" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <input type="text" placeholder='Search' onChange={(e) => SearchuserFunc(e)} />
            <div className="searchResults" style={{ display: Searchedusers.length == 0 ? "none" : "flex" }}>
              {
                Searchedusers && Searchedusers.map((e) => {
                  return (

                    <div className="user" key={e.username} onClick={() => accesChat(e._id)}>
                      <img src={`http://localhost:8000/uploads/${e.dp}`} alt="" />
                      <div className="name">
                        <h2>{e.name}</h2>
                        <p>@{e.username}</p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          {/* <div className="ChatOptions">
            <button className="btn active" onClick={()=>setsidePanel("all")}>All</button>
            <button className="btn" onClick={()=>setsidePanel("chat")}>Direct</button>
            <button className="btn" onClick={()=>setsidePanel("groups")}>Groups</button>
          </div> */}
          <div className="userChats">
            {
              chats && chats.map((e) => {
                // console.log(e.users)
                return (

                 
                  <div className={`chat`} onClick={()=>FetchMsgs(e)}>
                    <img src={`http://localhost:8000/uploads/${getSender(e.users).dp}`} alt="" />
                    <div className="chatInner">
                      <h2>{getSender(e.users).name}</h2>
                      
                          <p>{e.latestMessage != null && e.latestMessage.sender._id == user._id ? 
                          "You : " + e.latestMessage.content :
                          e.latestMessage != null && e.latestMessage.sender._id !=user._id ? 
                          e.latestMessage.content :  "Start a Conversation"} {}</p>
                      
                    </div>
                    <div className="time">
                      <p>{e.latestMessage && e.latestMessage.time != null ? e.latestMessage.time : ""}</p>
                      {/* <span>2</span> */}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>      
        {/* {console.log(SelectedChat)} */}
        {SelectedChat.length == 0 ? <div className='messagesWindow center' style={{display : "flex", justifyContent: "center", alignItems : "center", fontSize : "2rem"}}>
          
          <img src="./Images/chat.svg" style={{width : "3rem", marginRight : "1rem" }} alt="" />
          Select a Chat
          
          </div> :  
          <div className="messagesWindow center">
            <Link to={`/user/${getSender(SelectedChat.users)._id}`} className="topUser">
              <img src={`http://localhost:8000/uploads/${getSender(SelectedChat.users).dp}`} alt="" />
              <div  className="name">
                <h2>{getSender(SelectedChat.users).name}</h2>
                <p>Click here for contact details</p>
              </div>
            </Link>
            <div className="messages">
            {
              !typing ? "" : 
              <div className="messageContainer typing received">
              <img src={`http://localhost:8000/uploads/${getSender(SelectedChat.users).dp}`} className='profile' alt="" />
                <div className="messageBox">
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="circle"></div>
                </div>
                
              </div>
            }
              {
                messages && messages.map((e)=>{
                  return(
                    
                   
              <div className={`messageContainer ${e.sender._id == user._id ? "sent" : "received"}`}>
                <img src={`http://localhost:8000/uploads/${e.sender.dp}`} className='profile' alt="" />
                <div className="messageBox">
                  <p>{e.content}</p>
                    <span>{e.time}</span>
                </div>
                
              </div>
              )
            })
          }
            
            </div>
            <div className="sendMessage">
              <div className="input">
                <input type="text" onChange={(e)=>typingHandler(e)}
                onKeyDown={(e) => onEnterSend(e, SelectedChat._id)} />
                <img src='./Images/ImageUploadIcon.png' alt="" />
              </div>
              <img src='./Images/sendMessage.png' alt="" onClick={()=>handleSendMessage(SelectedChat._id)} />
            </div>
          </div> 
        }

        {/* <SidebarRight /> */}

      </div>
    </>
  );
}

export default ChatApp;
