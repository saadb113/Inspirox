import React, { useContext } from 'react'
import Context from '../context/context'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import FollowersModal from './followersModal'


const sidebarRight = ({ posts, authUser }) => {
    const [allUsers, setallUsers] = useState([])




    const { userId,keyword } = useParams()
    const [Modal, setModal] = useState("")
    const [OpenModal, setOpenModal] = useState(false)




    const apis = useContext(Context)
    useEffect(() => {
        apis.AllUsers().then((data)=>{
            setallUsers(data)
        })
    }, [])

    useEffect(() => {
       
        
    }, [])
    
    const NotificationButton = ()=>{
        setNotifDropdown(!NotifDropdown)
        if(true){
            const token = localStorage.getItem("token")
            fetch(`http://localhost:8000/notificationseen`,
            {method : "POST",
            headers: {
                "Authorization": `${token}`
            }
        })
    }
    setunsreadNotifications([])
    }
    const follow = (e, otheruser, value) => {
        e.target.classList.toggle("Followed")
        e.target.innerText = e.target.classList.contains("Followed") ? "UnFollow" : "Follow"
        apis.addFollow(value, otheruser,  authUser._id)
    }


   
    const openUserModal = (value, type)=>{
        setOpenModal(value)
        setModal(type)
      }

  return (
    <>
    {
OpenModal &&
<FollowersModal authUser={authUser} modalType={Modal} openUserModal={openUserModal}/>
}
    <div className='sidebarRight'>
       

       <div className="userCard">
                <div className="user">
                    <img src={`http://localhost:8000/uploads/${authUser.dp}`} alt="" />
                    <div className="username">
                        <h2>{authUser.name}</h2>
                        <p>@{authUser.username}</p>
                    </div>
                   

                </div>
                <p className='bio'>{authUser.bio}</p>
                <div className="follow">
                    <div>
                        <h2>{posts}</h2>
                        <p>POSTS</p>
                    </div>
                    <div onClick={()=> openUserModal(true,"followers")}>
                        <h2>{authUser.followers.length}</h2>
                        <p>FOLLOWERS</p>
                    </div>
                    <div onClick={()=> openUserModal(true,"following")}>
                        <h2>{authUser.following.length}</h2>
                        <p>FOLLOWING</p>
                    </div>
                </div>
                    <div className="buttons">
                        <Link to={"/editProfile"}  className="btn">Edit Profile</Link>
                        <Link to={"/settings"}  className="btn">Settings</Link>
                    </div>
            </div>
        <div className="card bottom">
            <h2 className='topH'>Suggestions For You</h2>
            <div className="userRowContainer">
{
allUsers && allUsers.map((element)=>{
    return(
        element._id == authUser._id || authUser.following.includes(element._id) ? "" :
        <div className="userRow">
                <img src={`http://localhost:8000/uploads/${element.dp}`} alt="" />
                <Link to={`/user/${element._id}`} className='details'>
                    <h2>{element.name}</h2>
                    <p>@{element.username}</p>
                </Link>
                <button className="btn" onClick={(event)=>follow(event, element._id, true)}>Follow</button>
            </div>
                )
            })
}
            
            
            </div>
        </div>
    </div>
</>

  )
}

export default sidebarRight