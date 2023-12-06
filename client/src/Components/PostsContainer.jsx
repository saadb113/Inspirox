import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Context from '../context/context'
import PostsElement from "./Posts"
import close from "../Images/close.png"

const PostsContainer = ({user,Posts}) => {
    const apis = useContext(Context)
    const [userId, setusername] = useState(user._id)
    const [BlockedByOthers, setBlockedByOthers] = useState([])
    const [postPrivacy, setpostPrivacy] = useState([])
  const [BlockedUsersByMe, setBlockedUsersByMe] = useState([])
  const [commentModal, setcommentModal] = useState(false)
  const [commentData, setcommentData] = useState([])
    useEffect(() => {
        apis.GetBlockedUser().then((data) => {
          setBlockedUsersByMe(data.blockedbyMe)
          setBlockedByOthers(data.blockedbyOthers)
          setpostPrivacy(data.postPrivacy)
        })
      }, [])

      const openCommentModal = (comments, commentUser)=>{
        let commentsdata = []
        comments.map(e=>{
          commentsdata.push({
            name : commentUser[e.user].name,
            dp : commentUser[e.user].dp,
            comment : e.comment,
            time : e.time
          })
        })
     setcommentData(commentsdata)
    setcommentModal(!commentModal)
      }
  return (
    <>
    
    {
          commentModal ? 
          <div className="commentsModal">
          <div className="modal">
            <h2 className="topH">
              Comments 
              <img src={close} onClick={()=>setcommentModal(!commentModal)} alt="" />
            </h2>
            <div className="Comments">

            {
              commentData.length == 0 ? "No Comments" :  commentData.map(e=>{
                return(

                
            <div className="comment">
              <div className="user">
                <img src={`http://localhost:8000/uploads/${e.dp}`} alt="" />
                <div className="username">
                  <h2>{e.name}</h2>
                  <p>{e.time}</p>
                </div>
              </div>
              <p className='commentText'>
                {e.comment}
                </p>
            </div>
            )
          })
        }
            </div>

          </div>
    </div> : ""
        }

    <div className="postsContainer">
    <h2 className="topH">
        POSTS
      </h2>
      <div className="Posts">
      {
          Posts && Posts.map((element, index) => {

            return (

              postPrivacy.filter(x=>x._id == element.user._id).length != 0 ? "" :   // CHECK PRIVACY SETTINGS 
              element.audience.includes(userId) ? "" : //CHECK POST AUDIENCE
              BlockedUsersByMe.filter(x => x._id == element.user._id).length == 0 && BlockedByOthers.filter(x => x._id == element.user._id).length == 0 ? // CHECK IF USER BLOCKED OR NOT
              <PostsElement openCommentFunc={openCommentModal} key={index} user={user} element={element} userId={userId} />
              : ""
            )
          })

        }
      </div>
    </div>
    </>
  )
}

export default PostsContainer