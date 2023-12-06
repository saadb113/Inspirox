import React from 'react'

import SidebarRight from '../Components/sidebarRight'
import Center from '../Components/Center'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const profile = ({username, user}) => {
    const {userId} = useParams()
    // console.log(userId)
    return (
    <div className='mainContainer profilePage'>
       <div className='sidebarRight'>
        <div className="card sideNav" style={{padding: "0"}}>
            <div className="userDetails">
                <div className="topUserProfile">
                    <div className="cover">
                        <img src='./Images/cover.png' alt="" />
                        <div className="username">
                            <img src='./Images/user.png' className='user' alt="" />
                            <div className="details">
                                <h2>@{user.username}</h2>
                                <p>{user.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="followers">
                    <div>
                        <h2>1</h2>
                        <p>Posts</p>
                    </div>
                    <div>
                        <h2>{user.followers.length}</h2>
                        <p>Followers</p>
                    </div>
                    <div>
                        <h2>{user.following.length}</h2>
                        <p>Following</p>
                    </div>
                </div>
                <div className="buttons">
                    <button className="btn">Edit Profile</button>
                    <button className="btn btnwhite">Settings</button>
                </div>
                
            </div>
        </div>
        <div className="card" style={{marginTop : "1.5rem"}}>
            <h2 className='topH'>About Me</h2>
            <div className="details">
                <div className='info'>
                    <p>location</p>
                    <p>karachi, Pakistan</p>
                </div>
                <div className='info'>
                    <p>Date of Birth:</p>
                    <p>14 May 2004</p>
                </div>
                <div className='info'>
                    <p>Email</p>
                    <p>saadbaig789@gmail.com</p>
                </div>
                <div className='info'>
                    <p>Phone</p>
                    <p>+92 3451962341</p>
                </div>
                <div className='info'>
                    <p>Relationship Status</p>
                    <p>Single</p>
                </div>
                <div className='info'>
                    <p>Gender</p>
                    <p>Male</p>
                </div>
                
                
            </div>
        </div>

        </div>
       
        <Center user={user} userId={userId}/>
        <SidebarRight />
    </div>
  )
}

export default profile