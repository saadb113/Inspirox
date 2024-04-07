import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Context from '../context/context'
import close from '../Images/close.png'
import Logo from '../Images/logo.png'
import search from '../Images/search.png'

const sideNav = ({ authUser, path }) => {
    const apis = useContext(Context)
    const [profileDropdown, setprofileDropdown] = useState(false)
    const [NotifDropdown, setNotifDropdown] = useState(false)
    const [Notifications, setNotifications] = useState([])
    const [unsreadNotifications, setunsreadNotifications] = useState([])
const [mobnav, setmobnav] = useState(false)
  const [searchHide, setsearchHide] = useState(false)

const [searchInput, setsearchInput] = useState("")





    const SendSearch = (e)=>{
        if(e.key == "Enter"){
            window.location.href=`/search/${searchInput}`
        }
    }

useEffect(() => {
    apis.GetNotifications().then(data=>{
        setNotifications(data)
        setunsreadNotifications(data.filter(x=>x.seen == false))
    })
}, [])


const NotificationButton = ()=>{
    setNotifDropdown(!NotifDropdown)
    if(true){
        const token = localStorage.getItem("token")
        fetch(`http://localhost:8000/notificationseen`,
        {method : "POST",
        headers: {
            "Authorization": `${token}`
        }
    })
}
setunsreadNotifications([])
}
   
    return (
        <>
        <div className="mobileheader">
            <div className='ham' onClick={()=>setmobnav(!mobnav)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                </div>
                <img src={Logo} className='logo' alt="" />

        </div>
        <div className={`sideNav ${mobnav ? "active" : ""}`}>
         
                <div className={`searchBox ${searchHide ? "active" : ""}`}>
                <h2 className="topH">SEARCH <img onClick={()=>setsearchHide(!searchHide)} src={close} alt="" /></h2>
                <div  className={`input ${searchHide}`}>
                    <input value={searchInput} onChange={(e)=>setsearchInput(e.target.value)} onKeyDown={(e)=>SendSearch(e)} type="text" placeholder='Search' />
                    <Link onClick={()=>setsearchHide(!searchHide)} to={`/search/${searchInput}`} >
                    <img  src={search}  alt="" />
                    </Link>
                </div>
            </div>
            

            <div className="header">
                
                <img src={Logo} className='logo' alt="" />
            </div>
            <div className="navigation">
                
                <div className="navItems">
                
                    <Link to="/" className={`navItem ${path == "home" ? "active" : ""} `}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <g clipPath="url(#clip0_684_299)">
                                <path d="M21.9924 10.9785C21.9924 11.752 21.4194 12.3578 20.7701 12.3578H19.5479L19.5747 19.2414C19.5747 19.3574 19.567 19.4734 19.5556 19.5895V20.2812C19.5556 21.2309 18.8719 22 18.0278 22H17.4167C17.3747 22 17.3326 22 17.2906 21.9957C17.2372 22 17.1837 22 17.1302 22H15.8889H14.9722C14.1281 22 13.4444 21.2309 13.4444 20.2812V19.25V16.5C13.4444 15.7395 12.8983 15.125 12.2222 15.125H9.77778C9.10174 15.125 8.55556 15.7395 8.55556 16.5V19.25V20.2812C8.55556 21.2309 7.87188 22 7.02778 22H6.11111H4.89271C4.83542 22 4.77813 21.9957 4.72083 21.9914C4.675 21.9957 4.62917 22 4.58333 22H3.97222C3.12813 22 2.44444 21.2309 2.44444 20.2812V15.4688C2.44444 15.4301 2.44444 15.3871 2.44826 15.3484V12.3578H1.22222C0.534722 12.3578 0 11.7563 0 10.9785C0 10.5918 0.114583 10.248 0.381944 9.94727L10.175 0.34375C10.4424 0.0429688 10.7479 0 11.0153 0C11.2826 0 11.5882 0.0859375 11.8174 0.300781L21.5722 9.94727C21.8778 10.248 22.0306 10.5918 21.9924 10.9785Z" />
                            </g>
                            <defs>
                                <clipPath id="clip0_684_299">
                                    <rect width="22" height="22" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <p>
                        Home
                        </p>
                    </Link>
                    <a  onClick={()=>setsearchHide(!searchHide)}  className="navItem">
                        
                        <img  src={search}  alt="" />

                        <p>

                        Search
                        </p>
                    </a>
                    <Link to="/message" className={`navItem ${path == "messages" ? "active" : ""} `}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <path d="M0.924472 15.2463C-0.399747 16.0022 -0.2767 18.0178 1.13541 18.6037L9.35611 22.0315V28.0842C9.35611 29.1448 10.2116 30.0002 11.2721 30.0002C11.8405 30.0002 12.3795 29.7483 12.7428 29.3088L16.3756 24.9553L23.6354 27.9787C24.7428 28.4416 26.026 27.7151 26.2077 26.5315L29.9577 2.15647C30.069 1.44749 29.7585 0.732646 29.1667 0.328349C28.5749 -0.0759478 27.8014 -0.111104 27.1745 0.246318L0.924472 15.2463ZM3.97721 16.7405L23.987 5.30882L11.1198 19.6877L11.1901 19.7463L3.97721 16.7405ZM23.612 24.926L13.8503 20.8537L26.3952 6.83226L23.612 24.926Z" />
                        </svg>
                        <p>

                        Messages
                        </p>
                    </Link>
                    <Link to="/friends" className={`navItem ${path == "friends" ? "active" : ""} `}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="0 0 30 24" fill="none">
                            <path d="M6.75 0.000244141C7.74456 0.000244141 8.69839 0.395332 9.40165 1.09859C10.1049 1.80185 10.5 2.75568 10.5 3.75024C10.5 4.7448 10.1049 5.69863 9.40165 6.40189C8.69839 7.10515 7.74456 7.50024 6.75 7.50024C5.75544 7.50024 4.80161 7.10515 4.09835 6.40189C3.39509 5.69863 3 4.7448 3 3.75024C3 2.75568 3.39509 1.80185 4.09835 1.09859C4.80161 0.395332 5.75544 0.000244141 6.75 0.000244141ZM24 0.000244141C24.9946 0.000244141 25.9484 0.395332 26.6517 1.09859C27.3549 1.80185 27.75 2.75568 27.75 3.75024C27.75 4.7448 27.3549 5.69863 26.6517 6.40189C25.9484 7.10515 24.9946 7.50024 24 7.50024C23.0054 7.50024 22.0516 7.10515 21.3484 6.40189C20.6451 5.69863 20.25 4.7448 20.25 3.75024C20.25 2.75568 20.6451 1.80185 21.3484 1.09859C22.0516 0.395332 23.0054 0.000244141 24 0.000244141ZM0 14.0018C0 11.2409 2.24062 9.00024 5.00156 9.00024H7.00312C7.74844 9.00024 8.45625 9.1643 9.09375 9.45493C9.03281 9.79243 9.00469 10.144 9.00469 10.5002C9.00469 12.2909 9.79219 13.8987 11.0344 15.0002C11.025 15.0002 11.0156 15.0002 11.0016 15.0002H0.998437C0.45 15.0002 0 14.5502 0 14.0018ZM18.9984 15.0002C18.9891 15.0002 18.9797 15.0002 18.9656 15.0002C20.2125 13.8987 20.9953 12.2909 20.9953 10.5002C20.9953 10.144 20.9625 9.79712 20.9062 9.45493C21.5437 9.15962 22.2516 9.00024 22.9969 9.00024H24.9984C27.7594 9.00024 30 11.2409 30 14.0018C30 14.5549 29.55 15.0002 29.0016 15.0002H18.9984ZM10.5 10.5002C10.5 9.30677 10.9741 8.16218 11.818 7.31826C12.6619 6.47435 13.8065 6.00024 15 6.00024C16.1935 6.00024 17.3381 6.47435 18.182 7.31826C19.0259 8.16218 19.5 9.30677 19.5 10.5002C19.5 11.6937 19.0259 12.8383 18.182 13.6822C17.3381 14.5261 16.1935 15.0002 15 15.0002C13.8065 15.0002 12.6619 14.5261 11.818 13.6822C10.9741 12.8383 10.5 11.6937 10.5 10.5002ZM6 22.7487C6 19.2987 8.79844 16.5002 12.2484 16.5002H17.7516C21.2016 16.5002 24 19.2987 24 22.7487C24 23.4377 23.4422 24.0002 22.7484 24.0002H7.25156C6.5625 24.0002 6 23.4424 6 22.7487Z" />
                        </svg>
                        <p>

                        Friends
                        </p>
                    </Link>
                    <Link to={`/user/${authUser._id}`} className={`navItem ${path == "profile" ? "active" : ""} `}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="27" viewBox="0 0 23 27" fill="none">
                            <path d="M11.5019 13.1452C13.245 13.1452 14.9168 12.4528 16.1493 11.2202C17.3819 9.98762 18.0744 8.31588 18.0744 6.57274C18.0744 4.82961 17.3819 3.15787 16.1493 1.92528C14.9168 0.692702 13.245 0.000244141 11.5019 0.000244141C9.75874 0.000244141 8.087 0.692702 6.85442 1.92528C5.62183 3.15787 4.92938 4.82961 4.92938 6.57274C4.92938 8.31588 5.62183 9.98762 6.85442 11.2202C8.087 12.4528 9.75874 13.1452 11.5019 13.1452ZM9.15529 15.6099C4.09754 15.6099 0 19.7075 0 24.7652C0 25.6073 0.682924 26.2902 1.52503 26.2902H21.4787C22.3208 26.2902 23.0038 25.6073 23.0038 24.7652C23.0038 19.7075 18.9062 15.6099 13.8485 15.6099H9.15529Z" />
                        </svg>
                        <p>

                        My Account
                        </p>
                    </Link>
                    <Link to="/settings" className="navItem">
                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none">
                            <path d="M28.1975 9.76196C28.385 10.2717 28.2268 10.8401 27.8225 11.2034L25.2854 13.512C25.3499 13.9983 25.385 14.4963 25.385 15.0002C25.385 15.5042 25.3499 16.0022 25.2854 16.4885L27.8225 18.7971C28.2268 19.1604 28.385 19.7288 28.1975 20.2385C27.9397 20.9358 27.6292 21.6038 27.2717 22.2483L26.9964 22.7229C26.6096 23.3674 26.176 23.9768 25.7014 24.551C25.3557 24.9729 24.7815 25.1135 24.2659 24.9495L21.0022 23.9124C20.2171 24.5159 19.3499 25.0198 18.4241 25.4006L17.6917 28.7463C17.5745 29.2795 17.1643 29.7014 16.6253 29.7893C15.8167 29.9241 14.9846 29.9944 14.135 29.9944C13.2854 29.9944 12.4534 29.9241 11.6448 29.7893C11.1057 29.7014 10.6956 29.2795 10.5784 28.7463L9.84596 25.4006C8.92018 25.0198 8.05299 24.5159 7.26784 23.9124L4.01002 24.9553C3.4944 25.1194 2.92018 24.9729 2.57448 24.5569C2.09987 23.9827 1.66627 23.3733 1.27956 22.7288L1.00417 22.2541C0.646744 21.6096 0.336197 20.9417 0.0783842 20.2444C-0.109116 19.7346 0.0490873 19.1663 0.453384 18.803L2.99049 16.4944C2.92604 16.0022 2.89088 15.5042 2.89088 15.0002C2.89088 14.4963 2.92604 13.9983 2.99049 13.512L0.453384 11.2034C0.0490873 10.8401 -0.109116 10.2717 0.0783842 9.76196C0.336197 9.0647 0.646744 8.39673 1.00417 7.7522L1.27956 7.27759C1.66627 6.63306 2.09987 6.02368 2.57448 5.44946C2.92018 5.02759 3.4944 4.88696 4.01002 5.05103L7.2737 6.08813C8.05885 5.48462 8.92604 4.98071 9.85182 4.59985L10.5842 1.25415C10.7014 0.720947 11.1116 0.299072 11.6506 0.211182C12.4592 0.0705566 13.2913 0.000244141 14.1409 0.000244141C14.9905 0.000244141 15.8225 0.0705566 16.6311 0.205322C17.1702 0.293213 17.5803 0.715088 17.6975 1.24829L18.4299 4.59399C19.3557 4.97485 20.2229 5.47876 21.0081 6.08228L24.2717 5.04517C24.7874 4.8811 25.3616 5.02759 25.7073 5.4436C26.1819 6.01782 26.6155 6.6272 27.0022 7.27173L27.2776 7.74634C27.635 8.39087 27.9456 9.05884 28.2034 9.7561L28.1975 9.76196ZM14.1409 19.6877C15.3841 19.6877 16.5764 19.1939 17.4554 18.3148C18.3345 17.4357 18.8284 16.2434 18.8284 15.0002C18.8284 13.757 18.3345 12.5648 17.4554 11.6857C16.5764 10.8066 15.3841 10.3127 14.1409 10.3127C12.8977 10.3127 11.7054 10.8066 10.8263 11.6857C9.94724 12.5648 9.45338 13.757 9.45338 15.0002C9.45338 16.2434 9.94724 17.4357 10.8263 18.3148C11.7054 19.1939 12.8977 19.6877 14.1409 19.6877Z" />
                        </svg>
                        <p>

                        Settings
                        </p>
                    </Link>
                 
                    <a  onClick={NotificationButton} className="navItem notif" >

                        <div className="Dropdownbutton">

                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/></svg>
                    <p>

                        Notificatios 
                    </p>
                        </div>
                        
                
            <div className={`dropdownMenu ${NotifDropdown ? "active" : ""}`}>
                <h2 className="topH">
                    Notification <img onClick={()=>setNotifDropdown(!NotifDropdown)} src={close} alt="" />

                </h2>
                <div className="NotificationContainer">

                {
                    Notifications.length == 0 ? <p className='null'>No Notifications</p> :  Notifications.map(notification=>{
                        return(
                            
                            notification.type == "msg" ?
                            <a href="" className={`notification ${notification.seen == true ? "" : "unseen"}`}>
                                <img src={`http://localhost:8000/uploads/${notification.notification.dp}`} alt="" />
                                <div className='notifContent'>
                                    <p>{notification.notification.name} Sent You a Message</p>
                                    <p>{notification.time}</p>
                                </div>
                            </a>
                            : notification.type == "follow" ? 
                            <a href='' className="notification">
                                <img src="./Images/exUser.png" alt="" />
                                <div className='notifContent'>
                                    <p>John Doe Sent You a Message</p>
                                    <p>17:00 PM</p>
                                </div>
                                <div className="btns">
                                    <button className="btn">Follow Back</button>
                                </div>
                            </a>
                            : 
                            <a href='' className="notification">
                            <img src={`http://localhost:8000/uploads/${notification.notification.dp}`} alt="" />
                            <div className='notifContent'>
                                <p>{notification.notification.name} Shared a Post</p>
                                <p>{notification.time}</p>
                            </div>
                            <div className="btns">
                                <button className="btn">Follow Back</button>
                            </div>
                        
                            </a>
                )
            })
        }
                </div>

            </div>
            
                    </a>
                    <a  className="navItem user" onClick={()=>setprofileDropdown(!profileDropdown)}>
                        <div className="Dropdownbutton">

                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                    <p>

                        More
                    </p>
                        </div>
                        <div className={`dropdownMenu ${profileDropdown ? "active" : ""}`}>
                            <Link to={`/user/${authUser._id}`}>My Account</Link>
                            <Link to="/editProfile">Edit Profile</Link>
                            <p  style={{borderTop : "1px solid grey", display : "flex", cursor : "pointer"}} onClick={()=>{
                                localStorage.removeItem("token")
                                window.location.href = "/login"
                            }}>Logout</p>
                </div>
                    </a>
                </div>
            </div>
            
            {/* <div className="userDetails">
                <h2 className="topH">
                    ABOUT
                </h2>
                <div className="details">
                    <div>
                        <h2>Location</h2>
                        <p>{user.city}, {user.country}</p>
                    </div>

                    <div>
                        <h2>Email</h2>
                        <p>{user.email}</p>
                    </div>
                    <div>
                        <h2>Phone</h2>
                        <p>{user.phone}</p>
                    </div>
                    <div>
                        <h2>Relationship Status</h2>
                        <p>{user.rlp}</p>
                    </div>
                    <div>
                        <h2>Gender</h2>
                        <p>{user.gender}</p>
                    </div>
                </div>
            </div> */}
        </div>
        </>

    )
}

export default sideNav