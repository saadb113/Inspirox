
import { useContext, useEffect, useState } from 'react';
import './App.css'
import Home from "./Pages/Home"
import Loginregister from './Pages/loginregister'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EditProfile from './Pages/EditProfile';
import State from './context/state';
import Message from './Pages/Message';
import Settings from './Pages/Settings';
import Context from "./context/context"


function App() {
  const [userId, setuserId] = useState("")
  const apis = useContext(Context)
  const [user, setuser] = useState({})
  
  const Authentication = ()=>{
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
        setuserId(data.data[0]._id)
        setuser(data.data[0])
    
    // console.log(data.data[0].username)
      })
      .catch((error) => {
        console.error('Fetch Error:', error);
      });
  }
  useEffect(() => {
    
    Authentication()
    // settoken(localStorage.getItem("token"))
    

  }, [userId]);
  return (
    <>
    <State>
      <Router>
        <Routes>
                <Route exact path="/login" Component={Loginregister}/>
                <Route exact path="/" element={userId ? <Home path={"home"} user={user}/> : <Loginregister />}/>
                <Route exact path="/friends" element={userId ? <Home path={"friends"} user={user} /> : <Loginregister />}/>
                <Route exact path="/user/:userId" element={userId ? <Home path={"profile"} user={user} /> : <Loginregister />}/>
                <Route exact path="/search/:keyword" element={userId ? <Home path={"search"} user={user} /> : <Loginregister />}/>
                <Route exact path="/editprofile" element={userId ? <EditProfile user={user} /> : <Loginregister />}/>
                <Route exact path="/settings" element={userId ? <Settings user={user} /> : <Loginregister />}/>
                <Route exact path="/message" element={userId ? <Message user={user} /> : <Loginregister />}/>
        </Routes>
      </Router>
    </State>
    </>
  )
}

export default App
