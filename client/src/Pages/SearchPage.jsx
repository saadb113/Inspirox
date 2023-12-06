import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import Context from '../context/context'
import PostsContainer from '../Components/PostsContainer'
import { Link, useParams } from 'react-router-dom'
const SearchPage = ({user }) => {
    const {keyword} = useParams()
    const apis = useContext(Context)
    const [users, setusers] = useState([])
    const [SearchedPosts, setSearchedPosts] = useState([])
    const [BlockedUsersByMe, setBlockedUsersByMe] = useState([])
    const [BlockedByOthers, setBlockedByOthers] = useState([])
    const follow = (e,otheruser, value) => {
        e.target.classList.toggle("Followed")
        e.target.innerText = e.target.classList.contains("Followed") ? "UnFollow" : "Follow"
      apis.addFollow(value, otheruser,  authUser._id)
      }
  useEffect(() => {
      apis.GetBlockedUser().then((data)=>{
        setBlockedUsersByMe(data.blockedbyMe)
        setBlockedByOthers(data.blockedbyOthers)
     })
    
     apis.SearchUser(keyword).then(e=>{
        setusers(e)
     })
     apis.SearchPosts(keyword).then(e=>{
        setSearchedPosts(e)
     })
     
   

}, [user])
  return (
    <div className="center FriendsPageCards" style={{flexDirection : "column"}}>
        <h2 className="topH">
        PEOPLES
      </h2>
            <div className="SearchedUsers">

        { users &&
          users.map((element, index) => {
            return (
             
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
              </div>
            )
          })

        }
            </div>
            <PostsContainer  user={user} Posts={SearchedPosts}/>

    
    </div>
  )
}

export default SearchPage