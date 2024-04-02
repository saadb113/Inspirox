


import SideNav from "../Components/sideNav"
import SidebarRight from "../Components/sidebarRight"
import Center from "../Components/Center"
import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Friends from "./Friends"
import Context from "../context/context"
import BrokenLink from "../Images/brokenLink.svg"
import io from 'socket.io-client';
import SearchPage from "./SearchPage"
const socket = io('http://localhost:8000'); // Replace with your server URL


function App({ user, path }) {
  const apis = useContext(Context)
  const [User, setuser] = useState(user)
  const { userId } = useParams()
  const [AllPosts, setPosts] = useState([])
  const [BlockedUsersByMe, setBlockedUsersByMe] = useState([])
const [BlockedByOthers, setBlockedByOthers] = useState([])
  useEffect(() => {
    apis.fetchPosts(userId).then((data) => {
      setPosts(data);
      console.log(data)
    });
    if (userId) {
      apis.getSpecificUser(userId).then((data) => {
        setuser(data)
      });
    } else {
      setuser(user)
    }


    socket.emit("setup", user)

  }, [userId]);
  useEffect(() => {
    apis.GetBlockedUser().then((data)=>{
      setBlockedUsersByMe(data.blockedbyMe)
      setBlockedByOthers(data.blockedbyOthers)
   })
  //  socket.on("recieved", (data)=>{
  //   // console.log(data)
  //   apis.Notification("msg",data.sender._id) 
    
  // })
  }, [])
  return (
    <>
    {
       User.status == "active" &&
BlockedUsersByMe.filter(x=> x._id == userId).length == 0 && BlockedByOthers.filter(x=> x._id == userId).length == 0 ? 
      <div className="mainContainer">
        <SideNav path={path} user={User} authUser={user}  />
        {
          path == "friends" ?
            <Friends authUser={user} />
            : path == "search" ? 
            <SearchPage user={user} /> : 
            <Center authUser={user} user={User} Posts={AllPosts} />
        }

        <SidebarRight path={path} user={User} authUser={user} posts={AllPosts.filter(e => e.user._id == User._id).length}  />
      </div>
       : 
       <div className="mainContainer">
        <SideNav path={path} user={user} authUser={user} posts={AllPosts.filter(e => e.user.username == User.username)} />
         <div className="center brokenPage">
          <div>

          <img src={BrokenLink} alt="" />
          <p>Page Not Found</p>
          </div>
          <Link to="/" className="btn">
            Back To Home
          </Link>
         </div>
        <SidebarRight path={path} user={User} authUser={user} posts={AllPosts.filter(e => e.user._id == User._id).length}  />

       </div>
    }

    </>
  )
}

export default App
