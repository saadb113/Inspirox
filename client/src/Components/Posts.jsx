import React, { useContext, useEffect, useRef, useState } from 'react'
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'
import Context from '../context/context'
import { Link } from 'react-router-dom'
import edit from '../Images/edit.png'
import DeleteImg from '../Images/delete.png'
import hide from '../Images/hide.png'
import unfollow from '../Images/unfollow.png'
import block from '../Images/block.png'
import commentimg from '../Images/comment.png'
import share from '../Images/share.png'
import emoji from '../Images/emoji.png'
import leftSliderbtn from '../Images/slidebtn.png'

const Posts = ({ openCommentFunc,element, userId }) => {
  const apis = useContext(Context)
  const [showPicker, setShowPicker] = useState(false);
  const [comment, setcomment] = useState("")
  const [displayImgIndex, setdisplayImgIndex] = useState(0)
  const [Modal, setModal] = useState(false)
  const [Comments, setComments] = useState({});
  const [ModalType, setModalType] = useState("")
  const [Edit, setEdit] = useState(false)
  const [editCaption, seteditCaption] = useState(element.caption)
  const [postOptions, setpostOptions] = useState(false)
  const [postModal, setpostModal] = useState(false)
  const [UserComment, setUserComment] = useState([])
  const [Liked, setLiked] = useState(element.likes.filter(x=>x._id == userId).length == 0)
  const [likeCount, setlikeCount] = useState(0)
  const PostEngagement = async (e, PostId, value) => {
    if (value == "Thought") {

      apis.postEngagement(e, PostId, value, userId, comment).then(data => {
        setUserComment([
          {user : data.user.username,dp :data.user.dp,name: data.user.name, time : data.time, comment}
        ,...UserComment])
      })
      setcomment("")
    } else {
      apis.postEngagement(e, PostId, value, userId, comment)
      if(Liked){
        setlikeCount(likeCount + 1)
        setLiked(!Liked)
      }else{
        setlikeCount(likeCount - 1)
        setLiked(!Liked)
      }
    }
  }

  const ImgSliderBtn = (value) => {
    if (value == "left" && displayImgIndex != 0) {

      setdisplayImgIndex(displayImgIndex - 1)
    } else if (value == "right" && displayImgIndex != element.media.length - 1) {
      setdisplayImgIndex(displayImgIndex + 1)
    }

  }
  const Delete = () => {
    const token = localStorage.getItem("token")
    fetch(`http://localhost:8000/deletePost${element._id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }).then(res => {
      return res
    }).then(data => {
      if (data.status == 200) {
        setModal(false)
        window.location.reload()
      }
    })

  }
  const EditPost = () => {
    const token = localStorage.getItem("token")
    fetch(`http://localhost:8000/EditPost${element._id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body : JSON.stringify({
        editCaption
      })
    }).then(res => {
      return res
    }).then(data => {
      if (data.status == 200) {
        setEdit(false)
      }
    })

  }



  const SharePost = ()=>{
    const token = localStorage.getItem("token")
    fetch(`http://localhost:8000/sharePost${element._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    }).then(res => {
      return res
    }).then(data => {
      if (data.status == 200) {
        setModal(false)
        window.location.reload()
      }
    })
  }
  const CommentUsersData = () => {
    const userRequests = element.comments.map((comment) => {
      return apis.getSpecificUser(comment.user);
    });
    Promise.all(userRequests)
      .then((responses) => {
        const updatedCommentUserData = {};
        responses.forEach((data, index) => {
          const { _id, username, name, dp } = data
          updatedCommentUserData[element.comments[index].user] = { _id, username, name, dp };
        });
        setComments(updatedCommentUserData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

  }


  const BlockUser = (id) => {
    apis.BlockUser(id)
    apis.addFollow(false, element.user._id, userId)

}
  useEffect(() => {
    CommentUsersData()
    setlikeCount(element.likes.length)

   
  }, [element])


  return (
    <>
    {
      !postModal ? "" : 
       <div className="PostImageModal">
        
        {element.media.length > 1 ? <div className="button">
                <img src={leftSliderbtn} alt="" onClick={() => ImgSliderBtn("left")} />

                <img style={{ transform: "rotate(180deg)" }} onClick={() => ImgSliderBtn("right")} src={leftSliderbtn} alt="" />
        </div> : ""} 
        <div className="ImageContainer">
        <img src='./Images/close.png' className='close' alt="" onClick={()=>setpostModal(false)}/>

       <img className='DisplayImage' src={`http://localhost:8000/uploads/${element.media[displayImgIndex]}`} alt="" />
        </div>
        
     </div>  
    }
   
      <div className={`post ${element.media.length == 0 ? "onlyTextPost" : "" }`}>
        {Modal &&
          <div className="usersModal">
<div className="bg" onClick={() => setModal(false)}></div>
            <div className="modal">

              {
                ModalType == "Likes" ?
                  <div className="likesModal">


                    <h2 className="topH">
                      Likes
                      <img src='./Images/close.png' alt="" onClick={() => setModal(false)} />

                    </h2>
                    <div className="input">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M21.0674 20.5L14.5674 14M16.7341 8.58333C16.7341 12.7715 13.3389 16.1667 9.15072 16.1667C4.96256 16.1667 1.56738 12.7715 1.56738 8.58333C1.56738 4.39517 4.96256 1 9.15072 1C13.3389 1 16.7341 4.39517 16.7341 8.58333Z" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <input type="text" placeholder='Search' />
                    </div>

                    {
                     element.likes && element.likes.map((element, index) => {

                        
                        return (

                          <div className="user" key={index}>
                            <img src={`http://localhost:8000/uploads/${element.dp}`} alt="" />
                            <Link to={`/user/${element._id}`} onClick={() => setOpenModal(false)} className="username">
                              <h2>{element.name}</h2>
                              <p>@{element.username}</p>
                            </Link>

                          </div>
                        )
                      })
                    }
                  </div> : ModalType == "Delete" ?
                  <div className="deleteConfirmation">
                    <h2>Are you sure you want to delete this post?</h2>
                    <div className="buttons">
                      <button className="btn" onClick={Delete}>
                        Confirm  </button>
                      <button className="btn" onClick={() => setModal(false)}>
                        Cancel  </button>
                    </div>
                  </div> :
                  <div className="deleteConfirmation">
                  <h2>Do you want to share this post on your timeline?</h2>
                  <div className="buttons">
                    <button className="btn" onClick={SharePost}>
                      Confirm  </button>
                    <button className="btn" onClick={() => setModal(false)}>
                      Cancel  </button>
                  </div>
                </div>  
               
              }

            </div>
          </div>
        }
        
        <div className="left Slider">
          <div className="slides">
            <img onClick={()=>setpostModal(true)} src={`http://localhost:8000/uploads/${element.media[displayImgIndex]}`} alt="" className='slide' />
          </div>
          {
            element.media.length > 1 ?
              <div className="button">
                <img src='./Images/slidebtn.png' alt="" onClick={() => ImgSliderBtn("left")} />
                <div className="nav">
                  {
                    element.media.map((e, i) => {
                      return (
                        <img src={`http://localhost:8000/uploads/${e}`} onClick={() => setdisplayImgIndex(i)} key={i} alt="" />

                      )
                    })
                  }
                </div>

                <img style={{ transform: "rotate(180deg)" }} onClick={() => ImgSliderBtn("right")} src='./Images/slidebtn.png' alt="" />
              </div> : ""
          }

        </div>
        

        <div className="right">
          <div className="Top">
            <div className="user">
              <Link to={`/user/${element.user._id}`} className="userDetails">

                <img src={`http://localhost:8000/uploads/${element.user.dp}`} alt="" />
                <div className="username">
                  <h2>{element.user.name}</h2>
                  <p>{element.time}</p>
                </div>
              </Link>
              <p className="description">
                {
                  Edit ?
                    <div className="editPost">
                      <textarea type="text" value={editCaption} onChange={(e) => seteditCaption(e.target.value)}  ></textarea>
                      <div className="buttons">

                      <button className="btn" onClick={EditPost}>Save</button>
                      <button className="btn" onClick={()=>{
                        setEdit(false)
                        seteditCaption(element.caption)}}>Cancel</button>
                      </div>
                    </div> :
                    editCaption
                }
              </p>
            </div>
            <div className="dropdown">

              <div className="delete dropdownButton" onClick={() => setpostOptions(!postOptions)}>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
              {
                postOptions &&
                element.user._id == userId ? 
                <div className="dropdownMenu">
                  <div style={{ color: "#333" }} onClick={()=>{
                    setEdit(true)
                    setpostOptions(false)}}><img src={edit} alt="" /> Edit</div>
                  <div style={{ color: "#F00" }} onClick={() => {
                    setModal(true)
                    setModalType("Delete")
                    setpostOptions(false)
                  }} ><img src={DeleteImg} alt="" /> Delete</div>
                </div> : postOptions &&
                element.user._id != userId ?
                <div className="dropdownMenu">
                <div style={{ color: "#333" }}><img src={hide} alt="" /> Hide Post</div>
                <div style={{ color: "#333" }}><img src={unfollow} alt="" /> Unfollow</div>
                <div onClick={()=>BlockUser(element.user._id)} style={{ color: "#F00" }} ><img src={block} alt="" /> Block </div>
              </div>  : ""
              }
            </div>
          </div>

          <div className="comments">
          {UserComment.map((comment, index) => {
             
             return (
               <div className="comment" key={index}>
                 <Link to={`/user/${comment.user}`} className="user">
                   <img src={`http://localhost:8000/uploads/${comment.dp}`} alt="" />
                   <div className="username">
                     <h2>{comment.name}</h2>
                     <p>{comment.time}</p>
                   </div>
                 </Link>
                 <div className="text">{comment.comment}</div>
               </div>
             );
           })}
            {element.comments.map((comment, index) => {
              const userimg = Comments[comment.user] || '';

              return (
                <div className="comment" key={index}>
                  <Link to={`/user/${comment.user}`} className="user">
                    <img src={`http://localhost:8000/uploads/${userimg.dp}`} alt="" />
                    <div className="username">
                      <h2>{userimg.name}</h2>
                      <p>{comment.time}</p>
                    </div>
                  </Link>
                  <div className="text">{comment.comment}</div>
                </div>
              );
            })}
            
          </div>

          <div className="engage">
            <div className={element.likes.filter(x=>x._id == userId).length > 0 ? "LikedPost" : ""} onClick={(event) => PostEngagement(event, element._id, 'Star')}>
            <svg style={{pointerEvents : "none"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" stroke="black" stroke-width="14px"/></svg>
              {likeCount}

            </div>
            <div onClick={()=>openCommentFunc(element.comments, Comments)}>
              <img src={commentimg} alt="" />
              {element.comments.length}
            </div>
            <div onClick={()=>{
              setModal(true)
              setModalType("Share")
            }}>
              <img src={share} alt="" />
              {element.shares.length}
            </div>
          </div>
          <div className="LikesCount">
            {element.likes[0] && element.likes.length != 0 ?
              <p>Liked by <Link to={`/user/${element.likes[0]._id}`}>{element.likes[0].username}</Link></p>
              : ""
            }
            {
              element.likes[1] && element.likes.length > 1 && element.likes.length < 3 ?
                <p>and <Link to={`/user/${element.likes[1]._id}`}>{element.likes[1].username}</Link></p>
                : element.likes.length > 2 ? <p> and <span onClick={() => {
                  setModal(true)
                  setModalType("Likes")
                }}>{element.likes.length - 1} Others</span> </p>
                  : ""
            }
          </div>

          <div className="writeComment">
            <img src={emoji} alt="" onClick={() => setShowPicker(true)} />
            <input type="text" placeholder='Write Something' value={comment} onChange={(e) => setcomment(e.target.value)} />
            {showPicker &&
              <div className="EmojiPicker">
                <Picker data={data} previewPosition="none" onEmojiSelect={(e) => {
                  setcomment(comment + e.native)
                  setShowPicker(!showPicker)
                }} />
              </div>

            }
            <button onClick={(event) => PostEngagement(event, element._id, "Thought")}>Post</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Posts