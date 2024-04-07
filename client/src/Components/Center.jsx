import React, { useContext, useEffect } from 'react'
import { useState } from "react"
import PostsElement from "./Posts"
import StoryUpdates from "./StoryUpdates"
import Context from '../context/context'
import PostsContainer from './PostsContainer'
import close from '../Images/close.png'
import search from '../Images/search.png'
import closewhite from '../Images/closewhite.svg'
import ImageUploadIcon from '../Images/ImageUploadIcon.png'
import { Link, useParams } from 'react-router-dom'
import FollowersModal from './followersModal'

// import Posts from './Posts'
const Center = ({ user, authUser, Posts }) => {
  const apis = useContext(Context)
  const [PostsModal, setPostsModal] = useState(false)
  const [description, setdescription] = useState("")
  const [ImagesArr, setImagesArr] = useState([]);
  const [audience, setaudience] = useState("")
  const [Selectedusers, setSelectedusers] = useState([])
  const [searchedUsers, setsearchedUsers] = useState([])
  const [userOptions, setuserOptions] = useState(false)
  const [Modal, setModal] = useState("")

  const [OpenModal, setOpenModal] = useState(false)
  const ImgUpload = (e) => {
    if (e.target.files.length > 5) {
      alert("Maximum 5 Images Allowed")
      e.target.value = null
    } else {
      setImagesArr([...e.target.files])
    }
  }

  const PostUpload = async (e) => {
    let SelectedUsersArr = []

    if (Selectedusers.length != 0) {
      Selectedusers.map(e => {
        SelectedUsersArr.push(e._id)
      })
    }
    // console.log(SelectedUsersArr)
    apis.PublishPost(e, description, ImagesArr, SelectedUsersArr).then(data => {
      console.log(data)
      if (data.status == 200) {
        alert("Post Published")
        setPostsModal(false)
        window.location.reload()
      }
    })
    const token = localStorage.getItem("token")
    console.log(token)
    fetch('http://localhost:8000/postnotification', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      }
    })
  };
  const removeImg = (index) => {
    const files = [...ImagesArr]
    files.splice(index, 1)
    setImagesArr(files)
    console.log(ImagesArr)
  }


  const SearchUsers = (e) => {
    if (e.target.value == "") {
    } else {
      apis.SearchUser(e).then(el => {
        setsearchedUsers([])
        setsearchedUsers(el)
      })
    }
  }
  const BlockUser = () => {
    apis.BlockUser(user._id)
    apis.addFollow(false, user._id, authUser._id)

  }
  const follow = (e, otheruser, value) => {
    e.target.classList.toggle("Followed")
    e.target.innerText = e.target.classList.contains("Followed") ? "UnFollow" : "Follow"
    apis.addFollow(value, otheruser, authUser._id)
  }

  const openUserModal = (value, type)=>{
    setOpenModal(value)
    setModal(type)
  }


  return (
    <>

      <div className="center">
        {
          PostsModal ?
            <div className="PostMdalContainer">

              <div className="PostModal">
                <div className="top">
                  <h2 className="topH">
                    Write Something
                  </h2>
                  <img src={close} alt="" onClick={() => setPostsModal(!PostsModal)} />
                </div>
                <div className="user">
                  <img src={`http://localhost:8000/uploads/${authUser.dp}`} alt="" />
                  <div className="audience">
                    <div className="username">{authUser.username}</div>
                    <select name="" id="" onChange={(e) => setaudience(e.target.value)}>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>


                  </div>
                </div>
                <form action="">
                  <textarea onChange={(e) => setdescription(e.target.value)} placeholder="What's on your mind?"></textarea>
                  <div className="DisplayImgs">
                    {ImagesArr &&
                      ImagesArr.map((element, index) => {
                        return (
                          <div className="img" key={index}>
                            <img src={close} alt="" onClick={() => removeImg(index)} className='close' />
                            <img src={URL.createObjectURL(element)} alt="" />
                          </div>
                        )
                      })
                    }
                  </div>
                  {
                    audience != "private" ? "" :
                      <div className="searchUsers">
                        <div class="input">
                          <img src={search} alt="" style={{ width: "2.2rem", height: "2.2rem" }} />
                          <input onChange={(e) => SearchUsers(e)} type="text" placeholder="Search" />
                        </div>
                        <div class="searchedUsers" style={searchedUsers && searchedUsers.length == 0 ? {} : {boxShadow : "0px 10px 18px 6px rgba(203, 203, 203, 0.33)"}}>
                          {
                            searchedUsers && searchedUsers.map((e) => {
                              return (

                                <div onClick={() => {
                                  if (Selectedusers.filter(x => x._id == e._id).length == 0) {
                                    setSelectedusers([...Selectedusers, e])
                                    setsearchedUsers([])
                                  } else {
                                    setsearchedUsers([])
                                  }

                                }} class="user">
                                  <img src={`http://localhost:8000/uploads/${e.dp}`} alt="" /><p>{e.username}</p>
                                </div>
                              )
                            })
                          }
                        </div>
                        <div className="selectedUsers">
                          {
                            Selectedusers && Selectedusers.map((e) => {
                              return (
                                <p>{e.name} <img onClick={() => setSelectedusers(Selectedusers.filter(x => x._id != e._id))} src={closewhite} alt="" /></p>
                              )
                            })
                          }

                        </div>
                      </div>
                  }
                  <div className="addToPost">
                    <p>Add to your post</p>
                    <div className="img">
                      <img src={ImageUploadIcon} alt="" />
                      <input type="file" title="" multiple accept=".png,.jpg,.mp4,.pdf,.doc,.xls,.docx,.xlsx,.txt" onChange={(event) => ImgUpload(event)} />
                    </div>

                  </div>

                  <button className='btn' onClick={(event) => PostUpload(event)}>Submit</button>
                </form>
              </div>
            </div>

            : ""
        }

{
OpenModal &&
<FollowersModal authUser={user && user} modalType={Modal} openUserModal={openUserModal}/>
}



        <div className={`userProfile ${authUser._id == user._id ? "authUserDetails" : ""}`}>
          <div className={`userDetails`}>
            

<div className="left">
          <img src={`http://localhost:8000/uploads/${user.dp}`} class="profilePic" alt="" />


              <div className="username">
                <p>{user.name}</p>
                <p>@{user.username}</p>
                <p className="bio">
                  {user.bio}
                </p>
              </div>
</div>
              <div className="right">

                <div className="followers">
                  <div>
                    <h2>
                      {Posts.length}
                    </h2>
                    <p>Posts</p>
                  </div>
                  <div onClick={()=> openUserModal(true,"followers")}>
                    <h2>
                      {user.followers.length}

                    </h2>
                    <p>Followers</p>
                  </div>
                  <div onClick={()=> openUserModal(true,"following")}>
                    <h2>
                      {user.following.length}
                    </h2>
                    <p>Following</p>
                  </div>

                </div>
                <div className="buttons">
                  {
                    authUser._id == user._id ?
                      <Link to="/editProfile" className='btn' >
                        Edit Profile
                      </Link> :
                      authUser.following.includes(user._id) ?
                        <button className='btn Followed' onClick={(event) => follow(event, user._id, false)}>
                          Unfollow
                        </button> :
                        <button className='btn ' onClick={(event) => follow(event, user._id, true)}>
                          Follow
                        </button>
                  }
                  {authUser._id == user._id ?
                    <Link to="/settings" className="btn">
                      Settings
                    </Link>
                    : <button className="btn">
                      Message
                    </button>
                  }             </div>
              </div>

            

            
          </div>
         { authUser._id != user._id ? <div class="dropdown">
            <div class="options" onClick={() => setuserOptions(!userOptions)}>
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="circle"></div>
            </div>
            {console.log(userOptions)}
            {
              userOptions ?
                <div class="dropdownMenu">
                  <p>Report</p>
                  <p onClick={BlockUser} style={{ color: "rgb(255, 0, 0)" }}>
                    <img src="./Images/block.png" alt="" /> Block</p>
                </div> : ""
            }
          </div> : ""}

        </div>
        <div className="writeSomething" onClick={() => setPostsModal(!PostsModal)}>
          <h2>Write Something</h2>
          <div className="inputField">
            <div className="left">
              <img src={`http://localhost:8000/uploads/${user.dp}`} alt="" />
              <p>What’s on your mind?</p>
            </div>
            <div className="right">
              <img src='./Images/ImageUploadIcon.png' alt="" />
            </div>
          </div>
        </div>
        <PostsContainer  user={authUser} Posts={Posts} />

      </div>


      {/* <div className=""></div> */}
    </>


  )
}

export default Center