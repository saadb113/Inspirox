import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Context from '../context/context'
import SideNav from '../Components/sideNav'

const Settings = ({user}) => {
    const apis = useContext(Context)
const [oldpassword, setoldpassword] = useState("")
const [newpassword, setnewpassword] = useState("")
const [confirmNewPassword, setconfirmNewPassword] = useState("")
const [Userimg, setUserimg] = useState([]) 
const [modal, setmodal] = useState(false)
const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    country: '',
    gender: '',
    rlp: '',
    bio: '',
  });
const [profilePic, setprofilePic] = useState([])
const [password, setpassword] = useState("")

const sendData = async ()=>{
    apis.EditProfile(user.username, formData, profilePic)

}

const changePassword = ()=>{
    const token = localStorage.getItem("token")
if(newpassword == confirmNewPassword){

    fetch("http://localhost:8000/changePassword", {
        headers : {
            "Content-Type" : "application/json",
            "Authorization" :  `${token}`
        },
        method : "POST",
        body : JSON.stringify({
            oldpassword,
            newpassword
        })
    })
}else{
    console.log("password not matched")
}
}
useEffect(() => {

    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        email: user.email,
        city: user.city,
        country: user.country,
        gender: user.gender,
        rlp: user.rlp,
        bio: user.bio,
      });
    }else{
        alert("refresh")
    }
  }, [user]);

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
    return (
        <div className="mainContainer EditProfile">
        <SideNav authUser={user} path={"settings"}/>

            <div className="center Settings">
                {

                modal &&
                <div className="ChangePasswordModal">

                    <div className="bg" onClick={()=>setmodal(false)}></div>
                    <div className="modal">
                        <div className="top">

                            <h2 className="topH">
                                Change Password
                            </h2>
                            <svg onClick={()=>setmodal(false)} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                <path d="M6.13317 18.2087L4.7915 16.867L10.1582 11.5003L4.7915 6.13366L6.13317 4.79199L11.4998 10.1587L16.8665 4.79199L18.2082 6.13366L12.8415 11.5003L18.2082 16.867L16.8665 18.2087L11.4998 12.842L6.13317 18.2087Z" fill="black" />
                            </svg>
                        </div>
                        <div className="inputs">

                            <div className="input">
                                <label htmlFor="">Old Password</label>
                                <input type="text" onChange={(e)=>setoldpassword(e.target.value)} placeholder='Enter Your Old Password' />
                            </div>
                            <div className="input">
                                <label htmlFor="" >New Password</label>
                                <input type="text" onChange={(e)=>setnewpassword(e.target.value)} placeholder='Enter New Password' />
                            </div>
                            <div className="input">
                                <label htmlFor="">Retype New Password</label>
                                <input type="text" onChange={(e)=>setconfirmNewPassword(e.target.value)} placeholder='Retype New Password' />
                            </div>
                            <button className="btn" onClick={changePassword}>Save</button>

                        </div>
                    </div>
                </div>
                }
                <h2 className="mainH">
                    Edit Profile
                </h2>
                <div className="profilePic">
                    <img src={Userimg.length == 0 ?`http://localhost:8000/uploads/${user.dp}` :  URL.createObjectURL(Userimg[0]) } alt="" />
                    <div className="change">
                        <h2>Change Profile Picture</h2>
                        <div className='btn'><input type="file" onChange={(e)=>
                            {
                                setprofilePic([...e.target.files])
                                setUserimg([...e.target.files])
                            }
                            }/> Upload Image</div>
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <label htmlFor="">Full Name</label>
                        <input type="text" name='name' value={formData.name} onChange={handleInputChange} placeholder='Enter Your Full Name' />
                    </div>
                    <div className="input">
                        <label htmlFor="">Email</label>
                        <input type="text" name='email' value={formData.email} onChange={handleInputChange} placeholder='Enter Your Email Address' />
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <label htmlFor="">Bio</label>
                        <textarea name='bio' value={formData.bio} onChange={handleInputChange} id="" cols="30" rows="10"></textarea>
                    </div>
                    <div className="inputs2">

                        <div className="input">
                            <label htmlFor="">Phone</label>
                            <input type="text" name='phone' value={formData.phone} onChange={handleInputChange} placeholder='Enter Your Email Address' />
                        </div>
                        <div className="input">
                            <label htmlFor="" >City</label>
                            <input type="text" name='city' value={formData.city} onChange={handleInputChange}placeholder='Enter Your Email Address' />
                        </div>
                    </div>
                </div>
                <div className="inputs">
                <div className="input">
                        <label htmlFor="">Gender</label>
                        <select name='gender' value={formData.gender} id="" onChange={handleInputChange}>
                            <option value="">Select Option</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="---">Other</option>
                        </select>
                    </div>
                    <div className="input">
                        <label htmlFor="">Country</label>
                        <input type="text" name='country' value={formData.country} onChange={handleInputChange}placeholder='Enter Your Full Name' />
                    </div>
                </div>
                <div className="inputs">
                    
                    <div className="input">
                        <label htmlFor="" >Relationship Status</label>
                        <select  name='rlp' value={formData.rlp} onChange={handleInputChange} id="" placeholder='Male'>
                            <option value="">Select Option</option>
                            <option value="Single">Single</option>
                            <option value="Engaged">Engaged</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>
                </div>

                <div className="buttons">
                    <div className="btn" onClick={()=>setmodal(true)}>
                        Change Password
                    </div>
                    <div className="btn" onClick={sendData}>
                        Save
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings