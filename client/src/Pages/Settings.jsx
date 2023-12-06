import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import Context from '../context/context'
import SideNav from '../Components/sideNav'
import close from '../Images/close.png'

const Settings = () => {
    const apis = useContext(Context)

    const [accordian, setaccordian] = useState("")
    const [PostsPrivacy, setPostsPrivacy] = useState("")
const [searchedUsers, setsearchedUsers] = useState([])
const [SelectedUsers, setSelectedUsers] = useState([])
    const [BlockedUsers, setBlockedUsers] = useState([])
    const [deleteAccount, setdeleteAccount] = useState(false)
    const [password, setpassword] = useState("")
    const [passwordError, setpasswordError] = useState(false)
 
    useEffect(() => {
     apis.GetBlockedUser().then((data)=>{
        setBlockedUsers(data.blockedbyMe)
        setSelectedUsers(data.postPrivacy)
        data.postPrivacy.length == 0 ? "" : setPostsPrivacy("custom") 
     })
     

     
    }, [])

    const DeleteUser = ()=>{
        fetch("http://localhost:8000/deleteUser", {
            method : "delete",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : localStorage.getItem("token")
            },
            body : JSON.stringify({
                password
            })
        }).then(res=>{
            console.log(res.status)
            if(res.status == 401){
                setpasswordError(true)
            }
        })
    }
    const searchUsers = (e)=>{
        if(e.target.value == ""){
        }else{
          apis.SearchUser(e).then(el => {
            console.log(el)
              setsearchedUsers([])
              setsearchedUsers(el)
            })
        }
    }


    const SendPrivacyData = (value,e)=>{
        if(value){

            if(SelectedUsers.filter(x=>x._id == e._id).length == 0){   
                setSelectedUsers([...SelectedUsers, e]) 
                setsearchedUsers([])
                apis.Privacy(value,e._id)
            }else{
                setsearchedUsers([])
            }
        }else{
            setSelectedUsers(SelectedUsers.filter(x=>x._id!=e._id))
            apis.Privacy(value,e._id)
        }
    }

    const PrivacyEveryOne = () =>{
        let users = []
        SelectedUsers.map(e=>{
            users.push(e._id)
        })
        apis.PrivacyEveryone(users)
    }
    
  return (
    <div className="mainContainer EditProfile">{
        deleteAccount &&
    
        <div className="deleteAccountModal">
        <div className="bg" onClick={()=>setdeleteAccount(!deleteAccount)}></div>
        <div className="modal">
            <img src={close} className='close' alt="" onClick={()=>setdeleteAccount(!deleteAccount)}/>
                    <h2>Are you sure you want to delete your account? Your all data will be deleted!</h2>
                    <div className="input">
                        <label htmlFor="">Enter Password</label>
                        <input type="password" onChange={(e)=>setpassword(e.target.value)}/>
                    </div>
                    {
                    passwordError &&
                        <p className="error">
                        Incorrect Password!
                    </p>
                    }
                    <div className="buttons">
                      <button className="btn" onClick={DeleteUser}>
                        Confirm  </button>
                      <button className="btn" onClick={()=>setdeleteAccount(!deleteAccount)}>
                        Cancel  </button>
                    </div>
        </div> 
        </div>
        }
        <SideNav authUser={[]} path={"settings"}/>
        <div className='center SettingsPage'>
            <h2>Settings</h2>
            <div className="accordians">
                <div className="accordian blockedAccounts">
                    <div className="accordianButton" onClick={()=>setaccordian("Blocked")}>
                        Blocked Accounts <img src="./Images/down.png" alt="" />
                    </div>
                    <div className={`accordianMenu ${accordian == "Blocked" ? "active" : ""}`}>
                        {
                        BlockedUsers.length == 0 ? <p style={{fontSize : "1.6rem"}}>No Users</p> :
                        BlockedUsers.map((e)=>{
                            return(
                        <div className="user">
                            <img src={`http://localhost:8000/uploads/${e.dp}`} alt="" />
                            <p>{e.name}</p>

                            <img onClick={()=>apis.UnBlockUser(e._id)} style={{width : "1.5rem", marginLeft : "1.5rem"}} src="./Images/closewhite.svg" alt="" />
                        </div>
                        )
                        }) 
                    }
                        
                    </div>
                </div>
                <div className="accordian blockedAccounts">
                    <div className="accordianButton" onClick={()=>setaccordian("Privacy")}>
                        Privacy <img src="./Images/down.png" alt="" />
                    </div>
                    <div className={`accordianMenu ${accordian == "Privacy" ? "active" : ""}`}>

                        <div className="privacySelect">
                            <div className="input">
                                <label htmlFor="">Who Can See My Posts?</label>
                                <select name="" id="" onChange={(e)=>setPostsPrivacy(e.target.value == "custom" ? e.target.value : PrivacyEveryOne())}>
                                    <option  value="everyone" >Everyone</option>
                                    <option selected={PostsPrivacy == "custom" ? true : false} value="custom">Custom</option>
                                </select>
                            </div>
                            <div className={`custom ${PostsPrivacy == "custom" ? "active" : ""}`}>
                                <div className="searchUser">
                                    <div class="input">
                                        <img src="./Images/search.png" alt="" style={{width: "2.2rem", height: "2.2rem"}} />
                                        <input type="text" placeholder="Search" onChange={(e)=>searchUsers(e)} />
                                    </div>
                                    <div className="searchedUsers">
                                        {
                                            searchedUsers && searchedUsers.map(e=>{
                                                return(

                                                
                                        <div className="user" onClick={()=>SendPrivacyData(true,e)}>
                                            <img src={`http://localhost:8000/uploads/${e.dp}`} alt="" />
                                            <p>{e.username}</p>
                                        </div>
                                        )
                                    })
                                }
                                    </div>
                                </div>
                                <div className="SelectedUsers">
                                    {
                                        SelectedUsers && SelectedUsers.map(e=>{
                                            return(

                                            
                                    <div className="user">
                                        <img src={`http://localhost:8000/uploads/${e.dp}`} alt="" />
                                        <p>{e.username}</p>

                                        <img onClick={()=>SendPrivacyData(false,e)} style={{width : "1.5rem", marginLeft : "1.5rem"}} src="./Images/closewhite.svg" alt="" />
                                    </div>
                                    )
                                })
                            }
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                </div>
            </div>
            <button className='deleteBtn'  onClick={()=>setdeleteAccount(!deleteAccount)}>
                <img src="./Images/delete.png" alt="" /> Delete Account
            </button>
        </div>
    </div>
  )
}

export default Settings