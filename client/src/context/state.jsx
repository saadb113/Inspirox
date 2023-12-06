import React, { useEffect } from 'react'
import Context from './context'
import { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const state = ( props) => {
const [token, settoken] = useState(localStorage.getItem("token"))
    const Authentication = ()=>{
      return new Promise((resolve, reject) => {

      const token = localStorage.getItem("token")
      fetch('http://localhost:8000/', {
        headers: {
          'Authorization': `${token}`, 
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          resolve(data.data[0])
        })
        .catch((error) => {
          reject(error)
        });
        });
    }

    // GET SPECIFIC USER  
   
    const getSpecificUser = (userId)=>{
      return new Promise((resolve, reject) => {
        // console.log(userId)
        fetch(`http://localhost:8000/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    
    }

    const AllUsers = ()=>{
      return new Promise( (resolve, reject) => {
         fetch(`http://localhost:8000/allusers`, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
      });
    
    }


    const addFollow = (value, otheruser, myuser)=>{
      return new Promise( (resolve, reject) => {

      fetch("http://localhost:8000/addfollow", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                value,
                otheruser,
                myuser
            }),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
        });
    }


    // PUBLISH POST FUNC 
    const PublishPost = async (e, caption, media, selectedUsers)=>{
      e.preventDefault()
      console.log(selectedUsers)
      const formData = new FormData(); 
      formData.append("caption", caption)
      formData.append("audience", selectedUsers)
      media.forEach((file) => {
        formData.append('images', file);
      });
      
        return new Promise((resolve, reject)=>{
          axios.post('http://localhost:8000/publishPost', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization" : token
          },
        }).then((res)=>{
            return res
        }).then(data=>{
          resolve(data)
          clg
        });
        });
        
      
    }

    // POST ENGAGEMENT 
    const postEngagement = async (e, PostId, value, username, comment )=>{
      
      let engage = ""
    // console.log(username)
    if (value == "Star") {

      e.target.classList.toggle("LikedPost")
      if (e.target.classList.contains("LikedPost")) {
        engage = "starAdd"
      } else {
        engage = "starSubt"
      }
      // console.log(engage)
      const SendLikecount = await fetch("http://localhost:8000/engage", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PostId,
          engage,
          user : username
        }),
      })
    } else if (value == "Thought") {
      let CommentObj = {
        user: username,
        comment
      }
      engage = "comment"
      return new Promise(async(resolve,reject)=>{

      const PostComment = await fetch("http://localhost:8000/engage", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PostId,
          engage,
          comment: CommentObj
        }),
      }).then(res=>{
        return res.json()
      }).then(data=>{
        resolve(data)
      })
    })

    }
  }

  // FETCH POST 
  const fetchPosts = (userId)=>{
    return new Promise((resolve, reject) => {
console.log(userId)
    fetch(`${userId == undefined ? "http://localhost:8000/allposts/" : "http://localhost:8000/post"+userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error);
      });
      });
  }
  const fetchChats = (userId)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/message`,
      {
        headers: {
          "Authorization": `${token}`
        }
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error);
      });
      });
  }
  const fetchMsgs = (chatId)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/message/getMessages?id=${chatId._id}`,
      {
        headers: {
          "Authorization": `${token}`
        }
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error);
      });
      });
  }
  const SearchUser = (e)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/message/search-user?search=${e.target == undefined ? e : e.target.value}`,
      {
        headers: {
          'Authorization': `${token}`,
        }
      }
    ).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error);
      });
      });
  }
  const SearchPosts = (e)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/searchPosts?search=${e}`
    ).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error);
      });
      });
  }
  const Notification = (type, notif)=>{
    fetch("http://localhost:8000/notification", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'authorization' : `${token}`
      },
      body: JSON.stringify({
          type,
          notification : notif
          
      }),
  })
  }

  const SendMsg = (chatId, message)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/message/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`,
        },
        body: JSON.stringify({ 
          content : message,
          chat : chatId
         })
      }
    ).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error);
      });
      });
  }
  const GetNotifications = (chatId, message)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/notifications`,
        {
          headers: {
            "Authorization": `${token}`
          }
        }).then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
            resolve(data)
        })
      });
  }
  const accessChat = (userId)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`,
        },
        body: JSON.stringify({ userId })
      }
    ).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error);
      });
      });
  }
const [userModal, setuserModal] = useState(false)
  const openFollowersModal = ()=>{
    setuserModal(!userModal)
    return userModal
  }
  const BlockUser = (id)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/blockUser${id}`, {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : token
            }
        })
      });
  }
  const Privacy = (value,users)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/privacy`, {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : token
            },
            body : JSON.stringify({
              users,value
            })
        })
      });
  }
  const PrivacyEveryone = (users)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/privacyeveryne`, {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : token
            },
            body : JSON.stringify({
              users
            })
        })
      });
  }
  const UnBlockUser = (id)=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/unblockUser${id}`, {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : token
            }
        })
      });
  }
  const GetBlockedUser = ()=>{
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:8000/getBlockedUsers`, {
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : token
            }
        }).then(res=>{
          return res.json()
        }).then(data=>{
          resolve(data)
        })
      });
  }

  // EDIT PROFILE 
  const EditProfile = async (username, data, profilePic) => {
    const formData = new FormData();
    formData.append("username", username); // Add this line to include the username
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("gender", data.gender);
    formData.append("rlp", data.rlp);
    formData.append("bio", data.bio);
    formData.append('profilePic', profilePic[0]);

    try {
        const resp = await axios.post('http://localhost:8000/editprofile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": token
            },
        });
        if (resp.status === 200) {
            alert(resp.data);
            window.location.reload();
        }
    } catch (error) {
        console.error(error);
    }
}

    



  return (
    <Context.Provider value={{Authentication,
      getSpecificUser, AllUsers, addFollow,
      PublishPost, postEngagement, fetchPosts,
      EditProfile,
      fetchChats, fetchMsgs, SearchUser, SendMsg, accessChat,
      BlockUser,GetBlockedUser,UnBlockUser,Privacy,PrivacyEveryone, SearchPosts
      ,Notification, GetNotifications,openFollowersModal
    }}>
        {props.children}
    </Context.Provider>
    )
}

export default state