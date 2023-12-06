import React, { useContext, useEffect } from 'react'

import { useState } from 'react'
import Context from '../context/context'
import { Link } from 'react-router-dom'

const Friends = ({authUser}) => {

  const [users, setusers] = useState([])
  const apis = useContext(Context)
  const [BlockedUsersByMe, setBlockedUsersByMe] = useState([])
const [BlockedByOthers, setBlockedByOthers] = useState([])
  const follow = (e,otheruser, value) => {
    e.target.classList.toggle("Followed")
    e.target.innerText = e.target.classList.contains("Followed") ? "UnFollow" : "Follow"
  apis.addFollow(value, otheruser,  authUser._id)
  }
  useEffect(() => {
    apis.AllUsers().then((data)=>{
      setusers(data)
    })

    apis.GetBlockedUser().then((data)=>{
      setBlockedUsersByMe(data.blockedbyMe)
      setBlockedByOthers(data.blockedbyOthers)
   })
}, [])

  return (

      <div className="center FriendsPageCards">
        {
          users.map((element, index) => {
            return (
             
              element._id == authUser._id  || authUser.following.includes(element._id) ? "" :
              BlockedUsersByMe.filter(x=> x._id == element._id).length == 0 && BlockedByOthers.filter(x=> x._id == element._id).length == 0 ? 
              <div  className="usercard" key={index}>
                <Link to={`/user/${element._id}`} className='top'>

                <div className="profile">
                  <img src={`http://localhost:8000/uploads/${element.dp}`} alt="" className='user' />
                </div>
                <h2>{element.name}</h2>
                <p>@{element.username}</p>
                </Link>
                <div className="buttons">
                  <button className="btn" onClick={(event) => follow(event,element._id, true)}>Follow</button>
                  <button className="btn">Remove</button>
                </div>
              </div> : ""
            )
          })

        }

      </div>
  )
}

export default Friends