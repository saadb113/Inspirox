
import React, { useState } from 'react'
import axios from "axios"


const StoryUpdates = ({UserId, StoryUpdate}) => {
// console.log(StoryUpdate)
const [StoryImage, setStoryImage] = useState("")
const [DisplayStory, setDisplayStory] = useState(false)

    const PostUpload = async (files) => {
        // e.preventDefault()
        // PostId = Posts.length + 1
        // console.log(files)
        const formData = new FormData();
        // formData.append("PostId", PostId)
        formData.append("UserId", UserId)
        // formData.append("desc", description)
        formData.append('story', files[0]);
        try {
          await axios.post('http://localhost:8000/storyupdate', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          alert('Images uploaded successfully');
        } catch (error) {
          console.error(error);
        }
      };

      
  return (
<>
    {
        DisplayStory &&
        <div className="StoryModal" onClick={()=>setDisplayStory(false)}>
            <img src={StoryImage} alt="" />
        </div>
    }
    <div className="StoryUpdates">
        
        <div className="allStoryUpdates">
            {/* {StoryUpdate && StoryUpdate.map((element, index)=>{
                return(

                    
            <div className="storyUpdate" onClick={()=>{
                setStoryImage(`http://localhost:8000/uploads/${element.img}`)
            setDisplayStory(true)} }>
                <img src='./Images/exUser.png' className="user" alt="" />
                <p>Morgan Stanley</p>
            </div>
                    )
            })
            } */}
              <div className="AddUpdate">
            <input type="file" onChange={(event)=>PostUpload(event.target.files)}/>
            <div className="userImg">
                <img src='./Images/user.png' alt="" />
                <img src='./Images/storyadd.png' alt="" />
            </div>
            <p>Add Updates</p>
        </div>
            <div className="storyUpdate">
              <div className="userimg">
                <img src='./Images/exUser.png' alt="" />
              </div>
              <p>john_doe12</p>
            </div>
            <div className="storyUpdate">
              <div className="userimg">
                <img src='./Images/exUser.png' alt="" />
              </div>
              <p>john_doe12</p>
            </div>
            <div className="storyUpdate">
              <div className="userimg">
                <img src='./Images/exUser.png' alt="" />
              </div>
              <p>john_doe12</p>
            </div>
            <div className="storyUpdate">
              <div className="userimg">
                <img src='./Images/exUser.png' alt="" />
              </div>
              <p>john_doe12</p>
            </div>
            <div className="storyUpdate">
              <div className="userimg">
                <img src='./Images/exUser.png' alt="" />
              </div>
              <p>john_doe12</p>
            </div>
            <div className="storyUpdate">
              <div className="userimg">
                <img src='./Images/exUser.png' alt="" />
              </div>
              <p>john_doe12</p>
            </div>
        </div>
    </div>
    </>
  )
}

export default StoryUpdates