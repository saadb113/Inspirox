import React, { useEffect, useState } from 'react'
import Logo from '../Images/logo.png'

const Loginregister = () => {

  const [username, setuser] = useState("")
  const [password, setpassword] = useState("")
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [currentPanel, setcurrentPanel] = useState("login")
  const login = async (e) => {
    e.preventDefault()
    fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      }),
    })
      .then((res) => {
        if (res.status == 404) {
          alert("User not found")
        } else if (res.status == 401) {
          alert("Wrong Credentials!")
        } else if (res.status == 200) {
          return res.json();
        } else {
          alert("An Error Occured")
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.token)
        window.location.href = "/"
      })

    // console.log(api)
  }
  const register = async (e) => {
    e.preventDefault()

    fetch('http://localhost:8000/register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
      }),
    })
      .then((res) => {
        if (res.status == 401) {

          alert("User Already Exists")
        } else if (res.status == (200)) {
          alert("User Created Successfully, Please Login")
          window.location.href = "/"

        } else {
          alert("An Error Occured")
        }
      })


  }
  return (
    <>


      <div className="container LoginRegister">
        <div className="left">
          <img src={Logo} style={{maxHeight : "30px"}} className='logo' alt="" />
          <h2>Welcome</h2>
        </div>
        <div className="right">
          <div className="box">

            <div className="topButton">
              <p className={currentPanel == "login" ? "active" : ""} onClick={() => setcurrentPanel("login")}>Login</p>
              <p className={currentPanel == "register" ? "active" : ""} onClick={() => setcurrentPanel("register")}>Register</p>
              <div className={`bg ${currentPanel == "register" ? "registerbg" : "loginbg"}`} ></div>
            </div>
            <form onSubmit={(e)=>register(e)} className={`panel register ${currentPanel == "register" ? "active" : ""}`}>

              <div className="inputs">
                <div className="input">
                  <label htmlFor="">Full Name</label>
                  <input required type="text" onChange={(e) => setname(e.target.value)} placeholder='Enter Full Name' />
                </div>
                <div className="input">
                  <label htmlFor="">Username</label>
                  <input required type="text"  onChange={(e) => setuser(e.target.value)} placeholder='Enter Username' />
                </div>
              </div>

              <div className="input">
                <label htmlFor="">Email</label>
                <input type="email" onChange={(e) => setemail(e.target.value)} placeholder='Enter Email Address' />
              </div>
              <div className="input">
                <label htmlFor="">Password</label>
                <input required type="password" onChange={(e) => setpassword(e.target.value)} placeholder='Enter Password' />
              </div>
              <div className="input">
                <label htmlFor="">Confirm Password</label>
                <input required type="password" placeholder='Enter Confirm Password' />
              </div>
             
              <a onClick={() => setcurrentPanel("login")}><span>Already a User?</span> Sign in</a>
              <button type='submit' className="btn">
                Register
              </button>
            </form>
            <form onSubmit={(e)=>login(e)} className={`panel login ${currentPanel == "login" ? "active" : ""}`}>
              <div className="input">
                <label htmlFor="">Username</label>
                <input type="text" required onChange={(e) => setuser(e.target.value)} placeholder='Enter Username' />
              </div>
              <div className="input">
                <label htmlFor="">Password</label>
                <input type="password" required onChange={(e) => setpassword(e.target.value)} placeholder='Enter Password' />
              </div>
              <a onClick={() => setcurrentPanel("register")}>Create a new account</a>
              <button className="btn">
                Login
              </button>
            </form>
          </div>


        </div>
      </div>
    </>

  )
}

export default Loginregister