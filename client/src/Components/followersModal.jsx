import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Context from '../context/context'
import close from '../Images/close.png'

const followersModal = ({authUser, modalType,openUserModal }) => {

  const apis = useContext(Context)
    const [Modal, setModal] = useState(modalType)
    const [Followers, setFollowers] = useState({})
    const [Following, setFollowing] = useState({})
    const getFollowersDetails = () => {
        const FollowersRequests = authUser.followers.map((element) => {
            
            return apis.getSpecificUser(element);
        });
        Promise.all(FollowersRequests)
        .then((responses) => {
            const updatedUserData = {};
            responses.forEach((data) => {
                const { _id, username, name, dp } = data;
                updatedUserData[_id] = { username, name, dp };
            });
            setFollowers(updatedUserData);

        })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }
    const getFollowingDetails = () => {
        const FollowingRequests = authUser.following.map((element) => {
            return apis.getSpecificUser(element);
        });
        Promise.all(FollowingRequests)
            .then((responses) => {
                const updatedUserData = {};
                responses.forEach((data) => {
                    const { _id, username, name, dp } = data;
                    updatedUserData[_id] = { username, name, dp };
                });

                setFollowing(updatedUserData);
                
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }
    useEffect(() => {


        getFollowersDetails()
        getFollowingDetails()

    }, [authUser])
      const reversedFollowers = [...authUser.followers].reverse()
      const reversedFollowing = [...authUser.following].reverse()
  return (
    <div className="usersModal">
        <div className="bg" onClick={()=>openUserModal(false, modalType)}></div>
    { Modal == "followers" ?

        <div className="modal">
            <h2 className="topH">
                My Followers
                <img src={close} alt="" onClick={() => openUserModal(false, "followers")} />
            </h2>
            {Object.keys(Followers).length !== 0 &&
                reversedFollowers.map((element, index) => {
                 
                    const { username, name, dp } = Followers[element]
                    return (

                        <div className="user" key={index}>
                            <img src={`http://localhost:8000/uploads/${dp}`} alt="" />
                            <Link to={`/user/${element}`} onClick={() => openUserModal(false, "followers")} className="username">
                                <h2>{name}</h2>
                                <p>@{username}</p>
                            </Link>
                            {

                                authUser.following.includes(element) ?
                                    <button className='btn Followed' onClick={(event) => follow(event, element, false)}>
                                        Unfollow
                                    </button> :
                                    <button className='btn ' onClick={(event) => follow(event, element, true)}>
                                        Follow
                                    </button>
                            }
                        </div>
                    )
                })
            }


        </div>
        : Modal == "following" ?
            <div className="modal">
                <h2 className="topH">
                    My Following
                    <img src={close} alt="" onClick={() => openUserModal(false, "following")} />

                </h2>

                {
                    Object.keys(Following).length !== 0  && 
                    reversedFollowing.map((element, index) => {
                
                        const { username, name, dp } = Following[element]
                        return (

                            <div className="user" key={index}>

                                <img src={`http://localhost:8000/uploads/${dp}`} alt="" />
                                <Link to={`/user/${element}`} onClick={() => openUserModal(false, "following")} className="username">
                                    <h2>{name}</h2>
                                    <p>@{username}</p>
                                </Link>
                                {
                                    authUser.following.includes(element) ?
                                        <button className='btn Followed' onClick={(event) => follow(event, element, false)}>
                                            Unfollow
                                        </button> :
                                        <button className='btn ' onClick={(event) => follow(event, element, true)}>
                                            Follow
                                        </button>
                                }
                            </div>
                        )
                    })
                }


            </div> : ""
    }

</div>
  )
}

export default followersModal